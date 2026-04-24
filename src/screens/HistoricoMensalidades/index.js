import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { mensalidadesService } from '../../services';
import {
  construirMesesPeriodo,
  formatarDataBR,
  formatarMesAno,
  formatarMoedaBR,
  obterChaveMes,
  obterMesAtual,
  parseDataISO,
} from '../../utils/formatters';
import AppAlertModal from '../../components/AppAlertModal';
import styles from './styles';


const extrairListaMensalidades = (resposta) => {
  const lista = resposta?.mensalidades ?? resposta?.data?.mensalidades ?? resposta?.data ?? [];
  return Array.isArray(lista) ? lista : [];
};

const extrairPeriodoAulas = (resposta, lista) => {
  const fallback = lista?.[0] || {};

  const dataInicio =
    resposta?.data_inicio_aulas ??
    resposta?.data?.data_inicio_aulas ??
    fallback?.data_inicio_aulas ??
    null;

  const dataFim =
    resposta?.data_fim_aulas ??
    resposta?.data?.data_fim_aulas ??
    fallback?.data_fim_aulas ??
    null;

  return {
    inicio: parseDataISO(dataInicio),
    fim: parseDataISO(dataFim),
  };
};

export default function HistoricoMensalidades() {
  const mesAtual = useMemo(() => obterMesAtual(), []);
  const chaveMesAtual = useMemo(() => obterChaveMes(mesAtual.mes, mesAtual.ano), [mesAtual]);

  const [busca, setBusca] = useState('');
  const [mesesPeriodo, setMesesPeriodo] = useState([]);
  const [mesSelecionadoKey, setMesSelecionadoKey] = useState(chaveMesAtual);
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [erro, setErro] = useState('');
  const [alertErro, setAlertErro] = useState({ visible: false, title: '', message: '' });
  const [salvandoId, setSalvandoId] = useState(null);
  const [selectMesAberto, setSelectMesAberto] = useState(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const carregarMensalidades = async () => {
      const requestId = ++requestIdRef.current;
      const [anoStr, mesStr] = mesSelecionadoKey.split('-');
      const ano = Number(anoStr);
      const mes = Number(mesStr);

      if (!ano || !mes) {
        setErro('Mes invalido para consulta.');
        setLoading(false);
        setDados([]);
        return;
      }

      try {
        setLoading(true);
        setErro('');

        const resposta = await mensalidadesService.getMensalidades({
          mes,
          ano,
        });

        if (requestId !== requestIdRef.current) {
          return;
        }

        const lista = extrairListaMensalidades(resposta);
        const periodo = extrairPeriodoAulas(resposta, lista);
        const temPeriodo = Boolean(periodo.inicio || periodo.fim);

        if (temPeriodo) {
          const meses = construirMesesPeriodo(periodo.inicio, periodo.fim, mesAtual);

          if (meses.length > 0) {
            setMesesPeriodo(meses);

            const mesExisteNoPeriodo = meses.some((item) => item.key === mesSelecionadoKey);
            if (!mesExisteNoPeriodo) {
              const existeMesAtual = meses.some((item) => item.key === chaveMesAtual);
              const padrao = existeMesAtual ? chaveMesAtual : meses[meses.length - 1]?.key;

              if (padrao && padrao !== mesSelecionadoKey) {
                setMesSelecionadoKey(padrao);
                return;
              }
            }
          }
        } else {
          setMesesPeriodo((anterior) => {
            if (anterior.length > 0) {
              return anterior;
            }

            return [
              {
                key: mesSelecionadoKey,
                mes,
                ano,
                label: formatarMesAno(ano, mes, ''),
              },
            ];
          });
        }

        const formatadas= lista.map((item, index) => {
          const rgAluno = String(item?.rg_aluno ?? '');
          const pago = Number(item?.pago) === 1;
          const status = pago ? 'Pago' : 'Pendente';
          const nomeAluno = String(item?.nome_aluno ?? '').trim();

          return {
            id: String(item?.id ?? `${rgAluno || 'mensalidade'}-${item?.ano ?? ano}-${item?.mes ?? mes}-${index}`),
            rgAluno,
            nome: nomeAluno || `RG ${rgAluno || 'N/A'}`,
            status,
            valor: formatarMoedaBR(item?.valor),
            mesReferencia: formatarMesAno(Number(item?.ano ?? ano), Number(item?.mes ?? mes), 'N/A'),
            dataPagamento: formatarDataBR(item?.data_pagamento, '') || undefined,
            pagoViaPix: item?.pago_via_pix === true || Number(item?.pago_via_pix) === 1,
            idPagamento: item?.id_pagamento ?? null,
          };
        });

        setDados(formatadas);
      } catch (error) {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setErro(error?.message || 'Erro ao carregar mensalidades.');
        setDados([]);
      } finally {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setLoading(false);
        setRefreshing(false);
      }
    };

    carregarMensalidades();
  }, [mesSelecionadoKey, mesAtual, chaveMesAtual, refreshKey]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshKey(k => k + 1);
  }, []);

  const mesSelecionado = useMemo(
    () => mesesPeriodo.find((item) => item.key === mesSelecionadoKey) || null,
    [mesesPeriodo, mesSelecionadoKey]
  );

  const mensalidadesFiltradas = useMemo(() => {
    return dados.filter(item => {
      const matchBusca = item.nome.toLowerCase().includes(busca.toLowerCase());
      return matchBusca;
    });
  }, [busca, dados]);

  const handleTogglePagamento = async (item) => {
    if (item.pagoViaPix) {
      return;
    }

    const novoPago = item.status !== 'Pago';
    const hoje = new Date().toLocaleDateString('pt-BR');
    const estadoAnterior = dados;

    setDados((prev) =>
      prev.map((registro) =>
        registro.id === item.id
          ? {
              ...registro,
              status: novoPago ? 'Pago' : 'Pendente',
              dataPagamento: novoPago ? hoje : undefined,
            }
          : registro
      )
    );

    try {
      setSalvandoId(item.id);
      await mensalidadesService.setMensalidadePago({
        id: item.id,
        pago: novoPago,
      });
    } catch (error) {
      setDados(estadoAnterior);
      setAlertErro({
        visible: true,
        title: 'Erro',
        message: error?.message || 'Não foi possível atualizar a mensalidade.',
      });
    } finally {
      setSalvandoId(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      >
        {/* BUSCA PADRONIZADA */}
        <View style={styles.buscaWrapper}>
          <Ionicons name="search-outline" size={20} color={colors.textPlaceholder} />
          <TextInput
            style={styles.buscaInput}
            placeholder="Buscar por nome do aluno..."
            placeholderTextColor={colors.textPlaceholder}
            value={busca}
            onChangeText={setBusca}
          />
        </View>

        {/* FILTRO DE MES (SELECT) */}
        <View style={styles.selectContainer}>
          <TouchableOpacity
            style={styles.selectTrigger}
            onPress={() => setSelectMesAberto((prev) => !prev)}
          >
            <Text style={styles.selectTriggerTexto}>
              {mesSelecionado ? mesSelecionado.label : 'Selecione o mes'}
            </Text>
            <Ionicons
              name={selectMesAberto ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          {selectMesAberto && (
            <View style={styles.selectLista}>
              {mesesPeriodo.map((mes) => {
                const ativo = mesSelecionadoKey === mes.key;

                return (
                  <TouchableOpacity
                    key={mes.key}
                    style={[styles.selectItem, ativo && styles.selectItemAtivo]}
                    onPress={() => {
                      setMesSelecionadoKey(mes.key);
                      setSelectMesAberto(false);
                    }}
                  >
                    <Text style={[styles.selectItemTexto, ativo && styles.selectItemTextoAtivo]}>{mes.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.secaoHeader}>
          <Text style={styles.secaoTitulo}>
              {mesSelecionado ? `Mensalidades: ${mesSelecionado.label}` : 'Mensalidades'}
          </Text>
        </View>

        {/* LISTAGEM DE ALUNOS (ESTILO FLAT CARDS) */}
        <View style={styles.listaContainer}>
          {loading ? (
            <View style={styles.estadoContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.estadoTexto}>Carregando mensalidades...</Text>
            </View>
          ) : erro ? (
            <View style={styles.estadoContainer}>
              <Ionicons name="alert-circle-outline" size={44} color={colors.error} />
              <Text style={styles.estadoTexto}>{erro}</Text>
            </View>
          ) : mensalidadesFiltradas.length === 0 ? (
            <View style={styles.estadoContainer}>
              <Ionicons name="document-text-outline" size={44} color={colors.textPlaceholder} />
              <Text style={styles.estadoTexto}>Nenhuma mensalidade encontrada.</Text>
            </View>
          ) : mensalidadesFiltradas.map((item) => {
            const isPago = item.status === 'Pago';
            return (
              <View key={item.id} style={styles.cardAluno}>
                <View style={{ flex: 1 }}>
                  <View style={[styles.statusPilula, isPago ? styles.statusVerde : styles.statusVermelho]}>
                    <Text style={[styles.statusTexto, isPago ? styles.statusTextoVerde : styles.statusTextoVermelho]}>
                      {item.status.toUpperCase()}
                    </Text>
                  </View>
                  
                  <Text style={[styles.nomeAluno, !isPago && { color: colors.error }]}>
                    {item.nome}
                  </Text>
                  <Text style={styles.rgAluno}>RG {item.rgAluno}</Text>

                  <View style={styles.infoFinanceira}>
                      <Text style={styles.valorTexto}>{item.valor}</Text>
                      {isPago && item.dataPagamento && (
                        <Text style={styles.dataTexto}> • Pago em {item.dataPagamento}</Text>
                      )}
                  </View>
                  <Text style={styles.mesRefTexto}>Referente a {item.mesReferencia}</Text>
                </View>

                <View style={styles.switchWrapper}>
                  <Text style={styles.labelSwitch}>PAGO</Text>
                  <Switch
                    trackColor={{ false: colors.borderStrong, true: colors.primaryBorder }}
                    thumbColor={isPago ? colors.primary : colors.textPlaceholder}
                    onValueChange={() => handleTogglePagamento(item)}
                    value={isPago}
                    disabled={salvandoId === item.id || item.pagoViaPix}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <AppAlertModal
        visible={alertErro.visible}
        title={alertErro.title}
        message={alertErro.message}
        variant="error"
        onRequestClose={() => setAlertErro({ visible: false, title: '', message: '' })}
      />
    </SafeAreaView>
  );
}





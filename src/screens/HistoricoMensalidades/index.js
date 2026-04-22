import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  Alert
} from 'react-native';
import { colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { mensalidadesService } from '../../services';
import {
  construirMesesPeriodo,
  formatarDataBR,
  formatarMesAno,
  formatarMoedaBR,
  MesReferencia,
  obterChaveMes,
  obterMesAtual,
  parseDataISO,
} from '../../utils/formatters';
import styles from './styles';

const VERDE = '#16a34a';
const VERMELHO = '#dc2626';

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

export default function HistoricoMensalidades({ navigation }) {
  const mesAtual = useMemo(() => obterMesAtual(), []);
  const chaveMesAtual = useMemo(() => obterChaveMes(mesAtual.mes, mesAtual.ano), [mesAtual]);

  const [busca, setBusca] = useState('');
  const [mesesPeriodo, setMesesPeriodo] = useState([]);
  const [mesSelecionadoKey, setMesSelecionadoKey] = useState(chaveMesAtual);
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
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

        console.log('Erro ao carregar mensalidades:', error);
        setErro(error?.message || 'Erro ao carregar mensalidades.');
        setDados([]);
      } finally {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setLoading(false);
      }
    };

    carregarMensalidades();
  }, [mesSelecionadoKey, mesAtual, chaveMesAtual]);

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
      console.log('Erro ao atualizar mensalidade:', error);
      setDados(estadoAnterior);
      Alert.alert('Erro', error?.message || 'NÃ£o foi possÃ­vel atualizar a mensalidade.');
    } finally {
      setSalvandoId(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* BUSCA PADRONIZADA */}
        <View style={styles.buscaWrapper}>
          <Ionicons name="search-outline" size={20} color="#94a3b8" />
          <TextInput 
            style={styles.buscaInput}
            placeholder="Buscar por nome do aluno..."
            placeholderTextColor="#94a3b8"
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
              color="#64748b"
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
              <Ionicons name="alert-circle-outline" size={44} color={VERMELHO} />
              <Text style={styles.estadoTexto}>{erro}</Text>
            </View>
          ) : mensalidadesFiltradas.length === 0 ? (
            <View style={styles.estadoContainer}>
              <Ionicons name="document-text-outline" size={44} color="#94a3b8" />
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
                  
                  <Text style={[styles.nomeAluno, !isPago && { color: VERMELHO }]}>
                    {item.nome}
                  </Text>
                  <Text style={styles.rgAluno}>RG {item.rgAluno}</Text>

                  <View style={styles.infoFinanceira}>
                      <Text style={styles.valorTexto}>{item.valor}</Text>
                      {isPago && item.dataPagamento && (
                        <Text style={styles.dataTexto}> â€¢ Pago em {item.dataPagamento}</Text>
                      )}
                  </View>
                  <Text style={styles.mesRefTexto}>Referente a {item.mesReferencia}</Text>
                </View>

                <View style={styles.switchWrapper}>
                  <Text style={styles.labelSwitch}>PAGO</Text>
                  <Switch
                    trackColor={{ false: '#cbd5e1', true: colors.primaryBorder }}
                    thumbColor={isPago ? colors.primary : '#94a3b8'}
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
    </SafeAreaView>
  );
}



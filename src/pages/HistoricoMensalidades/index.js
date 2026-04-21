import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors } from '../../global/colors';
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
      Alert.alert('Erro', error?.message || 'Não foi possível atualizar a mensalidade.');
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
                        <Text style={styles.dataTexto}> • Pago em {item.dataPagamento}</Text>
                      )}
                  </View>
                  <Text style={styles.mesRefTexto}>Referente a {item.mesReferencia}</Text>
                </View>

                <View style={styles.switchWrapper}>
                  <Text style={styles.labelSwitch}>PAGO</Text>
                  <Switch
                    trackColor={{ false: '#cbd5e1', true: '#bbf7d0' }}
                    thumbColor={isPago ? VERDE : '#94a3b8'}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  buscaWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#ffffff', 
    borderRadius: 16, 
    marginHorizontal: 20, 
    marginTop: 20, 
    paddingHorizontal: 15, 
    borderWidth: 1, 
    borderColor: '#e2e8f0', 
    height: 55 
  },
  buscaInput: { flex: 1, fontSize: 15, color: '#1e293b', marginLeft: 10 },

  selectContainer: { paddingHorizontal: 20, marginTop: 15 },
  selectTrigger: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectTriggerTexto: { fontSize: 14, fontWeight: '700', color: '#334155' },
  selectLista: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  selectItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  selectItemAtivo: { backgroundColor: '#eff6ff' },
  selectItemTexto: { fontSize: 14, color: '#475569', fontWeight: '600' },
  selectItemTextoAtivo: { color: colors.primary, fontWeight: '800' },

  secaoHeader: { paddingHorizontal: 20, paddingTop: 25, paddingBottom: 12 },
  secaoTitulo: { fontSize: 11, fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 },

  listaContainer: { paddingHorizontal: 20 },
  estadoContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  estadoTexto: { marginTop: 12, fontSize: 14, fontWeight: '600', color: '#475569', textAlign: 'center' },
  cardAluno: { 
    backgroundColor: '#ffffff', 
    marginBottom: 10, 
    padding: 18, 
    borderRadius: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#e2e8f0' 
  },
  nomeAluno: { fontSize: 16, fontWeight: '800', color: colors.primary, marginTop: 8 },
  rgAluno: { fontSize: 11, color: '#94a3b8', fontWeight: '700', marginTop: 2 },
  infoFinanceira: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  valorTexto: { fontSize: 13, fontWeight: '700', color: '#475569' },
  dataTexto: { fontSize: 11, fontWeight: '600', color: VERDE },
  mesRefTexto: { fontSize: 11, color: '#94a3b8', fontWeight: '600', marginTop: 4 },

  statusPilula: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, alignSelf: 'flex-start' },
  statusVerde: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' },
  statusVermelho: { backgroundColor: '#fef2f2', borderColor: '#fca5a5' },
  statusTexto: { fontSize: 8, fontWeight: '900' },
  statusTextoVerde: { color: VERDE },
  statusTextoVermelho: { color: VERMELHO },

  switchWrapper: { alignItems: 'center', marginLeft: 15 },
  labelSwitch: { fontSize: 8, fontWeight: '900', color: '#94a3b8', marginBottom: 4 }
});
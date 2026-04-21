import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
  ActivityIndicator,
  Alert
} from 'react-native';
import { colors } from '../../global/colors';
import { Ionicons } from '@expo/vector-icons';
import { alunosService } from '../../services/alunosService';
import { mensalidadesService } from '../../services/mensalidadesService';
import { maskApenasNumeros, maskCPF, maskData, maskTelefone } from '../../utils/masks';
import { formatarMesAno } from '../../utils/formatters';

const getIniciais = (nomeCompleto) => {
  if (!nomeCompleto) return '??';
  const nomes = nomeCompleto.trim().split(/\s+/);
  const primeira = nomes[0][0].toUpperCase();
  const ultima = nomes.length > 1 ? nomes[nomes.length - 1][0].toUpperCase() : '';
  return `${primeira}${ultima}`;
};

const VERDE = '#16a34a';
const VERMELHO = '#dc2626';

const toNumeroSeguro = (valor) => {
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : null;
};

export default function FichaAluno({ navigation, route }) {
  const [verTodoFinanceiro, setVerTodoFinanceiro] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salvandoMensalidadeId, setSalvandoMensalidadeId] = useState(null);
  
  const [aluno, setAluno] = useState({
    nome: '',
    rg: '',
    nome_categoria: '',
    nome_responsavel: '',
    telefone: '',
    data_nascimento: '',
    frequencia: 0,
    faltas: 0,
    historicoPresenca: [],
    historicoPagamentos: []
  });

  const temHistoricoPresenca = aluno.historicoPresenca.length > 0;
  const temHistoricoFinanceiro = aluno.historicoPagamentos.length > 0;
  const temFrequencia = aluno.frequencia !== null && aluno.frequencia !== undefined && aluno.frequencia !== '';

  useEffect(() => {
    const carregarAluno = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const rg = route?.params?.rg;
        
        if (!rg) {
          setError('RG não informado');
          setLoading(false);
          return;
        }

        const dadosAluno = await alunosService.getAlunoRg(rg);
        
        if (dadosAluno) {
          const presencas = Array.isArray(dadosAluno.presencas) ? dadosAluno.presencas : [];
          const mensalidades = Array.isArray(dadosAluno.mensalidades) ? dadosAluno.mensalidades : [];

          const historicoPresenca = presencas
            .slice()
            .sort((a, b) => new Date(a?.data_presenca || 0).getTime() - new Date(b?.data_presenca || 0).getTime())
            .map((item) => ({
              id: item?.id ?? `${item?.data_presenca ?? 'presenca'}-${item?.rg_aluno ?? rg}`,
              data: item?.data_presenca ? item.data_presenca.slice(0, 10).split('-').reverse().join('/') : 'N/A',
              status: Number(item?.presente) === 1 ? 'P' : Number(item?.presente) === 0 ? 'F' : 'N',
            }));

          const historicoPagamentos = mensalidades.map((item) => ({
            id: item?.id ?? `${item?.ano ?? 'ano'}-${item?.mes ?? 'mes'}-${item?.rg_aluno ?? rg}`,
            mes: item?.ano && item?.mes ? formatarMesAno(item.ano, item.mes) : 'N/A',
            valor: item?.valor ?? '0.00',
            status: Number(item?.pago) === 1 ? 'Pago' : 'Pendente',
            pagoViaPix: item?.pago_via_pix === true || Number(item?.pago_via_pix) === 1,
          }));

          setAluno({
            nome: dadosAluno.nome || '',
            rg: dadosAluno.rg_aluno || '',
            nome_categoria: dadosAluno.nome_categoria || 'N/A',
            nome_responsavel: dadosAluno.nome_responsavel || 'N/A',
            telefone: dadosAluno.telefone || '',
            data_nascimento: dadosAluno.data_nascimento || '',
            frequencia: toNumeroSeguro(dadosAluno.frequencia),
            faltas: toNumeroSeguro(dadosAluno.faltas),
            historicoPresenca,
            historicoPagamentos,
          });
        } else {
          setError('Erro ao carregar dados do aluno');
        }
      } catch (err) {
        console.log('Erro ao buscar aluno:', err);
        setError(err.message || 'Erro ao carregar dados do aluno');
      } finally {
        setLoading(false);
      }
    };

    carregarAluno();
  }, [route?.params?.rg]);

  const handleTogglePagamento = async (id, novoValor) => {
    const pagamentoAtual = aluno.historicoPagamentos.find((p) => p.id === id);

    if (!pagamentoAtual || pagamentoAtual.pagoViaPix) {
      return;
    }

    const estadoAnterior = aluno.historicoPagamentos;
    const novoStatus = novoValor ? 'Pago' : 'Pendente';

    setAluno((prev) => ({
      ...prev,
      historicoPagamentos: prev.historicoPagamentos.map((p) =>
        p.id === id ? { ...p, status: novoStatus } : p
      ),
    }));

    try {
      setSalvandoMensalidadeId(id);
      await mensalidadesService.setMensalidadePago({ id, pago: novoValor });
    } catch (err) {
      console.log('Erro ao atualizar mensalidade:', err);
      setAluno((prev) => ({
        ...prev,
        historicoPagamentos: estadoAnterior,
      }));
      Alert.alert('Erro', err?.message || 'Não foi possível atualizar a mensalidade.');
    } finally {
      setSalvandoMensalidadeId(null);
    }
  };

  const handleExcluirAluno = () => {
    const rg = aluno.rg || route?.params?.rg;

    Alert.alert('Excluir aluno', 'Tem certeza que deseja excluir este aluno?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await alunosService.deletarAluno(rg);
            navigation.goBack();
          } catch (err) {
            console.log('Erro ao excluir aluno:', err);
            Alert.alert('Erro', err.message || 'Não foi possível excluir o aluno.');
          }
        },
      },
    ]);
  };

  const pagamentosExibidos = verTodoFinanceiro 
    ? aluno.historicoPagamentos 
    : aluno.historicoPagamentos.slice(0, 2);

  const faltaTexto = temFrequencia ? aluno.faltas ?? 0 : 'Nenhum registro';
  const frequenciaTexto = temFrequencia ? `${aluno.frequencia}%` : 'Nenhum registro';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando dados...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#dc2626" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.btnRetry}
            onPress={() => {
              setLoading(true);
              setError(null);
            }}
          >
            <Text style={styles.btnRetryText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        
        <View style={styles.perfilCard}>
          <View style={styles.avatarIniciais}>
            <Text style={styles.avatarIniciaisTexto}>{getIniciais(aluno.nome)}</Text>
          </View>
          <Text style={styles.nomeAluno}>{aluno.nome}</Text>
          <View style={styles.badgeCategoria}>
            <Text style={styles.badgeCategoriaTexto}>{aluno.nome_categoria.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.labelSecao}>DADOS CADASTRAIS</Text>
          
          <View style={styles.infoBoxFull}>
            <Text style={styles.infoLabel}>NOME COMPLETO</Text>
            <Text style={styles.infoTexto}>{aluno.nome}</Text>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>RG</Text>
              <Text style={styles.infoTexto}>{aluno.rg}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>CATEGORIA</Text>
              <Text style={styles.infoTexto}>{aluno.nome_categoria}</Text>
            </View>
          </View>

          <View style={styles.infoBoxFull}>
            <Text style={styles.infoLabel}>RESPONSÁVEL</Text>
            <Text style={styles.infoTexto}>{aluno.nome_responsavel || 'N/A'}</Text>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>TELEFONE</Text>
              <Text style={styles.infoTexto}>{maskTelefone(aluno.telefone)}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>NASCIMENTO</Text>
              <Text style={styles.infoTexto}>{aluno.data_nascimento}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.secaoHeaderRow}>
            <Text style={styles.labelSecao}>FREQUÊNCIA RECENTE</Text>
            <View style={styles.statsBadgeRow}>
              <Text style={styles.miniStat}>Faltas: {faltaTexto}</Text>
              <Text style={[styles.miniStat, {color: VERDE}]}>{frequenciaTexto}</Text>
            </View>
          </View>

          {temHistoricoPresenca ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingTop: 10}}>
              {aluno.historicoPresenca.map((item, index) => {
                const isPresente = item.status === 'P';
                const statusTexto = item.status === 'P' ? 'P' : item.status === 'F' ? 'F' : '-';

                return (
                  <View key={`${item?.id ?? item?.data ?? 'presenca'}-${index}`} style={styles.aulaItem}>
                    <View style={[styles.aulaCirculo, !isPresente && styles.aulaCirculoFalta]}>
                      <Text style={[styles.aulaStatusTexto, !isPresente && styles.aulaStatusTextoFalta]}>
                        {statusTexto}
                      </Text>
                    </View>
                    <Text style={styles.aulaDataTexto}>{item.data}</Text>
                  </View>
                );
              })}
            </ScrollView>
          ) : (
            <Text style={styles.vazioTexto}>Nenhum registro</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.labelSecao}>HISTÓRICO FINANCEIRO</Text>

          {temHistoricoFinanceiro ? (
            <>
              {pagamentosExibidos.map((pag, index) => {
                const isPago = pag.status === 'Pago';
                const desabilitado = pag.pagoViaPix || salvandoMensalidadeId === pag.id;
                return (
                  <View key={`${pag?.id ?? pag?.mes ?? 'pagamento'}-${index}`} style={[styles.pagamentoLinha, index !== 0 && styles.borderTop]}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.pagamentoMes, !isPago && { color: VERMELHO }]}>{pag.mes}</Text>
                      <Text style={styles.pagamentoValor}>R$ {String(pag.valor ?? '0.00')}</Text>
                      <View style={[styles.statusPilula, isPago ? styles.statusVerde : styles.statusVermelho]}>
                        <Text style={[styles.statusTexto, isPago ? styles.statusTextoVerde : styles.statusTextoVermelho]}>
                          {pag.status.toUpperCase()}
                        </Text>
                      </View>
                      {pag.pagoViaPix && (
                        <Text style={styles.pixInfo}>Pago via PIX</Text>
                      )}
                    </View>
                    {salvandoMensalidadeId === pag.id ? (
                      <View style={styles.loadingSwitchContainer}>
                        <ActivityIndicator size="small" color={colors.primary} />
                      </View>
                    ) : (
                      <Switch
                        trackColor={{ false: '#cbd5e1', true: '#bbf7d0' }}
                        thumbColor={isPago ? VERDE : '#94a3b8'}
                        onValueChange={(valor) => handleTogglePagamento(pag.id, valor)}
                        value={isPago}
                        disabled={desabilitado}
                      />
                    )}
                  </View>
                );
              })}

              <TouchableOpacity style={styles.btnVerMais} onPress={() => setVerTodoFinanceiro(!verTodoFinanceiro)}>
                <Text style={styles.btnVerMaisTexto}>
                  {verTodoFinanceiro ? "Ocultar histórico" : "Ver histórico completo"}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.vazioTexto}>Nenhum registro</Text>
          )}
        </View>

        <View style={styles.footerAcoes}>
          <TouchableOpacity
            style={styles.btnEditar}
            onPress={() => navigation.navigate('cadastroAluno', { id: aluno.rg || route?.params?.rg })}
          >
            <Ionicons name="create-outline" size={20} color="#fff" />
            <Text style={styles.btnEditarTexto}>Editar Ficha</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnExcluir} onPress={handleExcluirAluno}>
            <Ionicons name="trash-outline" size={20} color={VERMELHO} />
          </TouchableOpacity>
        </View>

      </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 20
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
    textAlign: 'center'
  },
  btnRetry: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8
  },
  btnRetryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff'
  },
  
  perfilCard: { 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginBottom: 20
  },
  avatarIniciais: {
    width: 70, height: 70, borderRadius: 25, backgroundColor: '#f1f5f9',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 15
  },
  avatarIniciaisTexto: { fontSize: 32, fontWeight: '800', color: colors.primary },
  nomeAluno: { fontSize: 22, fontWeight: '800', color: colors.primary, textAlign: 'center' },
  badgeCategoria: { backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4, marginTop: 10 },
  badgeCategoriaTexto: { fontSize: 10, fontWeight: '900', color: '#ffffff' },

  card: {
    backgroundColor: '#ffffff', borderRadius: 16, padding: 20, marginHorizontal: 20,
    marginBottom: 15, borderWidth: 1, borderColor: '#e2e8f0'
  },
  labelSecao: { fontSize: 11, fontWeight: '900', color: '#94a3b8', letterSpacing: 1 },
  
  infoGrid: { flexDirection: 'row', gap: 15, marginTop: 15 },
  infoBox: { flex: 1 },
  infoBoxFull: { width: '100%', marginTop: 15 },
  infoLabel: { fontSize: 9, fontWeight: '800', color: '#94a3b8', marginBottom: 4 },
  infoTexto: { fontSize: 15, fontWeight: '700', color: colors.primaryDark },

  secaoHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statsBadgeRow: { flexDirection: 'row', gap: 10 },
  miniStat: { fontSize: 11, fontWeight: '800', color: '#64748b' },

  aulaItem: { alignItems: 'center', marginRight: 15, marginTop: 10 },
  aulaCirculo: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: '#f0fdf4',
    borderWidth: 1, borderColor: '#bbf7d0', alignItems: 'center', justifyContent: 'center', marginBottom: 6
  },
  aulaCirculoFalta: { backgroundColor: '#fef2f2', borderColor: '#fca5a5' },
  aulaStatusTexto: { fontSize: 16, fontWeight: '900', color: VERDE },
  aulaStatusTextoFalta: { color: VERMELHO },
  aulaDataTexto: { fontSize: 10, fontWeight: '700', color: '#94a3b8' },
  vazioTexto: { marginTop: 12, fontSize: 13, color: '#94a3b8', fontWeight: '600' },

  pagamentoLinha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  borderTop: { borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  pagamentoMes: { fontSize: 15, fontWeight: '800', color: colors.primary, marginBottom: 4 },
  pagamentoValor: { fontSize: 12, fontWeight: '700', color: '#64748b', marginBottom: 6 },
  pixInfo: { fontSize: 11, fontWeight: '700', color: '#0f766e', marginTop: 6 },
  loadingSwitchContainer: { width: 50, alignItems: 'center', justifyContent: 'center' },
  statusPilula: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, borderWidth: 1, alignSelf: 'flex-start' },
  statusVerde: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' },
  statusVermelho: { backgroundColor: '#fef2f2', borderColor: '#fca5a5' },
  statusTexto: { fontSize: 8, fontWeight: '900' },
  statusTextoVerde: { color: VERDE },
  statusTextoVermelho: { color: VERMELHO },
  
  btnVerMais: { marginTop: 15, alignItems: 'center' },
  btnVerMaisTexto: { fontSize: 12, fontWeight: '800', color: colors.primary },

  footerAcoes: { flexDirection: 'row', marginHorizontal: 20, marginTop: 10, gap: 12 },
  btnEditar: { 
    flex: 1, backgroundColor: colors.primary, padding: 18, borderRadius: 16, 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 
  },
  btnEditarTexto: { fontSize: 15, fontWeight: '800', color: '#ffffff' },
  btnExcluir: { 
    width: 60, backgroundColor: '#fff', padding: 18, borderRadius: 16, 
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#fca5a5' 
  },
});
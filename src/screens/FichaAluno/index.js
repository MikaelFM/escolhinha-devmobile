import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
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
import { formatarMesAno, obterIniciaisNome } from '../../utils/formatters';
import styles from './styles';

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
            <Text style={styles.avatarIniciaisTexto}>{obterIniciaisNome(aluno.nome)}</Text>
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
                        trackColor={{ false: '#cbd5e1', true: colors.primaryBorder }}
                        thumbColor={isPago ? colors.primary : '#94a3b8'}
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





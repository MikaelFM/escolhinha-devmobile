import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../global/colors';
import { Ionicons } from '@expo/vector-icons';
import { presencaService } from '../../services/presencaService';
import { useAuth } from '../../context/AuthContext';

const VERDE = '#16a34a';
const VERMELHO = '#dc2626';

const formatarDataBR = (valor) => {
  if (!valor) return 'N/A';

  const texto = String(valor).trim();
  const isoMatch = texto.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (isoMatch) {
    return `${isoMatch[3]}/${isoMatch[2]}/${isoMatch[1]}`;
  }

  const data = new Date(texto);
  if (!Number.isNaN(data.getTime())) {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  return texto;
};

const obterDiaSemana = (valor) => {
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) {
    return 'N/A';
  }

  return new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(data)
    .replace(/^./, (letra) => letra.toUpperCase());
};

export default function HistoricoPresencasAluno({ navigation, route }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [historico, setHistorico] = useState([]);
  const { userData } = useAuth();

  const rgAluno = userData?.rg_aluno || '';

  useEffect(() => {
    const carregarHistorico = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!rgAluno) {
          setHistorico([]);
          setError('RG não informado');
          return;
        }

        const resposta = await presencaService.getListaPresencaPorRg(rgAluno);
        const listaBruta = resposta?.data ?? resposta?.historico ?? resposta ?? [];
        const lista = Array.isArray(listaBruta) ? listaBruta : [];

        const historicoFormatado = lista
          .map((item, index) => {
            const dataISO = item?.data_presenca ?? item?.data ?? null;
            const presente = Number(item?.presente) === 1;

            return {
              id: String(item?.id ?? `${rgAluno}-${index}`),
              data: formatarDataBR(dataISO),
              diaSemana: obterDiaSemana(dataISO),
              status: presente ? 'Presente' : 'Falta',
            };
          })
          .sort((a, b) => {
            const dataA = new Date(a.data.split('/').reverse().join('-')).getTime();
            const dataB = new Date(b.data.split('/').reverse().join('-')).getTime();
            return dataB - dataA;
          });

        setHistorico(historicoFormatado);
      } catch (err) {
        console.log('Erro ao carregar histórico de presença:', err);
        setError(err?.message || 'Erro ao carregar histórico de presença');
        setHistorico([]);
      } finally {
        setLoading(false);
      }
    };

    carregarHistorico();
  }, [rgAluno]);

  const stats = useMemo(() => {
    const total = historico.length;
    const presencas = historico.filter((item) => item.status === 'Presente').length;
    const porcentagem = total > 0 ? Math.round((presencas / total) * 100) : 0;
    return { presencas, faltas: total - presencas, porcentagem };
  }, [historico]);

  const PresencaItem = ({ item }) => {
    const isPresente = item.status === 'Presente';

    return (
      <View style={[styles.cardPresenca, !isPresente && styles.cardFalta]}>
        <View style={[styles.iconWrapper, { backgroundColor: isPresente ? '#f0fdf4' : '#fef2f2' }]}>
          <Ionicons
            name={isPresente ? 'checkmark-circle-outline' : 'close-circle-outline'}
            size={24}
            color={isPresente ? VERDE : VERMELHO}
          />
        </View>

        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={styles.dataTitulo}>{item.data} • {item.diaSemana}</Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: isPresente ? '#f0fdf4' : '#fef2f2' }]}>
          <Text style={[styles.statusTexto, { color: isPresente ? VERDE : VERMELHO }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Frequência</Text>
          <Text style={styles.subtitulo}>Acompanhe sua assiduidade nos treinos</Text>
        </View>

        <View style={styles.resumoCard}>
          <View style={styles.resumoItem}>
            <Text style={styles.resumoLabel}>TAXA ATUAL</Text>
            <Text style={[styles.resumoValor, { color: VERDE }]}>{stats.porcentagem}%</Text>
          </View>
          <View style={styles.divisor} />
          <View style={styles.resumoItem}>
            <Text style={styles.resumoLabel}>TOTAL FALTAS</Text>
            <Text style={[styles.resumoValor, { color: VERMELHO }]}>{stats.faltas}</Text>
          </View>
        </View>

        <View style={styles.bottomSheet}>
          <Text style={styles.secaoTitulo}>HISTÓRICO DE AULAS</Text>

          <View style={styles.listaContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color={colors.primary} />
                <Text style={styles.loadingText}>Carregando histórico...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Ionicons name='alert-circle' size={48} color={VERMELHO} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : historico.length > 0 ? (
              historico.map((item) => <PresencaItem key={item.id} item={item} />)
            ) : (
              <Text style={styles.vazioTexto}>Nenhum registro</Text>
            )}
          </View>

          <View style={styles.infoFooter}>
            <Ionicons name='information-circle-outline' size={16} color={colors.textPlaceholder} />
            <Text style={styles.infoFooterTexto}>
              Em caso de divergência na frequência, entre em contato com a secretaria da escolinha.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  bottomSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: 8,
    paddingTop: 12,
    paddingBottom: 24,
    shadowColor: colors.textPlaceholder,
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -8 },
    elevation: 20,
  },
  header: { paddingHorizontal: 20, paddingTop: 60, marginBottom: 20 },
  titulo: { fontSize: 25, fontWeight: '800', color: colors.primary, letterSpacing: -0.5 },
  subtitulo: { fontSize: 14, color: colors.textPlaceholder, marginTop: 4 },

  resumoCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 25,
  },
  resumoItem: { flex: 1, alignItems: 'center' },
  resumoLabel: { fontSize: 9, fontWeight: '900', color: colors.textPlaceholder, letterSpacing: 1, marginBottom: 5 },
  resumoValor: { fontSize: 18, fontWeight: '800', color: colors.primary },
  divisor: { width: 1, backgroundColor: '#e2e8f0', height: '100%' },

  secaoTitulo: {
    fontSize: 11, fontWeight: '900', color: colors.textPlaceholder,
    marginLeft: 20, marginBottom: 15, letterSpacing: 1,
  },

  listaContainer: { marginHorizontal: 20 },
  cardPresenca: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  cardFalta: {
    backgroundColor: '#fff8f8',
    borderRadius: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 0,
    marginBottom: 10,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataTitulo: { fontSize: 16, fontWeight: '700', color: colors.primary },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusTexto: { fontSize: 10, fontWeight: '900' },

  loadingContainer: { paddingVertical: 25, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 10, color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  errorContainer: { paddingVertical: 25, alignItems: 'center', justifyContent: 'center' },
  errorText: { marginTop: 10, color: VERMELHO, fontSize: 13, fontWeight: '600', textAlign: 'center' },
  vazioTexto: { color: colors.textPlaceholder, fontSize: 13, fontWeight: '600', paddingVertical: 12 },

  infoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 30,
    marginTop: 30,
    gap: 8,
    opacity: 0.7,
  },
  infoFooterTexto: { fontSize: 11, color: colors.textSecondary, flex: 1, lineHeight: 16 },
});

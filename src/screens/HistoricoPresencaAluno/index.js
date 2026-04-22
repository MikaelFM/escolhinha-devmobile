import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { colors } from '../../global/colors';
import { Ionicons } from '@expo/vector-icons';
import { presencaService } from '../../services/presencaService';
import { useAuth } from '../../contexts/AuthContext';
import { formatarDataBR } from '../../utils/formatters';
import PresencaItemCard from '../../components/PresencaItemCard';
import styles from './styles';

const VERDE = '#16a34a';
const VERMELHO = '#dc2626';

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
              data: formatarDataBR(dataISO, 'N/A'),
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
              historico.map((item) => (
                <PresencaItemCard
                  key={item.id}
                  styles={styles}
                  item={item}
                  verde={VERDE}
                  vermelho={VERMELHO}
                />
              ))
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





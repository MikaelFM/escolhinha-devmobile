import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { colors } from '../../global/colors';
import { Ionicons } from '@expo/vector-icons';
import { presencaService } from '../../services/presencaService';
import { useAuth } from '../../context/AuthContext';
import styles from './styles';

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
          setError('RG nÃ£o informado');
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
        console.log('Erro ao carregar histÃ³rico de presenÃ§a:', err);
        setError(err?.message || 'Erro ao carregar histÃ³rico de presenÃ§a');
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
          <Text style={styles.dataTitulo}>{item.data} â€¢ {item.diaSemana}</Text>
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
          <Text style={styles.titulo}>FrequÃªncia</Text>
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
          <Text style={styles.secaoTitulo}>HISTÃ“RICO DE AULAS</Text>

          <View style={styles.listaContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color={colors.primary} />
                <Text style={styles.loadingText}>Carregando histÃ³rico...</Text>
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
              Em caso de divergÃªncia na frequÃªncia, entre em contato com a secretaria da escolinha.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


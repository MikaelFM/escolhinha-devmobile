import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../constants/colors';
import { useAuth } from '../../contexts/AuthContext';
import DashboardSummaryCard from '../../components/DashboardSummaryCard';
import DashboardShortcutItem from '../../components/DashboardShortcutItem';
import styles from './styles';

export default function DashboardAluno() {
  const navigation = useNavigation();
  const { userData, atualizarDadosUsuario } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await atualizarDadosUsuario();
    } finally {
      setRefreshing(false);
    }
  }, [atualizarDadosUsuario]);

  const dadosAluno = userData?.['0'] || {};

  const nomeAluno = userData?.nome || userData?.usuario || 'Aluno';
  const categoria = dadosAluno.nome_categoria || '';
  const frequencia = dadosAluno.frequencia
    ? `${parseFloat(dadosAluno.frequencia).toFixed(0)}%`
    : '--';
  const faltas = dadosAluno.faltas ?? '--';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 60, paddingBottom: 30, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      >
        <View style={styles.topHeader}>
          <Text style={styles.saudacao}>Olá, {nomeAluno}</Text>
          {categoria ? (
            <View style={styles.categoriaBadge}>
              <Text style={styles.categoriaTexto}>{categoria}</Text>
            </View>
          ) : null}
          <Text style={styles.subSaudacao}>Confira seu desempenho e suas pendências.</Text>
        </View>

        <View style={styles.gridStats}>
          <DashboardSummaryCard
            styles={styles}
            titulo="Frequência"
            valor={frequencia}
            icone="trending-up"
            corIcone={colors.success}
            corFundoIcone={colors.successLight}
          />
          <DashboardSummaryCard
            styles={styles}
            titulo="Faltas"
            valor={String(faltas)}
            icone="close-circle-outline"
            corIcone={colors.error}
            corFundoIcone={colors.errorLight}
          />
        </View>

        <View style={styles.bottomSheet}>
          <Text style={styles.secaoTitulo}>AÇÕES RÁPIDAS</Text>
          <View style={styles.gridAcoes}>
            <DashboardShortcutItem
              styles={styles}
              icone="calendar-outline"
              titulo="Frequência"
              primeiro
              onPress={() => navigation.navigate('historicoPresencasGeral')}
            />
            <DashboardShortcutItem
              styles={styles}
              icone="card-outline"
              titulo="Mensalidades"
              onPress={() => navigation.navigate('historicoPagamentosAluno')}
            />
            <DashboardShortcutItem
              styles={styles}
              icone="settings-outline"
              titulo="Ajustes"
              ultimo
              onPress={() => navigation.navigate('configuracoesAluno')}
            />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}





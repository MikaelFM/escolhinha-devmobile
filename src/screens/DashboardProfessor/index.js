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
import DashboardSummaryCard from '../../components/DashboardSummaryCard';
import DashboardShortcutItem from '../../components/DashboardShortcutItem';
import { useAuth } from '../../contexts/AuthContext';
import styles from './styles';

export default function DashboardProfessor() {
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

  const nomeExibicao = userData?.nome || userData?.usuario || '';
  const primeiroNome = nomeExibicao ? nomeExibicao.split(' ')[0] : 'Treinador';
  const totalAlunos = userData?.quantidade_alunos ?? '-';
  const frequenciaMedia = userData?.frequencia_media != null
    ? `${parseFloat(userData.frequencia_media).toFixed(0)}%`
    : '-';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 60, paddingBottom: 30, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      >

        <View style={styles.topHeader}>
          <Text style={styles.saudacao}>Olá, {primeiroNome}</Text>
          <Text style={styles.subSaudacao}>Confira o que está acontecendo hoje.</Text>
        </View>

        <View style={styles.gridStats}>
          <DashboardSummaryCard
            styles={styles}
            titulo="Total Alunos"
            valor={String(totalAlunos)}
            icone="people"
          />
          <DashboardSummaryCard
            styles={styles}
            titulo="Freq. Média"
            valor={frequenciaMedia}
            icone="calendar"
          />
        </View>

        <View style={styles.bottomSheet}>

          <Text style={styles.secaoTitulo}>AÇÕES RÁPIDAS</Text>
          <View style={styles.gridAcoes}>
            <DashboardShortcutItem
              styles={styles}
              icone="checkbox"
              titulo="Lançar Chamada"
              onPress={() => navigation.navigate('registroPresenca')}
            />
            <DashboardShortcutItem
              styles={styles}
              icone="person-add"
              titulo="Cadastrar Aluno"
              onPress={() => navigation.navigate('cadastroAluno')}
            />
            <DashboardShortcutItem
              styles={styles}
              icone="cash"
              titulo="Histórico de Mensalidades"
              onPress={() => navigation.navigate('historicoMensalidades')}
            />
            <DashboardShortcutItem
              styles={styles}
              icone="settings"
              titulo="Configurações"
              ultimo
              onPress={() => navigation.navigate('profile')}
            />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}





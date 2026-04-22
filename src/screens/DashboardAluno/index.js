import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar
} from 'react-native';
import { colors } from '../../global/colors';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import DashboardSummaryCard from '../../components/DashboardSummaryCard';
import DashboardShortcutItem from '../../components/DashboardShortcutItem';
import styles from './styles';

const VERDE = '#16a34a';

export default function DashboardAluno() {
  const navigation = useNavigation();
  const { userData } = useAuth();

  const aluno = {
    nome: 'Pedro Henrique',
    categoria: 'Sub-13 Futebol',
    frequencia: '85%',
    presencasNoMes: 10,
    totalAulasMes: 12,
    statusMensalidade: 'Pendente',
    valorMensalidade: 'R$ 150,00',
    vencimento: '10/04'
  };

  const nomeAluno = userData?.nome || aluno.nome;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 60, paddingBottom: 30, flexGrow: 1 }}>
        <View style={styles.topHeader}>
          <Text style={styles.saudacao}>Olá, {nomeAluno}</Text>
          <Text style={styles.subSaudacao}>Confira seu desempenho e suas pendências.</Text>
        </View>

        <View style={styles.gridStats}>
          <DashboardSummaryCard
            styles={styles}
            titulo="Frequência" 
            valor={aluno.frequencia} 
            icone="trending-up" 
            corIcone={VERDE} 
          />
          <DashboardSummaryCard
            styles={styles}
            titulo="Presenças" 
            valor={`${aluno.presencasNoMes}/${aluno.totalAulasMes}`} 
            icone="calendar" 
            corIcone={colors.primary} 
          />
        </View>

        <View style={styles.bottomSheet}>
          <Text style={styles.secaoTitulo}>AÇÕES RÁPIDAS</Text>
          <View style={styles.gridAcoes}>
            <DashboardShortcutItem
              styles={styles}
              icone="list-outline"
              titulo="Minhas Faltas"
              primeiro
              onPress={() => navigation.navigate('HistoricoPresencas')}
            />
            <DashboardShortcutItem
              styles={styles}
              icone="time-outline"
              titulo="Horários"
              onPress={() => navigation.navigate('GradeHorarios')}
            />
            <DashboardShortcutItem
              styles={styles}
              icone="document-text-outline"
              titulo="Recibos"
              ultimo
              onPress={() => navigation.navigate('Recibos')}
            />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}





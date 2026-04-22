import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DashboardSummaryCard from '../../components/DashboardSummaryCard';
import DashboardShortcutItem from '../../components/DashboardShortcutItem';
import styles from './styles';

export default function Dashboard() {
  const navigation = useNavigation();
  
  const stats = {
    totalAlunos: 42,
    frequenciaGeral: '82%',
    pendenciasFinanceiras: 5,
    receitaMes: 'R$ 5.700,00'
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 60, paddingBottom: 30, flexGrow: 1 }}>
        
        <View style={styles.topHeader}>
          <Text style={styles.saudacao}>Olá, Treinador</Text>
          <Text style={styles.subSaudacao}>Confira o que está acontecendo hoje.</Text>
        </View>

        <View style={styles.gridStats}>
          <DashboardSummaryCard
            styles={styles}
            titulo="Total Alunos" 
            valor={stats.totalAlunos} 
            icone="people" 
          />
          <DashboardSummaryCard
            styles={styles}
            titulo="Freq. Média" 
            valor={stats.frequenciaGeral} 
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





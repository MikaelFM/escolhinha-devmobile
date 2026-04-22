import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../constants/colors';
import styles from './styles';

const { width } = Dimensions.get('window');

export default function Dashboard() {
  const navigation = useNavigation();
  
  const stats = {
    totalAlunos: 42,
    frequenciaGeral: '82%',
    pendenciasFinanceiras: 5,
    receitaMes: 'R$ 5.700,00'
  };

  const ResumoCard = ({ titulo, valor, icone }) => (
    <View style={styles.cardResumo}>
      <View style={styles.iconContainer}>
        <Ionicons name={icone} size={22} color={colors.primary} />
      </View>
      <View>
        <Text style={styles.cardLabel}>{titulo}</Text>
        <Text style={styles.cardValor}>{valor}</Text>
      </View>
    </View>
  );

  const AtalhoItem = ({ icone, titulo, rota, ultimo = false }) => (
    <TouchableOpacity
      style={[styles.btnAcao, ultimo && styles.btnAcaoUltimo]}
      onPress={() => navigation.navigate(rota)}
      activeOpacity={0.75}
    >
      <View style={styles.iconWrapperAtalho}>
        <Ionicons name={icone} size={20} color={colors.primary} />
      </View>
      <View style={styles.btnAcaoConteudo}>
        <Text style={styles.btnAcaoTexto}>{titulo}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.primaryAccent} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 60, paddingBottom: 30, flexGrow: 1 }}>
        
        <View style={styles.topHeader}>
          <Text style={styles.saudacao}>OlÃ¡, Treinador</Text>
          <Text style={styles.subSaudacao}>Confira o que estÃ¡ acontecendo hoje.</Text>
        </View>

        <View style={styles.gridStats}>
          <ResumoCard 
            titulo="Total Alunos" 
            valor={stats.totalAlunos} 
            icone="people" 
          />
          <ResumoCard 
            titulo="Freq. MÃ©dia" 
            valor={stats.frequenciaGeral} 
            icone="calendar" 
          />
        </View>

        <View style={styles.bottomSheet}>

          <Text style={styles.secaoTitulo}>AÃ‡Ã•ES RÃPIDAS</Text>
          <View style={styles.gridAcoes}>
            <AtalhoItem icone="checkbox" titulo="LanÃ§ar Chamada" rota="registroPresenca" />
            <AtalhoItem icone="person-add" titulo="Cadastrar Aluno" rota="cadastroAluno" />
            <AtalhoItem icone="cash" titulo="HistÃ³rico de Mensalidades" rota="historicoMensalidades" />
            <AtalhoItem icone="settings" titulo="ConfiguraÃ§Ãµes" rota="profile" ultimo />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}



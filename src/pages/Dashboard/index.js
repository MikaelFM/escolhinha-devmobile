import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../global/colors';

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
          <Text style={styles.saudacao}>Olá, Treinador</Text>
          <Text style={styles.subSaudacao}>Confira o que está acontecendo hoje.</Text>
        </View>

        <View style={styles.gridStats}>
          <ResumoCard 
            titulo="Total Alunos" 
            valor={stats.totalAlunos} 
            icone="people" 
          />
          <ResumoCard 
            titulo="Freq. Média" 
            valor={stats.frequenciaGeral} 
            icone="calendar" 
          />
        </View>

        <View style={styles.bottomSheet}>

          <Text style={styles.secaoTitulo}>AÇÕES RÁPIDAS</Text>
          <View style={styles.gridAcoes}>
            <AtalhoItem icone="checkbox" titulo="Lançar Chamada" rota="registroPresenca" />
            <AtalhoItem icone="person-add" titulo="Cadastrar Aluno" rota="cadastroAluno" />
            <AtalhoItem icone="cash" titulo="Histórico de Mensalidades" rota="historicoMensalidades" />
            <AtalhoItem icone="settings" titulo="Configurações" rota="profile" ultimo />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background
  },
  topHeader: {
    marginTop: 70,
    paddingHorizontal: 20,
    marginBottom: 30
  },
  welcomeContainer: {
    marginHorizontal: 20,
    marginBottom: 14,
    backgroundColor: colors.primaryMedium,
    borderRadius: 20,
    paddingVertical: 22,
    paddingHorizontal: 18,
    shadowColor: 'black',
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 40 },
    elevation: 8,
  },
  saudacao: { fontSize: 26, fontWeight: '800', color: colors.primaryMedium },
  subSaudacao: { fontSize: 15, color: colors.textSecondary, marginTop: 4 },
  cardTitulo: { fontSize: 20, fontWeight: '800', color: colors.textInverted },
  cardMensagem: { fontSize: 14, color: colors.primaryBorder, marginTop: 6, lineHeight: 20 },
  
  gridStats: { 
    flexDirection: 'row', 
    paddingHorizontal: 20,
    paddingBottom: 8,
    justifyContent: 'space-between' 
  },
  cardResumo: {
    width: (width / 2) - 28,
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardLabel: { fontSize: 10, fontWeight: '700', color: colors.textPlaceholder, textTransform: 'uppercase' },
  cardValor: { fontSize: 20, fontWeight: '800', color: colors.primaryDark },
  
  secaoTitulo: { fontSize: 12, fontWeight: '800', color: colors.textSecondary, letterSpacing: 1, marginLeft: 20, marginTop: 24 },

  bottomSheet: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: 10,
    paddingTop: 10,
    shadowColor: colors.textPlaceholder,
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -8 },
    elevation: 20,
  },
  
  gridAcoes: {
    flexDirection: 'column',
    marginHorizontal: 20,
    marginTop: 15,
    backgroundColor: 'transparent',
  },
  btnAcao: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: colors.textPlaceholder,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1
  },
  iconWrapperAtalho: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnAcaoConteudo: { flex: 1, marginLeft: 2 },
  btnAcaoUltimo: {
    marginBottom: 0
  },
  btnAcaoTexto: { fontSize: 15, fontWeight: '700', color: colors.primaryDark }
});
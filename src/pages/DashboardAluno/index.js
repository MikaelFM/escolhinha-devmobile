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
import { colors } from '../../global/colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');
const VERDE = '#16a34a';
const VERMELHO = '#dc2626';
const AZUL_CLARO = '#e0f2fe';
const LARANJA = '#f59e0b';

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

  const InfoCard = ({ titulo, valor, icone, corIcone }) => (
    <View style={styles.cardResumo}>
      <View style={styles.iconContainer}>
        <Ionicons name={icone} size={22} color={corIcone} />
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
          <Text style={styles.saudacao}>Olá, {nomeAluno}</Text>
          <Text style={styles.subSaudacao}>Confira seu desempenho e suas pendências.</Text>
        </View>

        <View style={styles.gridStats}>
          <InfoCard 
            titulo="Frequência" 
            valor={aluno.frequencia} 
            icone="trending-up" 
            corIcone={VERDE} 
          />
          <InfoCard 
            titulo="Presenças" 
            valor={`${aluno.presencasNoMes}/${aluno.totalAulasMes}`} 
            icone="calendar" 
            corIcone={colors.primary} 
          />
        </View>

        <View style={styles.bottomSheet}>
          <Text style={styles.secaoTitulo}>AÇÕES RÁPIDAS</Text>
          <View style={styles.gridAcoes}>
            <AtalhoItem icone="list-outline" titulo="Minhas Faltas" rota="HistoricoPresencas" />
            <AtalhoItem icone="time-outline" titulo="Horários" rota="GradeHorarios" />
            <AtalhoItem icone="document-text-outline" titulo="Recibos" rota="Recibos" ultimo />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topHeader: {
    marginTop: 70,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  saudacao: { fontSize: 26, fontWeight: '800', color: colors.primaryMedium },
  subSaudacao: { fontSize: 15, color: colors.textSecondary, marginTop: 4 },
  gridStats: { 
    flexDirection: 'row', 
    paddingHorizontal: 20,
    paddingBottom: 8,
    justifyContent: 'space-between',
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
    gap: 12
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
  secaoTitulo: { fontSize: 12, fontWeight: '800', color: colors.textSecondary, letterSpacing: 1, marginLeft: 20, marginTop: 24 },
  gridAcoes: {
    flexDirection: 'column',
    marginHorizontal: 20,
    marginTop: 14,
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
    elevation: 1,
  },
  iconWrapperAtalho: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnAcaoConteudo: { flex: 1, marginLeft: 2 },
  btnAcaoUltimo: { marginBottom: 0 },
  btnAcaoTexto: { fontSize: 15, fontWeight: '700', color: colors.primaryDark },
});
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
import { colors } from '../../global/colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import styles from './styles';

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

  const AtalhoItem = ({ icone, titulo, rota, ultimo = false, primeiro = false }) => (
    <TouchableOpacity
      style={[
        styles.btnAcao,
        primeiro && styles.btnAcaoPrimeiro,
        ultimo && styles.btnAcaoUltimo,
      ]}
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
          <Text style={styles.saudacao}>OlÃ¡, {nomeAluno}</Text>
          <Text style={styles.subSaudacao}>Confira seu desempenho e suas pendÃªncias.</Text>
        </View>

        <View style={styles.gridStats}>
          <InfoCard 
            titulo="FrequÃªncia" 
            valor={aluno.frequencia} 
            icone="trending-up" 
            corIcone={VERDE} 
          />
          <InfoCard 
            titulo="PresenÃ§as" 
            valor={`${aluno.presencasNoMes}/${aluno.totalAulasMes}`} 
            icone="calendar" 
            corIcone={colors.primary} 
          />
        </View>

        <View style={styles.bottomSheet}>
          <Text style={styles.secaoTitulo}>AÃ‡Ã•ES RÃPIDAS</Text>
          <View style={styles.gridAcoes}>
            <AtalhoItem icone="list-outline" titulo="Minhas Faltas" rota="HistoricoPresencas" primeiro />
            <AtalhoItem icone="time-outline" titulo="HorÃ¡rios" rota="GradeHorarios" />
            <AtalhoItem icone="document-text-outline" titulo="Recibos" rota="Recibos" ultimo />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}


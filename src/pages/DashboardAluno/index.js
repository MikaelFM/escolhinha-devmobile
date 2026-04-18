import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions
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

  const InfoCard = ({ titulo, valor, icone, corIcone, bgIcone }) => (
    <View style={styles.cardResumo}>
      <View style={[styles.iconContainer, { backgroundColor: bgIcone }]}>
        <Ionicons name={icone} size={22} color={corIcone} />
      </View>
      <View>
        <Text style={styles.cardLabel}>{titulo}</Text>
        <Text style={styles.cardValor}>{valor}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header com Seletor de Perfil (Caso tenha mais de um filho) */}
      <View style={styles.header}>
        <View>
          <Text style={styles.saudacao}>Olá, {nomeAluno}</Text>
          <View style={styles.perfilSelector}>
             <TouchableOpacity style={styles.btnTrocar}>
                <Text style={styles.nomeAlunoHeader}>{aluno.nome} ▾</Text>
             </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.btnNotificacao}>
          <Ionicons name="notifications-outline" size={24} color={colors.azul} />
          {aluno.statusMensalidade === 'Pendente' && <View style={styles.badgeNotificacao} />}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Grid de Stats de Frequência (RF011) */}
        <View style={styles.gridStats}>
          <InfoCard 
            titulo="Frequência" 
            valor={aluno.frequencia} 
            icone="trending-up" 
            corIcone={VERDE} 
            bgIcone="#f0fdf4" 
          />
          <InfoCard 
            titulo="Presenças" 
            valor={`${aluno.presencasNoMes}/${aluno.totalAulasMes}`} 
            icone="calendar" 
            corIcone={colors.azul} 
            bgIcone={AZUL_CLARO} 
          />
        </View>

        {/* Card Financeiro - Foco em Pagamento (RF016/RF017) */}
        <View style={[styles.cardFinanceiro, aluno.statusMensalidade === 'Pendente' ? {backgroundColor: LARANJA} : {backgroundColor: VERDE}]}>
          <View>
            <Text style={styles.finLabel}>Mensalidade de Abril</Text>
            <Text style={styles.finValor}>{aluno.valorMensalidade}</Text>
            <Text style={styles.finVencimento}>Vence em {aluno.vencimento}</Text>
          </View>
          <TouchableOpacity 
            style={styles.btnPagar}
            onPress={() => navigation.navigate('PagamentoPix')}
          >
            <Text style={styles.btnPagarTexto}>
                {aluno.statusMensalidade === 'Pendente' ? 'PAGAR PIX' : 'PAGO'}
            </Text>
            <Ionicons name={aluno.statusMensalidade === 'Pendente' ? "copy-outline" : "checkmark-circle"} size={16} color={aluno.statusMensalidade === 'Pendente' ? LARANJA : VERDE} />
          </TouchableOpacity>
        </View>

        {/* Seção de Ações Rápidas do Aluno */}
        <Text style={styles.secaoTitulo}>MINHA ESCOLINHA</Text>
        <View style={styles.gridAcoes}>
          <TouchableOpacity style={styles.btnAcao} onPress={() => navigation.navigate('HistoricoPresencas')}>
            <Ionicons name="list-outline" size={32} color={colors.azul} />
            <Text style={styles.btnAcaoTexto}>Minhas Faltas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnAcao} onPress={() => navigation.navigate('GradeHorarios')}>
            <Ionicons name="time-outline" size={32} color={colors.azul} />
            <Text style={styles.btnAcaoTexto}>Horários</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnAcao} onPress={() => navigation.navigate('Recibos')}>
            <Ionicons name="document-text-outline" size={32} color={colors.azul} />
            <Text style={styles.btnAcaoTexto}>Recibos</Text>
          </TouchableOpacity>
        </View>

        {/* Próximas Aulas / Mural de Avisos */}
        {/* <View style={styles.secaoHeader}>
          <Text style={styles.secaoTitulo}>MURAL DE AVISOS</Text>
        </View> */}
        
        {/* <View style={styles.listaAlerta}>
          <View style={styles.itemAviso}>
             <View style={styles.avisoIcon}>
                <Ionicons name="megaphone" size={20} color={colors.azul} />
             </View>
             <View style={{flex: 1}}>
                <Text style={styles.avisoTitulo}>Treino Cancelado (Chuva)</Text>
                <Text style={styles.avisoData}>Hoje, às 14:30</Text>
                <Text style={styles.avisoDesc}>O treino da categoria Sub-13 foi cancelado devido às fortes chuvas. Reposição em breve.</Text>
             </View>
          </View>
        </View> */}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 20,
    paddingTop: 80,
    backgroundColor: '#ffffff',
  },
  saudacao: { fontSize: 16, fontWeight: '500', color: '#64748b' },
  perfilSelector: { flexDirection: 'row', alignItems: 'center' },
  nomeAlunoHeader: { fontSize: 18, fontWeight: '800', color: colors.azul },
  btnTrocar: { paddingVertical: 2 },
  btnNotificacao: {
    width: 45, height: 45, borderRadius: 12, backgroundColor: '#f1f5f9',
    alignItems: 'center', justifyContent: 'center'
  },
  badgeNotificacao: {
    position: 'absolute', top: 12, right: 14, width: 8, height: 8,
    borderRadius: 4, backgroundColor: VERMELHO, borderWidth: 1, borderColor: '#fff'
  },
  gridStats: { flexDirection: 'row', padding: 20, justifyContent: 'space-between' },
  cardResumo: {
    width: (width / 2) - 28,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  iconContainer: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cardLabel: { fontSize: 10, fontWeight: '700', color: '#64748b', textTransform: 'uppercase' },
  cardValor: { fontSize: 18, fontWeight: '800', color: colors.azul },
  cardFinanceiro: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'   
  },
  finLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600' },
  finValor: { color: '#fff', fontSize: 24, fontWeight: '800' },
  finVencimento: { color: '#fff', fontSize: 11, opacity: 0.9 },
  btnPagar: { 
    backgroundColor: '#fff', 
    paddingHorizontal: 12, 
    paddingVertical: 10, 
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  btnPagarTexto: { fontSize: 12, fontWeight: '900' },

  secaoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 25 },
  secaoTitulo: { fontSize: 12, fontWeight: '800', color: '#94a3b8', letterSpacing: 1, marginLeft: 20, marginTop: 25 },

  gridAcoes: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 15 },
  btnAcao: {
    width: (width / 3) - 22,
    backgroundColor: '#fff',
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  btnAcaoTexto: { fontSize: 11, fontWeight: '700', color: colors.azul, marginTop: 8 },

  listaAlerta: { marginHorizontal: 20, marginTop: 15 },
  itemAviso: { 
    backgroundColor: '#fff', padding: 16, borderRadius: 16,
    flexDirection: 'row', gap: 15,
    borderWidth: 1, borderColor: '#f1f5f9'
  },
  avisoIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: AZUL_CLARO, alignItems: 'center', justifyContent: 'center' },
  avisoTitulo: { fontSize: 15, fontWeight: '700', color: colors.azul },
  avisoData: { fontSize: 11, color: LARANJA, fontWeight: '700', marginBottom: 5 },
  avisoDesc: { fontSize: 13, color: '#64748b', lineHeight: 18 }
});
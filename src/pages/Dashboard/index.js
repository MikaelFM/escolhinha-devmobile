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


const { width } = Dimensions.get('window');
const VERDE = '#16a34a';
const VERMELHO = '#dc2626';
const AZUL_CLARO = '#e0f2fe';

export default function Dashboard() {
  const navigation = useNavigation();
  const stats = {
    totalAlunos: 42,
    alunosAtivos: 38,
    frequenciaGeral: '82%',
    pendenciasFinanceiras: 5,
    receitaMes: 'R$ 5.700,00'
  };

  const ResumoCard = ({ titulo, valor, icone, corIcone, bgIcone }) => (
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
      {/* Header do Dashboard */}
      <View style={styles.header}>
        <View>
          <Text style={styles.saudacao}>Olá, Treinador</Text>
          <Text style={styles.subSaudacao}>Painel de Controle Escolinha</Text>
        </View>
        <TouchableOpacity style={styles.btnNotificacao}>
          <Ionicons name="notifications-outline" size={24} color={colors.azul} />
          {stats.pendenciasFinanceiras > 0 && <View style={styles.badgeNotificacao} />}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        
        {/* Grid de Stats Principais */}
        <View style={styles.gridStats}>
          <ResumoCard 
            titulo="Total Alunos" 
            valor={stats.totalAlunos} 
            icone="people" 
            corIcone={colors.azul} 
            bgIcone={AZUL_CLARO} 
          />
          <ResumoCard 
            titulo="Frequência" 
            valor={stats.frequenciaGeral} 
            icone="calendar-check" 
            corIcone={VERDE} 
            bgIcone="#f0fdf4" 
          />
        </View>

        {/* Card Financeiro de Destaque */}
        <View style={styles.cardFinanceiro}>
          <View>
            <Text style={styles.finLabel}>Receita Prevista (Março)</Text>
            <Text style={styles.finValor}>{stats.receitaMes}</Text>
          </View>
          <View style={styles.finAlerta}>
            <Text style={styles.finAlertaTitulo}>{stats.pendenciasFinanceiras}</Text>
            <Text style={styles.finAlertaSub}>Pendentes</Text>
          </View>
        </View>

        {/* Seção de Ações Rápidas */}
        <Text style={styles.secaoTitulo}>AÇÕES RÁPIDAS</Text>
        <View style={styles.gridAcoes}>
          <TouchableOpacity 
            style={styles.btnAcao}
            onPress={() => navigation.navigate('registroPresenca')}
          >
            <Ionicons name="checkbox-outline" size={32} color={colors.azul} />
            <Text style={styles.btnAcaoTexto}>Chamada</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.btnAcao}
            onPress={() => navigation.navigate('cadastroAluno')}
          >
            <Ionicons name="person-add-outline" size={32} color={colors.azul} />
            <Text style={styles.btnAcaoTexto}>Alunos</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.btnAcao}
            onPress={() => navigation.navigate('historicoMensalidades')}
          >
            <Ionicons name="cash-outline" size={32} color={colors.azul} />
            <Text style={styles.btnAcaoTexto}>Mensalidades</Text>
          </TouchableOpacity>
        </View>

        {/* Alunos com Faltas Excessivas (Alerta) */}
        {/* <View style={styles.secaoHeader}>
          <Text style={styles.secaoTitulo}>ALERTAS DE EVASÃO</Text>
          <TouchableOpacity><Text style={styles.verMais}>Ver todos</Text></TouchableOpacity>
        </View>
        
        <View style={styles.listaAlerta}>
          {['Marcos Oliveira', 'Felipe Santos'].map((nome, index) => (
            <View key={index} style={styles.itemAlerta}>
              <View style={styles.alertaInfo}>
                <View style={styles.alertaAvatar} />
                <Text style={styles.alertaNome}>{nome}</Text>
              </View>
              <View style={styles.alertaBadge}>
                <Text style={styles.alertaBadgeTexto}>3 faltas seguidas</Text>
              </View>
            </View>
          ))}
        </View> */}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#ffffff' ,
    backgroundColor: '#f8fafc'
  },
  header: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 20,
    paddingTop: 80,
    backgroundColor: '#ffffff',
  },
  saudacao: { fontSize: 20, fontWeight: '800', color: colors.azul },
  subSaudacao: { fontSize: 13, color: '#94a3b8', fontWeight: '500' },
  btnNotificacao: {
    width: 45, height: 45, borderRadius: 12, backgroundColor: '#f1f5f9',
    alignItems: 'center', justifyContent: 'center'
  },
  badgeNotificacao: {
    position: 'absolute', top: 12, right: 14, width: 8, height: 8,
    borderRadius: 4, backgroundColor: VERMELHO, borderWidth: 1, borderColor: '#fff'
  },
  gridStats: { 
    flexDirection: 'row', 
    padding: 20, 
    justifyContent: 'space-between' 
  },
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
  iconContainer: {
    width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center'
  },
  cardLabel: { fontSize: 10, fontWeight: '700', color: '#64748b', textTransform: 'uppercase' },
  cardValor: { fontSize: 18, fontWeight: '800', color: colors.azul },  cardFinanceiro: {
    backgroundColor: colors.azul,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'   
  },
  finLabel: { color: '#bfdbfe', fontSize: 12, fontWeight: '600' },
  finValor: { color: '#fff', fontSize: 24, fontWeight: '800', marginTop: 4 },
  finAlerta: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', padding: 10, borderRadius: 12 },
  finAlertaTitulo: { color: '#fff', fontSize: 18, fontWeight: '800' },
  finAlertaSub: { color: '#fff', fontSize: 9, fontWeight: '600' },

  secaoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 25 },
  secaoTitulo: { fontSize: 12, fontWeight: '800', color: '#94a3b8', letterSpacing: 1, marginLeft: 20, marginTop: 25 },
  verMais: { fontSize: 12, fontWeight: '700', color: colors.azul, marginTop: 25 },

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
  itemAlerta: {
    backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 8,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: '#f1f5f9'
  },
  alertaInfo: { flexDirection: 'row', alignItems: 'center' },
  alertaAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#e2e8f0' },
  alertaNome: { marginLeft: 10, fontSize: 14, fontWeight: '700', color: colors.azul },
  alertaBadge: { backgroundColor: '#fef2f2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  alertaBadgeTexto: { color: VERMELHO, fontSize: 10, fontWeight: '700' }
});
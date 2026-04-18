import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { colors } from '../../global/colors';
import { Ionicons } from '@expo/vector-icons';

const VERDE = '#16a34a';
const VERMELHO = '#dc2626';

export default function HistoricoPresencas({ navigation }: any) {
  const [busca, setBusca] = useState('');
  const [mesAtual, setMesAtual] = useState('Março/2026');

  const [listaAlunos] = useState([
    { 
      id: '1', 
      nome: 'João Silva Cardoso', 
      faltas: 1, 
      freq: '92%',
      ultimas: ['P', 'P', 'P', 'F', 'P'] 
    },
    { 
      id: '2', 
      nome: 'Felipe Santos', 
      faltas: 4, 
      freq: '65%',
      ultimas: ['F', 'F', 'P', 'F', 'F'] 
    },
    { 
      id: '3', 
      nome: 'Marcos Oliveira', 
      faltas: 0, 
      freq: '100%',
      ultimas: ['P', 'P', 'P', 'P', 'P'] 
    },
    { 
      id: '4', 
      nome: 'Lucas Almeida', 
      faltas: 2, 
      freq: '80%',
      ultimas: ['P', 'F', 'P', 'F', 'P'] 
    },
  ]);

  const alunosFiltrados = listaAlunos.filter(a => 
    a.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header com Navegação de Meses */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.azul} />
        </TouchableOpacity>
        <View style={styles.mesSelector}>
            <TouchableOpacity><Ionicons name="caret-back" size={20} color="#94a3b8" /></TouchableOpacity>
            <Text style={styles.headerTitulo}>{mesAtual}</Text>
            <TouchableOpacity><Ionicons name="caret-forward" size={20} color="#94a3b8" /></TouchableOpacity>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* Resumo da Turma no Mês */}
      <View style={styles.resumoContainer}>
        <View style={styles.resumoCard}>
          <Text style={styles.resumoLabel}>FREQ. MÉDIA</Text>
          <Text style={[styles.resumoValor, {color: VERDE}]}>84%</Text>
        </View>
        <View style={styles.resumoCard}>
          <Text style={styles.resumoLabel}>TOTAL FALTAS</Text>
          <Text style={[styles.resumoValor, {color: VERMELHO}]}>12</Text>
        </View>
      </View>

      {/* Barra de Busca */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#94a3b8" />
        <TextInput 
          style={styles.input}
          placeholder="Buscar aluno..."
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        <Text style={styles.secaoTitulo}>FREQUÊNCIA DOS ALUNOS</Text>
        
        {alunosFiltrados.map((aluno) => {
          const alertaEvasao = aluno.faltas >= 3;
          return (
            <TouchableOpacity 
              key={aluno.id} 
              style={styles.cardAluno}
              onPress={() => navigation.navigate('FichaAluno')}
            >
              <View style={styles.infoPrincipal}>
                <View>
                  <Text style={[styles.nomeAluno, alertaEvasao && { color: VERMELHO }]}>
                    {aluno.nome}
                  </Text>
                  <Text style={styles.subTexto}>Freq: {aluno.freq} | Faltas: {aluno.faltas}</Text>
                </View>
                {alertaEvasao && (
                  <View style={styles.badgeAlerta}>
                    <Ionicons name="alert-circle" size={14} color={VERMELHO} />
                    <Text style={styles.alertaTexto}>ALERTA</Text>
                  </View>
                )}
              </View>

              {/* Mini visualização das últimas 5 chamadas */}
              <View style={styles.miniChamadaContainer}>
                {aluno.ultimas.map((status, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.pontoStatus, 
                      status === 'P' ? styles.pontoPago : styles.pontoPendente
                    ]}
                  >
                    <Text style={styles.pontoTexto}>{status}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          );
        })}
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff'
  },
  mesSelector: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  headerTitulo: { fontSize: 17, fontWeight: '800', color: colors.azul },
  
  resumoContainer: { flexDirection: 'row', padding: 20, gap: 12 },
  resumoCard: { 
    flex: 1, backgroundColor: '#fff', padding: 15, borderRadius: 12, 
    borderWidth: 1, borderColor: '#e2e8f0' 
  },
  resumoLabel: { fontSize: 10, fontWeight: '800', color: '#94a3b8', marginBottom: 4 },
  resumoValor: { fontSize: 16, fontWeight: '800' },

  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    marginHorizontal: 20, paddingHorizontal: 15, borderRadius: 10,
    height: 45, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 20
  },
  input: { flex: 1, marginLeft: 10, fontWeight: '600', color: colors.azul },

  secaoTitulo: { fontSize: 11, fontWeight: '800', color: '#94a3b8', marginLeft: 20, marginBottom: 10, letterSpacing: 1 },
  
  cardAluno: {
    backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 10,
    padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0'
  },
  infoPrincipal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  nomeAluno: { fontSize: 15, fontWeight: '800', color: colors.azul },
  subTexto: { fontSize: 12, color: '#64748b', fontWeight: '600', marginTop: 2 },
  
  badgeAlerta: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef2f2', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  alertaTexto: { color: VERMELHO, fontSize: 10, fontWeight: '900', marginLeft: 4 },

  miniChamadaContainer: { flexDirection: 'row', gap: 6 },
  pontoStatus: { 
    width: 24, height: 24, borderRadius: 12, 
    alignItems: 'center', justifyContent: 'center', borderWidth: 1 
  },
  pontoPago: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' },
  pontoPendente: { backgroundColor: '#fef2f2', borderColor: '#fca5a5' },
  pontoTexto: { fontSize: 10, fontWeight: '800', color: '#64748b' },
});
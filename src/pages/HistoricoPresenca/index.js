import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { colors } from '../../global/colors';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';

const VERDE = '#16a34a';
const VERMELHO = '#dc2626';

export default function HistoricoPresencas({ navigation }) {
  const [busca, setBusca] = useState('');
  const [mesAtual, setMesAtual] = useState('MarÃ§o/2026');

  const [listaAlunos] = useState([
    { 
      id: '1', 
      nome: 'JoÃ£o Silva Cardoso', 
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
      {/* Header com NavegaÃ§Ã£o de Meses */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.mesSelector}>
            <TouchableOpacity><Ionicons name="caret-back" size={20} color="#94a3b8" /></TouchableOpacity>
            <Text style={styles.headerTitulo}>{mesAtual}</Text>
            <TouchableOpacity><Ionicons name="caret-forward" size={20} color="#94a3b8" /></TouchableOpacity>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* Resumo da Turma no MÃªs */}
      <View style={styles.resumoContainer}>
        <View style={styles.resumoCard}>
          <Text style={styles.resumoLabel}>FREQ. MÃ‰DIA</Text>
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
        <Text style={styles.secaoTitulo}>FREQUÃŠNCIA DOS ALUNOS</Text>
        
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

              {/* Mini visualizaÃ§Ã£o das Ãºltimas 5 chamadas */}
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


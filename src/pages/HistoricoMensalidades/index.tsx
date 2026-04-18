import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  StatusBar
} from 'react-native';
import { colors } from '../../global/colors';
import { Ionicons } from '@expo/vector-icons';

const VERDE = '#16a34a';
const VERMELHO = '#dc2626';

type Pagamento = {
  id: string;
  nome: string;
  status: 'Pago' | 'Pendente';
  valor: string;
  mesReferencia: string;
  dataPagamento?: string;
};

const MENSALIDADES_DATA: Pagamento[] = [
  { id: '1', nome: 'João Silva Cardoso', status: 'Pago', valor: 'R$ 150,00', mesReferencia: 'Março', dataPagamento: '05/03/2026' },
  { id: '2', nome: 'Felipe Santos', status: 'Pendente', valor: 'R$ 150,00', mesReferencia: 'Março' },
  { id: '3', nome: 'Marcos Oliveira', status: 'Pago', valor: 'R$ 150,00', mesReferencia: 'Março', dataPagamento: '10/03/2026' },
  { id: '4', nome: 'Lucas Almeida', status: 'Pago', valor: 'R$ 150,00', mesReferencia: 'Fevereiro', dataPagamento: '02/02/2026' },
];

const MESES_TABS = ['Todos', 'Março', 'Fevereiro', 'Janeiro'];

export default function HistoricoMensalidades({ navigation }: any) {
  const [busca, setBusca] = useState('');
  const [mesAtivo, setMesAtivo] = useState('Todos');
  const [dados, setDados] = useState(MENSALIDADES_DATA);

  const mensalidadesFiltradas = useMemo(() => {
    return dados.filter(item => {
      const matchBusca = item.nome.toLowerCase().includes(busca.toLowerCase());
      const matchMes = mesAtivo === 'Todos' ? true : item.mesReferencia === mesAtivo;
      return matchBusca && matchMes;
    });
  }, [busca, mesAtivo, dados]);

  const handleTogglePagamento = (id: string) => {
    const hoje = new Date().toLocaleDateString('pt-BR');
    setDados(prev => prev.map(item => 
      item.id === id 
        ? { 
            ...item, 
            status: item.status === 'Pago' ? 'Pendente' : 'Pago',
            dataPagamento: item.status === 'Pendente' ? hoje : undefined 
          } 
        : item
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER PADRONIZADO */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color={colors.azul} />
        </TouchableOpacity>
        <View>
          <Text style={styles.titulo}>Mensalidades</Text>
          <Text style={styles.subtitulo}>Controle de recebimentos</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* RESUMO DE CAIXA (CARDS BRANCOS SOBRE FUNDO OFF-WHITE) */}
        <View style={styles.resumoContainer}>
          <View style={styles.resumoCard}>
            <Text style={styles.resumoLabel}>RECEBIDO</Text>
            <Text style={[styles.resumoValor, {color: VERDE}]}>R$ 600,00</Text>
          </View>
          <View style={styles.resumoCard}>
            <Text style={styles.resumoLabel}>PENDENTE</Text>
            <Text style={[styles.resumoValor, {color: VERMELHO}]}>R$ 300,00</Text>
          </View>
        </View>

        {/* BUSCA PADRONIZADA */}
        <View style={styles.buscaWrapper}>
          <Ionicons name="search-outline" size={20} color="#94a3b8" />
          <TextInput 
            style={styles.buscaInput}
            placeholder="Buscar por nome do aluno..."
            placeholderTextColor="#94a3b8"
            value={busca}
            onChangeText={setBusca}
          />
        </View>

        {/* TABS DE MESES */}
        <View style={{ height: 55, marginTop: 15 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
            {MESES_TABS.map(mes => (
              <TouchableOpacity
                key={mes}
                style={[styles.tab, mesAtivo === mes && styles.tabAtiva]}
                onPress={() => setMesAtivo(mes)}
              >
                <Text style={[styles.tabTexto, mesAtivo === mes && styles.tabTextoAtivo]}>{mes}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.secaoHeader}>
          <Text style={styles.secaoTitulo}>
              {mesAtivo === 'Todos' ? 'Histórico Completo' : `Mensalidades: ${mesAtivo}`}
          </Text>
        </View>

        {/* LISTAGEM DE ALUNOS (ESTILO FLAT CARDS) */}
        <View style={styles.listaContainer}>
          {mensalidadesFiltradas.map((item) => {
            const isPago = item.status === 'Pago';
            return (
              <View key={item.id} style={styles.cardAluno}>
                <View style={{ flex: 1 }}>
                  <View style={[styles.statusPilula, isPago ? styles.statusVerde : styles.statusVermelho]}>
                    <Text style={[styles.statusTexto, isPago ? styles.statusTextoVerde : styles.statusTextoVermelho]}>
                      {item.status.toUpperCase()}
                    </Text>
                  </View>
                  
                  <Text style={[styles.nomeAluno, !isPago && { color: VERMELHO }]}>
                    {item.nome}
                  </Text>

                  <View style={styles.infoFinanceira}>
                      <Text style={styles.valorTexto}>{item.valor}</Text>
                      {isPago && item.dataPagamento && (
                        <Text style={styles.dataTexto}> • Pago em {item.dataPagamento}</Text>
                      )}
                  </View>
                  <Text style={styles.mesRefTexto}>Referente a {item.mesReferencia}</Text>
                </View>

                <View style={styles.switchWrapper}>
                  <Text style={styles.labelSwitch}>PAGO</Text>
                  <Switch
                    trackColor={{ false: '#cbd5e1', true: '#bbf7d0' }}
                    thumbColor={isPago ? VERDE : '#94a3b8'}
                    onValueChange={() => handleTogglePagamento(item.id)}
                    value={isPago}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { 
    paddingHorizontal: 20, 
    paddingTop: 60, 
    paddingBottom: 20, 
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  backBtn: { marginLeft: -10 },
  titulo: { fontSize: 28, fontWeight: '800', color: colors.azul, letterSpacing: -0.5 },
  subtitulo: { fontSize: 14, color: '#94a3b8', marginTop: -2 },

  resumoContainer: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 20, gap: 12 },
  resumoCard: { 
    flex: 1, 
    backgroundColor: '#ffffff', 
    padding: 16, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#e2e8f0' 
  },
  resumoLabel: { fontSize: 9, fontWeight: '900', color: '#94a3b8', letterSpacing: 1, marginBottom: 4 },
  resumoValor: { fontSize: 18, fontWeight: '800' },

  buscaWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#ffffff', 
    borderRadius: 16, 
    marginHorizontal: 20, 
    marginTop: 20, 
    paddingHorizontal: 15, 
    borderWidth: 1, 
    borderColor: '#e2e8f0', 
    height: 55 
  },
  buscaInput: { flex: 1, fontSize: 15, color: '#1e293b', marginLeft: 10 },

  tabsContainer: { paddingHorizontal: 20, gap: 8, alignItems: 'center' },
  tab: { 
    height: 38, 
    paddingHorizontal: 18, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#e2e8f0', 
    justifyContent: 'center', 
    backgroundColor: '#fff' 
  },
  tabAtiva: { backgroundColor: colors.azul, borderColor: colors.azul },
  tabTexto: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  tabTextoAtivo: { color: '#ffffff' },

  secaoHeader: { paddingHorizontal: 20, paddingTop: 25, paddingBottom: 12 },
  secaoTitulo: { fontSize: 11, fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 },

  listaContainer: { paddingHorizontal: 20 },
  cardAluno: { 
    backgroundColor: '#ffffff', 
    marginBottom: 10, 
    padding: 18, 
    borderRadius: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#e2e8f0' 
  },
  nomeAluno: { fontSize: 16, fontWeight: '800', color: colors.azul, marginTop: 8 },
  infoFinanceira: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  valorTexto: { fontSize: 13, fontWeight: '700', color: '#475569' },
  dataTexto: { fontSize: 11, fontWeight: '600', color: VERDE },
  mesRefTexto: { fontSize: 11, color: '#94a3b8', fontWeight: '600', marginTop: 4 },

  statusPilula: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, alignSelf: 'flex-start' },
  statusVerde: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' },
  statusVermelho: { backgroundColor: '#fef2f2', borderColor: '#fca5a5' },
  statusTexto: { fontSize: 8, fontWeight: '900' },
  statusTextoVerde: { color: VERDE },
  statusTextoVermelho: { color: VERMELHO },

  switchWrapper: { alignItems: 'center', marginLeft: 15 },
  labelSwitch: { fontSize: 8, fontWeight: '900', color: '#94a3b8', marginBottom: 4 }
});
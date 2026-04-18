import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { colors } from '../../global/colors';
import InputField from '../../components/InputField';
import { maskApenasNumeros } from '../../utils/masks';

export default function ConfiguracoesSistema() {
  const [form, setForm] = useState({
    diaFechamento: '05',
    valorMensalidade: '150,00',
    valorMatricula: '80,00',
    multaAtraso: '10,00',
    notificarResponsaveis: true,
  });

  const [sucesso, setSucesso] = useState(false);

  const handleSalvar = () => {
    setSucesso(true);
    setTimeout(() => setSucesso(false), 3000);
    console.log('Configurações atualizadas:', form);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.titulo}>Configurações</Text>
          <Text style={styles.subtitulo}>Ajuste as regras de negócio e financeiro</Text>
        </View>

        {/* Card de Resumo das Regras Atuais */}
        {/* <View style={styles.cardRegras}>
          <Text style={styles.cardRegrasTitulo}>Resumo de Cobrança</Text>
          <Text style={styles.cardRegrasTexto}>
            As mensalidades de <Text style={styles.negrito}>R$ {form.valorMensalidade}</Text> serão geradas todo dia <Text style={styles.negrito}>{form.diaFechamento}</Text> de cada mês.
          </Text>
        </View> */}

        <View style={styles.secao}>
          {/* <Text style={styles.secaoTitulo}>Financeiro</Text> */}
          
          <InputField
            label="Dia de fechamento do mês"
            placeholder="Ex: 05"
            value={form.diaFechamento}
            onChangeText={(v) => setForm({...form, diaFechamento: v})}
            mascara={maskApenasNumeros}
            keyboardType="numeric"
          />

          <InputField
            label="Valor da Mensalidade (R$)"
            placeholder="0,00"
            value={form.valorMensalidade}
            onChangeText={(v) => setForm({...form, valorMensalidade: v})}
            keyboardType="numeric"
          />

          <InputField
            label="Taxa de Matrícula (R$)"
            placeholder="0,00"
            value={form.valorMatricula}
            onChangeText={(v) => setForm({...form, valorMatricula: v})}
            keyboardType="numeric"
          />
        </View>

        {sucesso && (
          <View style={styles.sucessoBox}>
            <Text style={styles.sucessoTexto}>✓ Configurações salvas!</Text>
          </View>
        )}

        <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvar}>
          <Text style={styles.botaoSalvarTexto}>Atualizar Configurações</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', paddingTop: 80 },
  scroll: { padding: 25 },
  header: { marginBottom: 30, paddingBottom: 30 },
  titulo: { fontSize: 26, fontWeight: '700', color: colors.azul },
  subtitulo: { fontSize: 14, color: '#64748b', marginTop: 4 },
  
  cardRegras: {
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
  },
  cardRegrasTitulo: { fontSize: 14, fontWeight: '700', color: colors.azul, marginBottom: 5 },
  cardRegrasTexto: { fontSize: 14, color: '#475569', lineHeight: 20 },
  negrito: { fontWeight: '700', color: '#1e293b' },

  secao: { marginBottom: 25 },
  secaoTitulo: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#1e293b', 
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 8
  },

  rowSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  labelSwitch: { fontSize: 15, fontWeight: '600', color: '#1e293b' },
  sublabelSwitch: { fontSize: 12, color: '#94a3b8', marginTop: 2 },

  sucessoBox: {
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  sucessoTexto: { color: '#16a34a', fontWeight: '600' },

  botaoSalvar: {
    backgroundColor: colors.azul,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  botaoSalvarTexto: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});
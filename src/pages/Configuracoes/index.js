import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors } from '../../global/colors';
import InputField from '../../components/InputField';
import { maskApenasNumeros, maskData } from '../../utils/masks';
import { ajustesService } from '../../services/ajustesService';

const formatarIsoParaBr = (valor) => {
  if (!valor) return '';

  const texto = String(valor).trim();
  const isoMatch = texto.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (isoMatch) {
    return `${isoMatch[3]}/${isoMatch[2]}/${isoMatch[1]}`;
  }

  const data = new Date(texto);
  if (!Number.isNaN(data.getTime())) {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  return texto;
};

const formatarBrParaIsoCurta = (valor) => {
  const [dia, mes, ano] = String(valor || '').split('/');

  if (!dia || !mes || !ano) {
    return '';
  }

  return `${ano}-${mes}-${dia}`;
};

const normalizarValorMonetario = (valor) => {
  if (valor === null || valor === undefined || valor === '') {
    return '';
  }

  return String(valor).replace('.', ',');
};

const monetarioParaNumero = (valor) => {
  const numero = Number(String(valor || '').replace(',', '.'));
  return Number.isFinite(numero) ? numero : NaN;
};

export default function ConfiguracoesSistema() {
  const [form, setForm] = useState({
    diaFechamento: '05',
    valorMensalidade: '',
    dataInicioAulas: '',
    dataFimAulas: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  React.useEffect(() => {
    const carregarAjustes = async () => {
      try {
        setLoading(true);

        const resposta = await ajustesService.consultarAjustes();
        const ajustes = resposta?.ajustes ?? resposta?.data?.ajustes ?? resposta?.data ?? null;

        if (ajustes) {
          setForm({
            diaFechamento: String(ajustes.data_virada_mes ?? '05').padStart(2, '0'),
            valorMensalidade: normalizarValorMonetario(ajustes.valor_mensalidade),
            dataInicioAulas: formatarIsoParaBr(ajustes.data_inicio_aulas),
            dataFimAulas: formatarIsoParaBr(ajustes.data_fim_aulas),
          });
        }
      } catch (error) {
        console.log('Erro ao carregar ajustes:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarAjustes();
  }, []);

  const handleSalvar = async () => {
    if (saving) return;

    const diaFechamentoNumero = Number(form.diaFechamento);
    const valorMensalidadeNumero = monetarioParaNumero(form.valorMensalidade);
    const dataInicioIso = formatarBrParaIsoCurta(form.dataInicioAulas);
    const dataFimIso = formatarBrParaIsoCurta(form.dataFimAulas);

    if (!Number.isInteger(diaFechamentoNumero) || diaFechamentoNumero < 1 || diaFechamentoNumero > 31) {
      Alert.alert('Atenção', 'Informe um dia de fechamento válido entre 1 e 31.');
      return;
    }

    if (!Number.isFinite(valorMensalidadeNumero) || valorMensalidadeNumero < 0) {
      Alert.alert('Atenção', 'Informe um valor de mensalidade válido.');
      return;
    }

    if (!dataInicioIso || !dataFimIso) {
      Alert.alert('Atenção', 'Informe as datas de início e fim do período letivo.');
      return;
    }

    try {
      setSaving(true);

      await ajustesService.inserirAjustes({
        valor_mensalidade: valorMensalidadeNumero,
        data_virada_mes: diaFechamentoNumero,
        data_inicio_aulas: dataInicioIso,
        data_fim_aulas: dataFimIso,
      });

      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);
    } catch (error) {
      console.log('Erro ao salvar ajustes:', error);
      Alert.alert('Erro', error?.message || 'Não foi possível salvar os ajustes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.containerLoading}>
        <ActivityIndicator size="large" color={colors.azul} />
        <Text style={styles.loadingText}>Carregando ajustes...</Text>
      </SafeAreaView>
    );
  }

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
            label="Início período letivo"
            placeholder="DD/MM/AAAA"
            value={form.dataInicioAulas}
            onChangeText={(v) => setForm({...form, dataInicioAulas: maskData(v)})}
            keyboardType="numeric"
          />

          <InputField
            label="Fim período letivo"
            placeholder="DD/MM/AAAA"
            value={form.dataFimAulas}
            onChangeText={(v) => setForm({...form, dataFimAulas: maskData(v)})}
            keyboardType="numeric"
          />
        </View>

        {sucesso && (
          <View style={styles.sucessoBox}>
            <Text style={styles.sucessoTexto}>✓ Configurações salvas!</Text>
          </View>
        )}

        <TouchableOpacity style={[styles.botaoSalvar, saving && styles.botaoSalvarDesabilitado]} onPress={handleSalvar} disabled={saving}>
          <Text style={styles.botaoSalvarTexto}>{saving ? 'Salvando...' : 'Atualizar Configurações'}</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerLoading: { flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14, color: '#64748b', fontWeight: '600' },
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
  botaoSalvarDesabilitado: { opacity: 0.6 },
  botaoSalvarTexto: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});
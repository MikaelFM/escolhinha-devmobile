import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { colors } from '../../global/colors';
import InputField from '../../components/InputField';
import { maskApenasNumeros, maskData } from '../../utils/masks';
import {
  formatarBrParaIsoCurta,
  formatarIsoParaBr,
  monetarioParaNumero,
  normalizarValorMonetario,
} from '../../utils/formatters';
import { ajustesService } from '../../services/ajustesService';
import styles from './styles';

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
      Alert.alert('AtenÃ§Ã£o', 'Informe um dia de fechamento vÃ¡lido entre 1 e 31.');
      return;
    }

    if (!Number.isFinite(valorMensalidadeNumero) || valorMensalidadeNumero < 0) {
      Alert.alert('AtenÃ§Ã£o', 'Informe um valor de mensalidade vÃ¡lido.');
      return;
    }

    if (!dataInicioIso || !dataFimIso) {
      Alert.alert('AtenÃ§Ã£o', 'Informe as datas de inÃ­cio e fim do perÃ­odo letivo.');
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
      Alert.alert('Erro', error?.message || 'NÃ£o foi possÃ­vel salvar os ajustes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.containerLoading}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando ajustes...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.titulo}>ConfiguraÃ§Ãµes</Text>
          <Text style={styles.subtitulo}>Ajuste as regras de negÃ³cio e financeiro</Text>
        </View>

        {/* Card de Resumo das Regras Atuais */}
        {/* <View style={styles.cardRegras}>
          <Text style={styles.cardRegrasTitulo}>Resumo de CobranÃ§a</Text>
          <Text style={styles.cardRegrasTexto}>
            As mensalidades de <Text style={styles.negrito}>R$ {form.valorMensalidade}</Text> serÃ£o geradas todo dia <Text style={styles.negrito}>{form.diaFechamento}</Text> de cada mÃªs.
          </Text>
        </View> */}

        <View style={styles.secao}>
          {/* <Text style={styles.secaoTitulo}>Financeiro</Text> */}
          
          <InputField
            label="Dia de fechamento do mÃªs"
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
            label="InÃ­cio perÃ­odo letivo"
            placeholder="DD/MM/AAAA"
            value={form.dataInicioAulas}
            onChangeText={(v) => setForm({...form, dataInicioAulas: maskData(v)})}
            keyboardType="numeric"
          />

          <InputField
            label="Fim perÃ­odo letivo"
            placeholder="DD/MM/AAAA"
            value={form.dataFimAulas}
            onChangeText={(v) => setForm({...form, dataFimAulas: maskData(v)})}
            keyboardType="numeric"
          />
        </View>

        {sucesso && (
          <View style={styles.sucessoBox}>
            <Text style={styles.sucessoTexto}>âœ“ ConfiguraÃ§Ãµes salvas!</Text>
          </View>
        )}

        <TouchableOpacity style={[styles.botaoSalvar, saving && styles.botaoSalvarDesabilitado]} onPress={handleSalvar} disabled={saving}>
          <Text style={styles.botaoSalvarTexto}>{saving ? 'Salvando...' : 'Atualizar ConfiguraÃ§Ãµes'}</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}


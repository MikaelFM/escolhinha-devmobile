import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors } from '../../constants/colors';
import InputField from '../../components/InputField';
import AppAlertModal from '../../components/AppAlertModal';
import { maskApenasNumeros, maskData } from '../../utils/masks';
import {
  converterDataBRParaDate,
  formatarDataBR,
  formatarIsoParaBr,
  formatarBrParaIsoCurta,
  normalizarValorMonetario,
  monetarioParaNumero,
} from '../../utils/formatters';
import { ajustesService } from '../../services/ajustesService';
import ModalDatePicker from '../RegistroPresenca/ModalDatePicker';
import styles from './styles';

export default function ConfiguracoesSistema({ navigation }) {
  const [form, setForm] = useState({
    diaFechamento: '05',
    valorMensalidade: '',
    dataInicioAulas: '',
    dataFimAulas: '',
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [pickerVisivel, setPickerVisivel] = useState(false);
  const [campoDataAtivo, setCampoDataAtivo] = useState(null);
  const [dataPicker, setDataPicker] = useState(new Date());
  const [alertErro, setAlertErro] = useState({ visible: false, title: '', message: '' });
  const [alertSucesso, setAlertSucesso] = useState({ visible: false, title: '', message: '' });

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
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    carregarAjustes();
  }, [refreshKey]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshKey(k => k + 1);
  }, []);

  const abrirDatePicker = (campo) => {
    const dataAtualCampo = campo === 'dataInicioAulas' ? form.dataInicioAulas : form.dataFimAulas;
    setCampoDataAtivo(campo);
    setDataPicker(converterDataBRParaDate(dataAtualCampo));
    setPickerVisivel(true);
  };

  const handleSalvar = async () => {
    if (saving) return;

    const diaFechamentoNumero = Number(form.diaFechamento);
    const valorMensalidadeNumero = monetarioParaNumero(form.valorMensalidade);
    const dataInicioIso = formatarBrParaIsoCurta(form.dataInicioAulas);
    const dataFimIso = formatarBrParaIsoCurta(form.dataFimAulas);

    if (!Number.isInteger(diaFechamentoNumero) || diaFechamentoNumero < 1 || diaFechamentoNumero > 31) {
      setAlertErro({
        visible: true,
        title: 'Atenção',
        message: 'Informe um dia de fechamento válido entre 1 e 31.',
      });
      return;
    }

    if (!Number.isFinite(valorMensalidadeNumero) || valorMensalidadeNumero < 0) {
      setAlertErro({
        visible: true,
        title: 'Atenção',
        message: 'Informe um valor de mensalidade válido.',
      });
      return;
    }

    if (!dataInicioIso || !dataFimIso) {
      setAlertErro({
        visible: true,
        title: 'Atenção',
        message: 'Informe as datas de início e fim do período letivo.',
      });
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

      setAlertSucesso({
        visible: true,
        title: 'Configurações salvas',
        message: 'Os ajustes foram atualizados com sucesso.',
      });
    } catch (error) {
      setAlertErro({
        visible: true,
        title: 'Erro',
        message: error?.message || 'Não foi possível salvar os ajustes.',
      });
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={120}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        >
          
          <View style={styles.header}>
            <Text style={styles.titulo}>Configurações</Text>
            <Text style={styles.subtitulo}>Ajuste as regras de negócio e financeiro</Text>
          </View>

          <View style={styles.secao}>
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
              onChangeText={(v) => setForm({ ...form, dataInicioAulas: maskData(v) })}
              keyboardType="numeric"
              inputStyle={styles.campoDataEditavel}
            />
            <TouchableOpacity style={styles.botaoCalendario} activeOpacity={0.8} onPress={() => abrirDatePicker('dataInicioAulas')}>
              <Text style={styles.botaoCalendarioTexto}>Selecionar no calendário</Text>
            </TouchableOpacity>

            <InputField
              label="Fim período letivo"
              placeholder="DD/MM/AAAA"
              value={form.dataFimAulas}
              onChangeText={(v) => setForm({ ...form, dataFimAulas: maskData(v) })}
              keyboardType="numeric"
              inputStyle={styles.campoDataEditavel}
            />
            <TouchableOpacity style={styles.botaoCalendario} activeOpacity={0.8} onPress={() => abrirDatePicker('dataFimAulas')}>
              <Text style={styles.botaoCalendarioTexto}>Selecionar no calendário</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.botaoSalvar, saving && styles.botaoSalvarDesabilitado]} onPress={handleSalvar} disabled={saving}>
            {saving ? (
              <View style={styles.botaoSalvarConteudo}>
                <ActivityIndicator size="small" color={colors.textInverted} />
                <Text style={styles.botaoSalvarTexto}>Salvando...</Text>
              </View>
            ) : (
              <Text style={styles.botaoSalvarTexto}>Atualizar Configurações</Text>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>

      <ModalDatePicker
        visible={pickerVisivel}
        dataPicker={dataPicker}
        onChange={(_, selectedDate) => {
          if (selectedDate && campoDataAtivo) {
            const novaData = formatarDataBR(selectedDate);
            setForm((prev) => ({ ...prev, [campoDataAtivo]: novaData }));
          }
          setPickerVisivel(false);
          setCampoDataAtivo(null);
        }}
      />

      <AppAlertModal
        visible={alertErro.visible}
        title={alertErro.title}
        message={alertErro.message}
        variant="error"
        onRequestClose={() => setAlertErro({ visible: false, title: '', message: '' })}
      />

      <AppAlertModal
        visible={alertSucesso.visible}
        title={alertSucesso.title}
        message={alertSucesso.message}
        variant="success"
        onRequestClose={() => {
          setAlertSucesso({ visible: false, title: '', message: '' });
          if (navigation?.canGoBack?.()) {
            navigation.goBack();
          } else {
            navigation?.navigate?.('home');
          }
        }}
      />
    </SafeAreaView>
  );
}



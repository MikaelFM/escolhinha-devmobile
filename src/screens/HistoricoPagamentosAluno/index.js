import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { mensalidadesService } from '../../services/mensalidadesService';
import { cobrancaService } from '../../services/cobrancaService';
import { useAuth } from '../../contexts/AuthContext';
import { formatarDataBR, formatarMesAno } from '../../utils/formatters';
import MensalidadeItemCard from '../../components/MensalidadeItemCard';
import DashboardSummaryCard from '../../components/DashboardSummaryCard';
import AppAlertModal from '../../components/AppAlertModal';
import ModalPixQrCode from './ModalPixQrCode';
import styles from './styles';


export default function HistoricoMensalidadesAluno({ navigation, route }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState(null);
  const [mensalidades, setMensalidades] = useState([]);
  const [pixModalVisible, setPixModalVisible] = useState(false);
  const [pixLoading, setPixLoading] = useState(false);
  const [pixData, setPixData] = useState({ link: '', qr_code_img: '' });
  const [alertErro, setAlertErro] = useState({ visible: false, title: '', message: '' });
  const { userData } = useAuth();

  const rgAluno = userData?.rg_aluno || '';

  useEffect(() => {
    const carregarMensalidades = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!rgAluno) {
          setMensalidades([]);
          setError('RG não informado');
          return;
        }

        const resposta = await mensalidadesService.getMensalidadesAluno(rgAluno);
        const listaBruta = resposta?.mensalidades ?? resposta?.data?.mensalidades ?? resposta?.data ?? [];
        const lista = Array.isArray(listaBruta) ? listaBruta : [];

        const formatadas = lista
          .map((item, index) => {
            const pago = Number(item?.pago) === 1;

            return {
              id: String(item?.id ?? `${rgAluno}-${index}`),
              mes: formatarMesAno(item?.ano, item?.mes),
              valor: `R$ ${String(item?.valor ?? '0.00')}`,
              status: pago ? 'Pago' : 'Pendente',
              dataPagamento: formatarDataBR(item?.data_pagamento),
              pagoViaPix: item?.pago_via_pix === true || Number(item?.pago_via_pix) === 1,
            };
          });

        setMensalidades(formatadas);
      } catch (err) {
        setError(err?.message || 'Erro ao carregar mensalidades');
        setMensalidades([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    carregarMensalidades();
  }, [rgAluno, refreshKey]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshKey(k => k + 1);
  }, []);

  const handleGerarCobrancaPix = async (idMensalidade) => {
    try {
      setPixLoading(true);
      const resposta = await cobrancaService.gerarCobrancaPix(idMensalidade);

      const { link, qr_code_img } = resposta || {};
      
      if (link && qr_code_img) {
        setPixData({ link, qr_code_img });
        setPixModalVisible(true);
      } else {
        setAlertErro({
          visible: true,
          title: 'Erro',
          message: 'Não foi possível gerar o QR code',
        });
      }
    } catch (err) {
      setAlertErro({
        visible: true,
        title: 'Erro',
        message: err?.message || 'Erro ao gerar cobrança PIX',
      });
    } finally {
      setPixLoading(false);
    }
  };

  const stats = useMemo(() => {
    const total = mensalidades.length;
    const pagas = mensalidades.filter((item) => item.status === 'Pago').length;
    const pendentes = total - pagas;
    return { total, pagas, pendentes };
  }, [mensalidades]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      >
        <View style={styles.header}>
          <Text style={styles.titulo}>Mensalidades</Text>
          <Text style={styles.subtitulo}>Histórico de pagamentos e cobranças</Text>
        </View>

        <View style={styles.gridStats}>
          <DashboardSummaryCard
            styles={styles}
            titulo="Pendentes"
            valor={String(stats.pendentes)}
            icone="time-outline"
            corIcone={colors.amber}
            corFundoIcone={colors.warningLight}
          />
          <DashboardSummaryCard
            styles={styles}
            titulo="Total"
            valor={String(stats.total)}
            icone="card-outline"
            corIcone={colors.primary}
          />
        </View>

        <View style={styles.bottomSheet}>
          <Text style={styles.secaoTitulo}>HISTÓRICO RECENTE</Text>

          <View style={styles.listaContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color={colors.primary} />
                <Text style={styles.loadingText}>Carregando mensalidades...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Ionicons name='alert-circle' size={48} color={colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : mensalidades.length > 0 ? (
              mensalidades.map((item) => (
                <MensalidadeItemCard
                  key={item.id}
                  styles={styles}
                  item={item}
                  pixLoading={pixLoading}
                  onGerarPix={handleGerarCobrancaPix}
                  verde={colors.success}
                  laranja={colors.amber}
                />
              ))
            ) : (
              <Text style={styles.vazioTexto}>Nenhum registro</Text>
            )}
          </View>

          <View style={styles.infoFooter}>
            <Ionicons name='shield-checkmark-outline' size={16} color={colors.textPlaceholder} />
            <Text style={styles.infoFooterTexto}>
              Pagamentos via PIX são baixados automaticamente em até 30 minutos.
            </Text>
          </View>
        </View>
      </ScrollView>

      <ModalPixQrCode
        visible={pixModalVisible}
        onClose={() => setPixModalVisible(false)}
        pixData={pixData}
      />

      <AppAlertModal
        visible={alertErro.visible}
        title={alertErro.title}
        message={alertErro.message}
        variant="error"
        onRequestClose={() => setAlertErro({ visible: false, title: '', message: '' })}
      />
    </SafeAreaView>
  );
}





import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Clipboard,
  Alert,
  ActivityIndicator,
  Modal,
  Image,
} from 'react-native';
import { colors } from '../../global/colors';
import { Ionicons } from '@expo/vector-icons';
import { mensalidadesService } from '../../services/mensalidadesService';
import { cobrancaService } from '../../services/cobrancaService';
import { useAuth } from '../../context/AuthContext';
import { formatarDataBR, formatarMesAno } from '../../utils/formatters';

const VERDE = '#16a34a';
const VERMELHO = '#dc2626';
const LARANJA = '#f59e0b';

export default function HistoricoMensalidadesAluno({ navigation, route }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensalidades, setMensalidades] = useState([]);
  const [pixModalVisible, setPixModalVisible] = useState(false);
  const [pixLoading, setPixLoading] = useState(false);
  const [pixData, setPixData] = useState({ link: '', qr_code_img: '' });
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
        console.log('Erro ao carregar mensalidades:', err);
        setError(err?.message || 'Erro ao carregar mensalidades');
        setMensalidades([]);
      } finally {
        setLoading(false);
      }
    };

    carregarMensalidades();
  }, [rgAluno]);

  const handleCopiarPix = (codigo) => {
    Clipboard.setString(codigo);
    Alert.alert('Pix Copiado!', 'O código Copia e Cola foi copiado para sua área de transferência.');
  };

  const handleGerarCobrancaPix = async (idMensalidade) => {
    try {
      setPixLoading(true);
      const resposta = await cobrancaService.gerarCobrancaPix(idMensalidade);

      const { link, qr_code_img } = resposta || {};
      
      if (link && qr_code_img) {
        setPixData({ link, qr_code_img });
        setPixModalVisible(true);
      } else {
        Alert.alert('Erro', 'Não foi possível gerar o QR code');
      }
    } catch (err) {
      console.log('Erro ao gerar cobrança PIX:', err);
      Alert.alert('Erro', err?.message || 'Erro ao gerar cobrança PIX');
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

  const MensalidadeItem = ({ item }) => {
    const isPago = item.status === 'Pago';

    return (
      <View style={[styles.cardMensalidade, !isPago && styles.cardPendente]}>
        <View style={[styles.iconWrapper, { backgroundColor: isPago ? '#f0fdf4' : '#fff7ed' }]}>
          <Ionicons
            name={isPago ? 'checkmark-circle-outline' : 'alert-circle-outline'}
            size={24}
            color={isPago ? VERDE : LARANJA}
          />
        </View>

        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={styles.mesTitulo}>{item.mes}</Text>
          <Text style={styles.valorSubtitulo}>
            {item.valor} • {isPago ? `Pago em ${item.dataPagamento}` : 'Em aberto'}
          </Text>
          {item.pagoViaPix && <Text style={styles.pixInfo}>Pago via PIX</Text>}
        </View>

        {!isPago ? (
          <TouchableOpacity
            style={styles.btnPix}
            onPress={() => handleGerarCobrancaPix(item.id)}
            disabled={pixLoading}
          >
            {pixLoading ? (
              <ActivityIndicator size='small' color='#fff' />
            ) : (
              <Ionicons name='copy-outline' size={18} color='#fff' />
            )}
            <Text style={styles.btnPixTexto}>{pixLoading ? 'Gerando...' : 'PIX'}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.badgePago}>
            <Text style={styles.badgePagoTexto}>PAGO</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name='chevron-back' size={28} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.titulo}>Mensalidades</Text>
          <Text style={styles.subtitulo}>Histórico de pagamentos e cobranças</Text>
        </View>

        <View style={styles.resumoCard}>
          <View style={styles.resumoItem}>
            <Text style={styles.resumoLabel}>STATUS ATUAL</Text>
            <Text style={[styles.resumoValor, { color: LARANJA }]}>{stats.pendentes} Pendente(s)</Text>
          </View>
          <View style={styles.divisor} />
          <View style={styles.resumoItem}>
            <Text style={styles.resumoLabel}>TOTAL</Text>
            <Text style={styles.resumoValor}>{stats.total}</Text>
          </View>
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
                <Ionicons name='alert-circle' size={48} color={VERMELHO} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : mensalidades.length > 0 ? (
              mensalidades.map((item) => <MensalidadeItem key={item.id} item={item} />)
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

      {/* Modal PIX QR Code */}
      <Modal
        animationType='fade'
        transparent={true}
        visible={pixModalVisible}
        onRequestClose={() => setPixModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setPixModalVisible(false)}
            >
              <Ionicons name='close' size={24} color={colors.primary} />
            </TouchableOpacity>

            <Text style={styles.modalTitulo}>Código QR - PIX</Text>

            {pixData.qr_code_img && (
              <View style={styles.qrCodeContainer}>
                <Image
                  source={{ uri: `data:image/png;base64,${pixData.qr_code_img}` }}
                  style={styles.qrCodeImage}
                />
              </View>
            )}

            <Text style={styles.modalSubtitulo}>Ou copie o código PIX Copia e Cola:</Text>

            <View style={styles.linkContainer}>
              <Text style={styles.linkTexto} numberOfLines={3}>
                {pixData.link}
              </Text>
              <TouchableOpacity
                style={styles.btnCopiarLink}
                onPress={() => {
                  Clipboard.setString(pixData.link);
                }}
              >
                <Ionicons name='copy' size={18} color='#fff' />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.btnFechar}
              onPress={() => setPixModalVisible(false)}
            >
              <Text style={styles.btnFecharTexto}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  bottomSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: 8,
    paddingTop: 12,
    paddingBottom: 24,
    shadowColor: colors.textPlaceholder,
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -8 },
    elevation: 20,
  },
  header: { paddingHorizontal: 20, paddingTop: 60, marginBottom: 20 },
  backBtn: { marginLeft: -10, marginBottom: 10 },
  titulo: { fontSize: 32, fontWeight: '800', color: colors.primary, letterSpacing: -0.5 },
  subtitulo: { fontSize: 14, color: colors.textPlaceholder, marginTop: 4 },

  resumoCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 25,
  },
  resumoItem: { flex: 1, alignItems: 'center' },
  resumoLabel: { fontSize: 9, fontWeight: '900', color: colors.textPlaceholder, letterSpacing: 1, marginBottom: 5 },
  resumoValor: { fontSize: 16, fontWeight: '800', color: colors.primary },
  divisor: { width: 1, backgroundColor: '#e2e8f0', height: '100%' },

  secaoTitulo: {
    fontSize: 11, fontWeight: '900', color: colors.textPlaceholder,
    marginLeft: 20, marginBottom: 15, letterSpacing: 1,
  },

  listaContainer: { marginHorizontal: 20 },
  cardMensalidade: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  cardPendente: {
    backgroundColor: '#fffcf9',
    borderRadius: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 0,
    marginBottom: 10,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mesTitulo: { fontSize: 16, fontWeight: '700', color: colors.primary },
  valorSubtitulo: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  pixInfo: { fontSize: 11, fontWeight: '700', color: '#0f766e', marginTop: 3 },

  btnPix: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 5,
  },
  btnPixTexto: { color: '#fff', fontSize: 11, fontWeight: '800' },

  badgePago: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#f0fdf4',
  },
  badgePagoTexto: { fontSize: 10, fontWeight: '900', color: VERDE },

  loadingContainer: { paddingVertical: 25, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 10, color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  errorContainer: { paddingVertical: 25, alignItems: 'center', justifyContent: 'center' },
  errorText: { marginTop: 10, color: VERMELHO, fontSize: 13, fontWeight: '600', textAlign: 'center' },
  vazioTexto: { color: colors.textPlaceholder, fontSize: 13, fontWeight: '600', paddingVertical: 12 },

  infoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 30,
    marginTop: 30,
    gap: 8,
    opacity: 0.7,
  },
  infoFooterTexto: { fontSize: 11, color: colors.textSecondary, flex: 1, lineHeight: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalCloseBtn: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 10,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 20,
    marginTop: 10,
  },
  qrCodeContainer: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  qrCodeImage: {
    width: 220,
    height: 220,
  },
  modalSubtitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 12,
  },
  linkContainer: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  linkTexto: {
    flex: 1,
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  btnCopiarLink: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnFechar: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  btnFecharTexto: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
});

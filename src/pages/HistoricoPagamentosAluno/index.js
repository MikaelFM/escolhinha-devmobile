import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Clipboard,
  Alert,
  ActivityIndicator,
  Modal,
  Image
} from 'react-native';
import { colors } from '../../global/colors';
import { Ionicons } from '@expo/vector-icons';
import { mensalidadesService } from '../../services/mensalidadesService';
import { cobrancaService } from '../../services/cobrancaService';
import { useAuth } from '../../context/AuthContext';
import { formatarDataBR, formatarMesAno } from '../../utils/formatters';
import styles from './styles';

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
          setError('RG nÃ£o informado');
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
    Alert.alert('Pix Copiado!', 'O cÃ³digo Copia e Cola foi copiado para sua Ã¡rea de transferÃªncia.');
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
        Alert.alert('Erro', 'NÃ£o foi possÃ­vel gerar o QR code');
      }
    } catch (err) {
      console.log('Erro ao gerar cobranÃ§a PIX:', err);
      Alert.alert('Erro', err?.message || 'Erro ao gerar cobranÃ§a PIX');
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
            {item.valor} â€¢ {isPago ? `Pago em ${item.dataPagamento}` : 'Em aberto'}
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
          <Text style={styles.subtitulo}>HistÃ³rico de pagamentos e cobranÃ§as</Text>
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
          <Text style={styles.secaoTitulo}>HISTÃ“RICO RECENTE</Text>

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
              Pagamentos via PIX sÃ£o baixados automaticamente em atÃ© 30 minutos.
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

            <Text style={styles.modalTitulo}>CÃ³digo QR - PIX</Text>

            {pixData.qr_code_img && (
              <View style={styles.qrCodeContainer}>
                <Image
                  source={{ uri: `data:image/png;base64,${pixData.qr_code_img}` }}
                  style={styles.qrCodeImage}
                />
              </View>
            )}

            <Text style={styles.modalSubtitulo}>Ou copie o cÃ³digo PIX Copia e Cola:</Text>

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


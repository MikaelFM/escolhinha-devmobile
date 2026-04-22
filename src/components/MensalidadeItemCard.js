import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MensalidadeItemCard({
  styles,
  item,
  pixLoading,
  onGerarPix,
  verde,
  laranja,
}) {
  const isPago = item.status === 'Pago';

  return (
    <View style={[styles.cardMensalidade, !isPago && styles.cardPendente]}>
      <View style={[styles.iconWrapper, { backgroundColor: isPago ? '#f0fdf4' : '#fff7ed' }]}>
        <Ionicons
          name={isPago ? 'checkmark-circle-outline' : 'alert-circle-outline'}
          size={24}
          color={isPago ? verde : laranja}
        />
      </View>

      <View style={{ flex: 1, marginLeft: 15 }}>
        <Text style={styles.mesTitulo}>{item.mes}</Text>
        <Text style={styles.valorSubtitulo}>
          {item.valor} • {isPago ? `Pago em ${item.dataPagamento}` : 'Em aberto'}
        </Text>
        {item.pagoViaPix ? <Text style={styles.pixInfo}>Pago via PIX</Text> : null}
      </View>

      {!isPago ? (
        <TouchableOpacity
          style={styles.btnPix}
          onPress={() => onGerarPix(item.id)}
          disabled={pixLoading}
        >
          {pixLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="copy-outline" size={18} color="#fff" />
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
}

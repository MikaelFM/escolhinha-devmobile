import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PresencaItemCard({ styles, item, verde, vermelho }) {
  const isPresente = item.status === 'Presente';

  return (
    <View style={[styles.cardPresenca, !isPresente && styles.cardFalta]}>
      <View style={[styles.iconWrapper, { backgroundColor: isPresente ? '#f0fdf4' : '#fef2f2' }]}>
        <Ionicons
          name={isPresente ? 'checkmark-circle-outline' : 'close-circle-outline'}
          size={24}
          color={isPresente ? verde : vermelho}
        />
      </View>

      <View style={{ flex: 1, marginLeft: 15 }}>
        <Text style={styles.dataTitulo}>{item.data} • {item.diaSemana}</Text>
      </View>

      <View style={[styles.statusBadge, { backgroundColor: isPresente ? '#f0fdf4' : '#fef2f2' }]}>
        <Text style={[styles.statusTexto, { color: isPresente ? verde : vermelho }]}>
          {item.status.toUpperCase()}
        </Text>
      </View>
    </View>
  );
}

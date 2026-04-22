import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../global/colors';

export default function DashboardSummaryCard({ styles, titulo, valor, icone, corIcone = colors.primary }) {
  return (
    <View style={styles.cardResumo}>
      <View style={styles.iconContainer}>
        <Ionicons name={icone} size={22} color={corIcone} />
      </View>
      <View>
        <Text style={styles.cardLabel}>{titulo}</Text>
        <Text style={styles.cardValor}>{valor}</Text>
      </View>
    </View>
  );
}

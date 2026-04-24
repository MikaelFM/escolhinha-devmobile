import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

export default function DashboardSummaryCard({ styles, titulo, valor, icone, corIcone = colors.primary, corValor, corFundo = null, corFundoIcone = null }) {
  return (
    <View style={[styles.cardResumo, corFundo ? { backgroundColor: corFundo } : null]}>
      <View style={[styles.iconContainer, corFundoIcone ? { backgroundColor: corFundoIcone } : null]}>
        <Ionicons name={icone} size={22} color={corIcone} />
      </View>
      <View>
        <Text style={styles.cardLabel}>{titulo}</Text>
        <Text style={[styles.cardValor, corValor ? { color: corValor } : null]}>{valor}</Text>
      </View>
    </View>
  );
}

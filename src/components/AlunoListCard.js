import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

export default function AlunoListCard({
  styles,
  nomeAluno,
  categoriaAluno,
  responsavel,
  emDia,
  frequencia,
  faltas,
  onPress,
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>{nomeAluno.substring(0, 2).toUpperCase()}</Text>
        </View>

        <View style={styles.infoPrincipal}>
          <Text style={styles.nomeAluno}>{nomeAluno}</Text>
          <Text style={styles.categoriaTexto}>
            {categoriaAluno} • {responsavel || 'Sem responsável'}
          </Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: emDia ? colors.successLight : colors.errorLight }]}>
          <Text style={[styles.statusTexto, { color: emDia ? colors.success : colors.error }]}>
            {emDia ? 'EM DIA' : 'ATRASO'}
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.statItem}>
          <Ionicons name="calendar-outline" size={14} color={colors.textPlaceholder} />
          <Text style={styles.statTexto}>{Math.round(frequencia)}% Frequência</Text>
        </View>

        <View style={styles.statItem}>
          <Ionicons name="alert-circle-outline" size={14} color={colors.textPlaceholder} />
          <Text style={styles.statTexto}>{faltas} Faltas</Text>
        </View>

        <Ionicons name="chevron-forward" size={16} color={colors.borderStrong} style={{ marginLeft: 'auto' }} />
      </View>
    </TouchableOpacity>
  );
}

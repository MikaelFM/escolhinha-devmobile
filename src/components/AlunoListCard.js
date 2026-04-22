import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

        <View style={[styles.statusBadge, { backgroundColor: emDia ? '#f0fdf4' : '#fef2f2' }]}>
          <Text style={[styles.statusTexto, { color: emDia ? '#16a34a' : '#dc2626' }]}>
            {emDia ? 'EM DIA' : 'ATRASO'}
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.statItem}>
          <Ionicons name="calendar-outline" size={14} color="#94a3b8" />
          <Text style={styles.statTexto}>{Math.round(frequencia)}% Frequência</Text>
        </View>

        <View style={styles.statItem}>
          <Ionicons name="alert-circle-outline" size={14} color="#94a3b8" />
          <Text style={styles.statTexto}>{faltas} Faltas</Text>
        </View>

        <Ionicons name="chevron-forward" size={16} color="#cbd5e1" style={{ marginLeft: 'auto' }} />
      </View>
    </TouchableOpacity>
  );
}

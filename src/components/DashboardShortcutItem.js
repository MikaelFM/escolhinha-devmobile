import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

export default function DashboardShortcutItem({
  styles,
  icone,
  titulo,
  onPress,
  ultimo = false,
  primeiro = false,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.btnAcao,
        primeiro && styles.btnAcaoPrimeiro,
        ultimo && styles.btnAcaoUltimo,
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.iconWrapperAtalho}>
        <Ionicons name={icone} size={20} color={colors.primary} />
      </View>
      <View style={styles.btnAcaoConteudo}>
        <Text style={styles.btnAcaoTexto}>{titulo}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.primaryAccent} />
    </TouchableOpacity>
  );
}

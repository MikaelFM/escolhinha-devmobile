import React from 'react';
import { View, Text, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

export default function SettingsOptionItem({
  styles,
  icone,
  titulo,
  subtitulo,
  onPress,
  valor,
  isSwitch,
  isDanger,
  loading = false,
  dangerIconBackground = false,
}) {
  return (
    <TouchableOpacity
      style={styles.cardOpcao}
      onPress={onPress}
      disabled={isSwitch || loading}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconWrapper,
          dangerIconBackground && isDanger && { backgroundColor: colors.errorLight },
        ]}
      >
        <Ionicons name={icone} size={22} color={isDanger ? colors.error : colors.primary} />
      </View>

      <View style={{ flex: 1, marginLeft: 15 }}>
        <Text style={[styles.opcaoTitulo, isDanger && styles.opcaoTituloDanger]}>{titulo}</Text>
        {subtitulo ? <Text style={styles.opcaoSubtitulo}>{subtitulo}</Text> : null}
      </View>

      {isSwitch && loading ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : isSwitch ? (
        <Switch
          trackColor={{ false: colors.borderStrong, true: colors.primaryBorder }}
          thumbColor={valor ? colors.primary : colors.textPlaceholder}
          onValueChange={onPress}
          value={valor}
          disabled={loading}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color={colors.borderStrong} />
      )}
    </TouchableOpacity>
  );
}

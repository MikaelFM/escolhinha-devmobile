import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';

export default function RegistroAlunoCard({
  styles,
  item,
  isEditMode,
  isPresente,
  statusConhecido,
  onToggle,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.cardAluno,
        !statusConhecido ? styles.cardSemRegistro : (isPresente ? styles.cardPresente : styles.cardAusente),
      ]}
      onPress={onToggle}
      disabled={!isEditMode}
    >
      <View style={{ flex: 1 }}>
        <View
          style={[
            styles.statusLinhaColorida,
            !statusConhecido ? styles.statusCinza : (isPresente ? styles.statusVerde : styles.statusVermelho),
          ]}
        />
        <Text style={[styles.nomeAluno, !isPresente && statusConhecido && { color: colors.errorDark }]}>{item.nome}</Text>
        <Text style={styles.subtituloAluno}>
          {!statusConhecido ? 'Sem registro' : (isPresente ? 'Presente' : 'Faltou')}
        </Text>
      </View>

      {isEditMode ? (
        <View style={[styles.checkbox, isPresente ? styles.checkboxChecked : styles.checkboxUnchecked]}>
          <Text style={styles.checkText}>{isPresente ? '✓' : '✕'}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

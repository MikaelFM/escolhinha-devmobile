import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  TextInputProps,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { colors } from '../global/colors';

type Variante = 'texto' | 'senha' | 'select';

interface CampoInputProps {
  label: string;
  obrigatorio?: boolean;
  placeholder?: string;
  value: string;
  disabled?: boolean;
  onChangeText?: (valor: string) => void;
  onBlur?: () => void;
  onSelect?: (opcao: string) => void;
  opcoes?: string[];
  erro?: string;
  mascara?: (valor: string) => string;
  variante?: Variante;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  style?: object;
}

export default function InputField({
  label,
  obrigatorio = false,
  placeholder = '',
  value,
  disabled = false,
  onChangeText,
  onBlur,
  onSelect,
  opcoes = [],
  erro = '',
  mascara,
  variante = 'texto',
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  style,
}: CampoInputProps) {
  const [focado, setFocado] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const temErro = !!erro;

  const handleChangeText = (texto: string) => {
    const valorFormatado = mascara ? mascara(texto) : texto;
    onChangeText?.(valorFormatado);
  };

  const handleSelect = (opcao: string) => {
    onSelect?.(opcao);
    setModalAberto(false);
  };

  const handleBlur = () => {
    setFocado(false);
    onBlur?.();
  };

  const estiloInput = [
    styles.input,
    focado && styles.inputFocado,
    temErro && styles.inputErro,
    disabled && styles.inputDisabled,
  ];

  const estiloSelect = [
    styles.selectContainer,
    focado && styles.selectFocado,
    temErro && styles.selectErro,
    disabled && styles.selectDisabled,
  ];

  return (
    <View style={[styles.wrapper, style]}>
      <Text style={styles.label}>
        {label}
        {obrigatorio && <Text style={styles.asterisco}> *</Text>}
      </Text>

      {variante === 'select' ? (
        <>
          <TouchableOpacity
            style={[estiloSelect, styles.selectButtonContent]}
            onPress={() => {
              if (!disabled) setModalAberto(true);
            }}
            activeOpacity={0.8}
            disabled={disabled}
          >
            <Text
              style={[value ? styles.selectTexto : styles.selectPlaceholder]}
              numberOfLines={1}
            >
              {value || placeholder}
            </Text>
            <Text style={styles.selectIcone}>▾</Text>
          </TouchableOpacity>

          <Modal
            visible={modalAberto}
            transparent
            animationType="slide"
            onRequestClose={() => setModalAberto(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setModalAberto(false)}
            >
              <View style={styles.modalBox}>
                <View style={styles.modalHandle} />
                <Text style={styles.modalTitulo}>{label}</Text>
                <FlatList
                  data={opcoes}
                  keyExtractor={item => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.modalItem,
                        value === item && styles.modalItemAtivo,
                      ]}
                      onPress={() => handleSelect(item)}
                    >
                      <Text style={[
                        styles.modalItemTexto,
                        value === item && styles.modalItemTextoAtivo,
                      ]}>
                        {item}
                      </Text>
                      {value === item && (
                        <Text style={styles.modalCheck}>✓</Text>
                      )}
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => <View style={styles.separador} />}
                />
              </View>
            </TouchableOpacity>
          </Modal>
        </>
      ) : (
        <View style={styles.inputWrapper}>
          <TextInput
            style={estiloInput}
            placeholder={placeholder}
            placeholderTextColor={colors.textPlaceholder}
            value={value}
            onChangeText={handleChangeText}
            onFocus={() => setFocado(true)}
            onBlur={handleBlur}
            secureTextEntry={variante === 'senha' && !senhaVisivel}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            editable={!disabled}
          />
          {variante === 'senha' && (
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setSenhaVisivel(!senhaVisivel)}
            >
              <Ionicons
                name={senhaVisivel ? 'eye' : 'eye-off'}
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
          )}
        </View>
      )}

      <View style={styles.erroContainer}>
        {temErro && <Text style={styles.erroTexto}>{erro}</Text>}
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  asterisco: {
    color: colors.primary,
    fontWeight: '700',
  },
  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingRight: 48,
  },
  inputFocado: {
    borderColor: colors.primary,
    backgroundColor: '#ffffff',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 0,
  },
  inputErro: {
    borderColor: colors.errorBorder,
    backgroundColor: colors.errorLight,
  },
  inputDisabled: {
    backgroundColor: '#f8fafc',
    opacity: 0.75,
  },
  erroContainer: {
    minHeight: 20,
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 6,
  },
  erroTexto: {
    color: colors.error,
    fontSize: 12,
    fontWeight: '500',
  },
  selectContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectFocado: {
    borderColor: colors.primary,
    backgroundColor: '#ffffff',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  selectErro: {
    borderColor: colors.errorBorder,
    backgroundColor: colors.errorLight,
  },
  selectDisabled: {
    backgroundColor: '#f8fafc',
    opacity: 0.75,
  },
  selectButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectTexto: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    flexShrink: 1,
  },
  selectPlaceholder: {
    flex: 1,
    fontSize: 15,
    color: colors.textPlaceholder,
    flexShrink: 1,
  },
  selectIcone: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '700',
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    padding: 8,
    zIndex: 10,
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 40,
    paddingHorizontal: 20,
    maxHeight: '60%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e2e8f0',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  modalItemAtivo: {
    backgroundColor: colors.primaryBorder,
  },
  modalItemTexto: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
  },
  modalItemTextoAtivo: {
    color: colors.primary,
    fontWeight: '700',
  },
  modalCheck: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '700',
  },
  separador: {
    height: 1,
    backgroundColor: '#f1f5f9',
  },
});
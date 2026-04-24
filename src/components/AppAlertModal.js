import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

const VARIANT_CONFIG = {
  info: {
    icon: 'information-circle-outline',
    accent: colors.info,
    accentSoft: colors.infoLight,
  },
  success: {
    icon: 'checkmark-circle-outline',
    accent: colors.success,
    accentSoft: colors.successLight,
  },
  warning: {
    icon: 'warning-outline',
    accent: colors.warning,
    accentSoft: colors.warningLight,
  },
  error: {
    icon: 'close-circle-outline',
    accent: colors.error,
    accentSoft: colors.errorLight,
  },
};

export default function AppAlertModal({
  visible,
  title = 'Atenção',
  message = '',
  variant = 'info',
  actions = [],
  onRequestClose,
}) {
  const config = VARIANT_CONFIG[variant] || VARIANT_CONFIG.info;
  const botoes = actions.length > 0
    ? actions
    : [{ label: 'OK', variant: 'primary', onPress: onRequestClose }];

  const handleAction = (action) => {
    if (action?.closeOnPress !== false) {
      onRequestClose?.();
    }

    if (typeof action?.onPress === 'function') {
      action.onPress();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose}>
      <Pressable style={styles.overlay} onPress={onRequestClose}>
        <Pressable style={styles.card} onPress={() => null}>
          <View style={styles.header}>
            <View style={[styles.iconBadge, { backgroundColor: config.accentSoft }]}>
              <Ionicons name={config.icon} size={28} color={config.accent} />
            </View>
          </View>

          <Text style={styles.title}>{title}</Text>

          <ScrollView style={styles.messageScroll} contentContainerStyle={styles.messageContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.message}>{message}</Text>
          </ScrollView>

          <View style={styles.actions}>
            {botoes.map((action, index) => {
              const isPrimary = action?.variant !== 'secondary';

              return (
                <Pressable
                  key={`${action?.label || 'acao'}-${index}`}
                  style={[
                    styles.button,
                    isPrimary ? { backgroundColor: config.accent } : styles.buttonSecondary,
                    botoes.length > 1 && index === 0 ? styles.buttonSpacing : null,
                  ]}
                  onPress={() => handleAction(action)}
                >
                  <Text style={[styles.buttonText, !isPrimary ? styles.buttonTextSecondary : null]}>
                    {action?.label || 'OK'}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.background,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    shadowColor: colors.shadowColor,
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 14,
  },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  topBar: {
    width: 56,
    height: 4,
    borderRadius: 999,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 10,
  },
  messageScroll: {
    maxHeight: 180,
  },
  messageContent: {
    paddingBottom: 8,
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
  },
  buttonSpacing: {
    marginRight: 10,
  },
  button: {
    flex: 1,
    minHeight: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  buttonSecondary: {
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.borderMedium,
  },
  buttonText: {
    color: colors.textInverted,
    fontSize: 15,
    fontWeight: '700',
  },
  buttonTextSecondary: {
    color: colors.textDark,
  },
});
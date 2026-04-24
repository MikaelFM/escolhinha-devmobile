import { Modal, View, Text, TouchableOpacity, Image, Clipboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import styles from './styles';

export default function ModalPixQrCode({ visible, onClose, pixData }) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.modalCloseBtn}
            onPress={onClose}
          >
            <Ionicons name="close" size={24} color={colors.primary} />
          </TouchableOpacity>

          <Text style={styles.modalTitulo}>Código QR - PIX</Text>

          {pixData.qr_code_img && (
            <View style={styles.qrCodeContainer}>
              <Image
                source={{ uri: `data:image/png;base64,${pixData.qr_code_img}` }}
                style={styles.qrCodeImage}
              />
            </View>
          )}

          <Text style={styles.modalSubtitulo}>Ou copie o código PIX Copia e Cola:</Text>

          <View style={styles.linkContainer}>
            <Text style={styles.linkTexto} numberOfLines={3}>
              {pixData.link}
            </Text>
            <TouchableOpacity
              style={styles.btnCopiarLink}
              onPress={() => Clipboard.setString(pixData.link)}
            >
              <Ionicons name="copy" size={18} color={colors.textInverted} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.btnFechar}
            onPress={onClose}
          >
            <Text style={styles.btnFecharTexto}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

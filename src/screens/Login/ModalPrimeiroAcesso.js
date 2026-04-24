import { Modal, View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';

export default function ModalPrimeiroAcesso({ visible, onClose }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalBox}>
          <View style={styles.modalHandle} />

          <Text style={styles.modalTitulo}>Primeiro Acesso</Text>
          <Text style={styles.modalSubtitulo}>
            Siga os passos abaixo para entrar pela primeira vez:
          </Text>

          <View style={styles.passoContainer}>
            <View style={styles.passoBadge}>
              <Text style={styles.passoBadgeTexto}>1</Text>
            </View>
            <Text style={styles.passoTexto}>
              Use seu <Text style={styles.passoDestaque}>RG</Text> como usuário.
            </Text>
          </View>

          <View style={styles.passoContainer}>
            <View style={styles.passoBadge}>
              <Text style={styles.passoBadgeTexto}>2</Text>
            </View>
            <Text style={styles.passoTexto}>
              A <Text style={styles.passoDestaque}>senha padrão</Text> é a data de nascimento invertida, tudo junto, sem barras.
            </Text>
          </View>

          <View style={styles.exemploBox}>
            <Text style={styles.exemploTexto}>
              {' Exemplo:  '}
              <Text style={styles.exemploDestaque}>20/08/2004</Text>
              {'  →  '}
              <Text style={styles.exemploDestaque}>20040820</Text>
            </Text>
          </View>

          <View style={styles.passoContainer}>
            <View style={styles.passoBadge}>
              <Text style={styles.passoBadgeTexto}>3</Text>
            </View>
            <Text style={styles.passoTexto}>
              Após entrar, altere sua senha em{' '}
              <Text style={styles.passoDestaque}>Ajustes → Alterar Senha</Text>.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.modalBotao}
            onPress={onClose}
          >
            <Text style={styles.modalBotaoTexto}>Entendi</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

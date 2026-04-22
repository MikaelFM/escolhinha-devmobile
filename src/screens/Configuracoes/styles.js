import { StyleSheet } from 'react-native';
import { colors } from '../../global/colors';

const styles = StyleSheet.create({
  containerLoading: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14, color: colors.textSecondary, fontWeight: '600' },
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 25 },
  header: { marginBottom: 30, paddingBottom: 30 },
  titulo: { fontSize: 26, fontWeight: '700', color: colors.primaryDark },
  subtitulo: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  
  cardRegras: {
    backgroundColor: colors.backgroundSecondary,
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
  },
  cardRegrasTitulo: { fontSize: 14, fontWeight: '700', color: colors.primary, marginBottom: 5 },
  cardRegrasTexto: { fontSize: 14, color: '#475569', lineHeight: 20 },
  negrito: { fontWeight: '700', color: '#1e293b' },

  secao: { marginBottom: 25 },
  secaoTitulo: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#1e293b', 
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 8
  },

  rowSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  labelSwitch: { fontSize: 15, fontWeight: '600', color: '#1e293b' },
  sublabelSwitch: { fontSize: 12, color: colors.textPlaceholder, marginTop: 2 },

  sucessoBox: {
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  sucessoTexto: { color: '#16a34a', fontWeight: '600' },

  botaoSalvar: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  botaoSalvarDesabilitado: { opacity: 0.6 },
  botaoSalvarTexto: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});

export default styles;



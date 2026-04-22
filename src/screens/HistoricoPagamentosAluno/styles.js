import { StyleSheet } from 'react-native';
import { colors } from '../../global/colors';

const VERDE = '#16a34a';
const VERMELHO = '#dc2626';
const AZUL_CLARO = '#e0f2fe';
const LARANJA = '#f59e0b';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  bottomSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: 8,
    paddingTop: 12,
    paddingBottom: 24,
    shadowColor: colors.textPlaceholder,
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -8 },
    elevation: 20,
  },
  header: { paddingHorizontal: 20, paddingTop: 60, marginBottom: 20 },
  backBtn: { marginLeft: -10, marginBottom: 10 },
  titulo: { fontSize: 32, fontWeight: '800', color: colors.primary, letterSpacing: -0.5 },
  subtitulo: { fontSize: 14, color: colors.textPlaceholder, marginTop: 4 },

  resumoCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 25,
  },
  resumoItem: { flex: 1, alignItems: 'center' },
  resumoLabel: { fontSize: 9, fontWeight: '900', color: colors.textPlaceholder, letterSpacing: 1, marginBottom: 5 },
  resumoValor: { fontSize: 16, fontWeight: '800', color: colors.primary },
  divisor: { width: 1, backgroundColor: '#e2e8f0', height: '100%' },

  secaoTitulo: {
    fontSize: 11, fontWeight: '900', color: colors.textPlaceholder,
    marginLeft: 20, marginBottom: 15, letterSpacing: 1,
  },

  listaContainer: { marginHorizontal: 20 },
  cardMensalidade: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  cardPendente: {
    backgroundColor: '#fffcf9',
    borderRadius: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 0,
    marginBottom: 10,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mesTitulo: { fontSize: 16, fontWeight: '700', color: colors.primary },
  valorSubtitulo: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  pixInfo: { fontSize: 11, fontWeight: '700', color: '#0f766e', marginTop: 3 },

  btnPix: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 5,
  },
  btnPixTexto: { color: '#fff', fontSize: 11, fontWeight: '800' },

  badgePago: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#f0fdf4',
  },
  badgePagoTexto: { fontSize: 10, fontWeight: '900', color: VERDE },

  loadingContainer: { paddingVertical: 25, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 10, color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  errorContainer: { paddingVertical: 25, alignItems: 'center', justifyContent: 'center' },
  errorText: { marginTop: 10, color: VERMELHO, fontSize: 13, fontWeight: '600', textAlign: 'center' },
  vazioTexto: { color: colors.textPlaceholder, fontSize: 13, fontWeight: '600', paddingVertical: 12 },

  infoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 30,
    marginTop: 30,
    gap: 8,
    opacity: 0.7,
  },
  infoFooterTexto: { fontSize: 11, color: colors.textSecondary, flex: 1, lineHeight: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalCloseBtn: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 10,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 20,
    marginTop: 10,
  },
  qrCodeContainer: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  qrCodeImage: {
    width: 220,
    height: 220,
  },
  modalSubtitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 12,
  },
  linkContainer: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  linkTexto: {
    flex: 1,
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  btnCopiarLink: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnFechar: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  btnFecharTexto: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
});

export default styles;



import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../constants/colors';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    marginBottom: 20,
  },
  backBtn: {
    marginLeft: -10,
    marginBottom: 10,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primaryDark,
    letterSpacing: -0.5,
    marginTop: 40,
  },
  subtitulo: {
    fontSize: 14,
    color: colors.textPlaceholder,
    marginTop: 4,
  },

  gridStats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardResumo: {
    width: (width / 2) - 28,
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textPlaceholder,
    textTransform: 'uppercase',
  },
  cardValor: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primaryDark,
  },

  bottomSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: 8,
    paddingTop: 12,
    paddingBottom: 24,
  },
  secaoTitulo: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.textPlaceholder,
    marginLeft: 20,
    marginBottom: 15,
    letterSpacing: 1,
  },

  listaContainer: {
    marginHorizontal: 20,
  },
  cardMensalidade: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingHorizontal: 10,
  },
  cardPendente: {
    backgroundColor: colors.warningVeryLight,
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
  mesTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  valorSubtitulo: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  pixInfo: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.pix,
    marginTop: 3,
  },

  btnPix: {
    backgroundColor: colors.amber,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 5,
  },
  btnPixTexto: {
    color: colors.textInverted,
    fontSize: 11,
    fontWeight: '800',
  },

  badgePago: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: colors.successLight,
  },
  badgePagoTexto: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.success,
  },

  loadingContainer: {
    paddingVertical: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  errorContainer: {
    paddingVertical: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    marginTop: 10,
    color: colors.error,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  vazioTexto: {
    color: colors.textPlaceholder,
    fontSize: 13,
    fontWeight: '600',
    paddingVertical: 12,
  },

  infoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 30,
    marginTop: 30,
    gap: 8,
    opacity: 0.7,
  },
  infoFooterTexto: {
    fontSize: 11,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 16,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 30,
    width: '85%',
    alignItems: 'center',
    shadowColor: colors.shadowColor,
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
    color: colors.textSecondary,
    marginBottom: 12,
  },
  linkContainer: {
    backgroundColor: colors.infoLight,
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
    color: colors.textInverted,
    fontSize: 14,
    fontWeight: '800',
  },
});

export default styles;

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

  buscaWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 14,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.borderMedium,
  },
  buscaInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },

  selectContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  selectTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.borderMedium,
  },
  selectTriggerTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  selectLista: {
    backgroundColor: colors.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderMedium,
    marginTop: 4,
    overflow: 'hidden',
  },
  selectItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  selectItemAtivo: {
    backgroundColor: colors.primaryLight,
  },
  selectItemTexto: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  selectItemTextoAtivo: {
    color: colors.primary,
    fontWeight: '700',
  },

  secaoHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
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

  estadoContainer: {
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  estadoTexto: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },

  cardAluno: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.borderMedium,
  },

  statusPilula: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 6,
  },
  statusVerde: {
    backgroundColor: colors.successLight,
  },
  statusVermelho: {
    backgroundColor: colors.errorVeryLight,
  },
  statusTexto: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statusTextoVerde: {
    color: colors.success,
  },
  statusTextoVermelho: {
    color: colors.error,
  },

  nomeAluno: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 2,
  },
  rgAluno: {
    fontSize: 12,
    color: colors.textPlaceholder,
    marginBottom: 4,
  },
  infoFinanceira: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  valorTexto: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  dataTexto: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  mesRefTexto: {
    fontSize: 11,
    color: colors.textPlaceholder,
  },

  switchWrapper: {
    alignItems: 'center',
    marginLeft: 12,
    gap: 4,
  },
  labelSwitch: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textPlaceholder,
    letterSpacing: 0.5,
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
});

export default styles;

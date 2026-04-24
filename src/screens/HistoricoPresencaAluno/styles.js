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
  cardPresenca: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  cardFalta: {
    backgroundColor: colors.errorVeryLight,
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
  dataTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDark,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusTexto: {
    fontSize: 10,
    fontWeight: '900',
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

import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

const styles = StyleSheet.create({
  containerLoading: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: 25,
  },
  header: {
    marginBottom: 30,
    paddingBottom: 30,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  subtitulo: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },

  cardRegras: {
    backgroundColor: colors.backgroundSecondary,
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
  },
  cardRegrasTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 5,
  },
  cardRegrasTexto: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  negrito: {
    fontWeight: '700',
    color: colors.textDark,
  },

  secao: {
    marginBottom: 25,
  },
  campoDataEditavel: {
    backgroundColor: colors.background,
    opacity: 1,
    color: colors.text,
    borderColor: colors.borderMedium,
  },
  botaoCalendario: {
    alignSelf: 'flex-start',
    marginTop: -4,
    marginBottom: 14,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
  },
  botaoCalendarioTexto: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  secaoTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingBottom: 8,
  },

  rowSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingVertical: 10,
  },
  labelSwitch: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
  },
  sublabelSwitch: {
    fontSize: 12,
    color: colors.textPlaceholder,
    marginTop: 2,
  },

  sucessoBox: {
    backgroundColor: colors.successLight,
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.successBorder,
  },
  sucessoTexto: {
    color: colors.success,
    fontWeight: '600',
  },

  botaoSalvar: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  botaoSalvarConteudo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  botaoSalvarDesabilitado: {
    opacity: 0.6,
  },
  botaoSalvarTexto: {
    color: colors.textInverted,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default styles;

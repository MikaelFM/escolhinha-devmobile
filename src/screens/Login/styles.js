import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 36,
    alignItems: 'center',
  },
  title: {
    fontSize: 45,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 40,
    letterSpacing: 0.3,
  },
  form: {
    marginBottom: 28,
  },
  inputField: { 
    marginVertical: -40
  },
  erroContainer: {
    marginTop: -15,
    marginBottom: 4,
    justifyContent: 'end',
  },
  erroBox: {
  },
  erroTexto: {
    color: colors.error,
    fontSize: 13,
    fontWeight: '500',
  },
  primeiroAcessoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 4,
    marginBottom: 24,
    marginTop: 6,
  },
  primeiroAcessoTexto: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderMedium,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalIcone: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primaryDark,
    marginBottom: 4,
  },
  modalSubtitulo: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 18,
  },
  passoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  passoBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  passoBadgeTexto: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textInverted,
  },
  passoTexto: {
    flex: 1,
    fontSize: 14,
    color: colors.textStrong,
    lineHeight: 20,
  },
  passoDestaque: {
    fontWeight: '700',
    color: colors.primary,
  },
  exemploBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primaryLight,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
    marginLeft: 34,
  },
  exemploTexto: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  exemploDestaque: {
    fontWeight: '800',
    color: colors.primaryDark,
  },
  modalBotao: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  modalBotaoTexto: {
    color: colors.textInverted,
    fontSize: 16,
    fontWeight: '700',
  },
  botaoEntrar: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 17,
    alignItems: 'center',
    marginBottom: 20,
  },
  botaoEntrarDesabilitado: {
    opacity: 0.6,
  },
  botaoEntrarTexto: {
    color: colors.textInverted,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dicaContainer: {
    backgroundColor: colors.primaryLight,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  dicaTexto: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  dicaNegrito: {
    fontWeight: '700',
    color: colors.primaryDark,
  },
  botaoBiometria: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    backgroundColor: colors.primaryLight,
  },
  botaoBiometriaTexto: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default styles;



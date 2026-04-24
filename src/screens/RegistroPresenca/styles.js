import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 80,
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  subtitulo: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  filtros: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeEdicao: {
    backgroundColor: colors.amberLight,
  },
  badgeLeitura: {
    backgroundColor: colors.backgroundTertiary,
  },
  badgeTexto: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.amberDark,
  },
  cardAluno: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
  },
  cardPresente: {
    borderColor: colors.successBorder,
    backgroundColor: colors.successLight,
  },
  cardAusente: {
    borderColor: colors.errorBorder,
    backgroundColor: colors.errorLight,
  },
  cardSemRegistro: {
    borderColor: colors.border,
    backgroundColor: colors.backgroundSecondary,
  },
  nomeAluno: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  subtituloAluno: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusLinhaColorida: {
    width: 30,
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  statusVerde: {
    backgroundColor: colors.success,
  },
  statusVermelho: {
    backgroundColor: colors.error,
  },
  statusCinza: {
    backgroundColor: colors.borderStrong,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.success,
  },
  checkboxUnchecked: {
    backgroundColor: colors.error,
  },
  checkText: {
    color: colors.textInverted,
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    padding: 20,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.borderMedium,
  },
  footerAcoes: {
    flexDirection: 'row',
    gap: 12,
  },
  botaoFooter: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  botaoEditarPrincipal: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  botaoSalvar: {
    backgroundColor: colors.primary,
  },
  botaoSalvarDesabilitado: {
    opacity: 0.6,
  },
  botaoSalvarTexto: {
    color: colors.textInverted,
    fontSize: 15,
    fontWeight: '800',
  },
  botaoCancelar: {
    backgroundColor: colors.backgroundTertiary,
  },
  botaoCancelarTexto: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '800',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: colors.textPlaceholder,
  },
});

export default styles;

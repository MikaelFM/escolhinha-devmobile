import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 15,
    paddingVertical: 30,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  navBar: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 15,
    paddingVertical: 50,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  topHeader: {
    marginBottom: 40,
  },
  header: {
    alignItems: 'flex-start',
    marginBottom: 34,
  },
  iconeTexto: {
    fontSize: 28,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.primaryDark,
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '400',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    paddingVertical: 24,
  },
  loadingText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  requisitosCard: {
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.borderMedium,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 12,
  },
  requisitosTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  requisito: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  requisitoTexto: {
    fontSize: 12,
    fontWeight: '500',
  },
  sucessoBox: {
    backgroundColor: colors.successLight,
    borderWidth: 1,
    borderColor: colors.successBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  sucessoTexto: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '600',
  },
  botaoSalvar: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  botaoSalvarConteudo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  botaoSalvarTexto: {
    color: colors.textInverted,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlayLight,
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    maxHeight: '60%',
  },
  modalTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  modalItemAtivo: {
    backgroundColor: colors.primaryBorder,
  },
  modalItemTexto: {
    fontSize: 15,
    color: colors.textStrong,
    fontWeight: '500',
  },
  modalItemTextoAtivo: {
    color: colors.primary,
    fontWeight: '700',
  },
  modalCheck: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '700',
  },
  separador: {
    height: 1,
    backgroundColor: colors.backgroundTertiary,
  },
});

export default styles;

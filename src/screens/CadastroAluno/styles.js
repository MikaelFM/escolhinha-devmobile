import { StyleSheet } from 'react-native';
import { colors } from '../global/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    paddingVertical: 30,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  topHeader: {
    marginBottom: 28,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navBotaoVoltar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    borderWidth: 1.5,
    borderColor: colors.primaryBorder,
  },
  navTextoVoltar: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  iconeBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
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
  sucessoBox: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  sucessoTexto: {
    color: '#16a34a',
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
  botaoSalvarTexto: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#ffffff',
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
    color: '#334155',
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
    backgroundColor: '#f1f5f9',
  },
});

export default styles;



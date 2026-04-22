import { StyleSheet } from 'react-native';
import { colors } from '../../global/colors';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topHeader: { paddingHorizontal: 20, paddingTop: 80, marginBottom: 14 },
  titulo: { fontSize: 32, fontWeight: '800', color: colors.primary, letterSpacing: -0.5 },
  subtitulo: { fontSize: 14, color: colors.textPlaceholder, marginTop: 4 },
  bottomSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 14,
    paddingBottom: 18,
    shadowColor: colors.textPlaceholder,
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -8 },
    elevation: 20,
  },

  perfilCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarTexto: { color: '#fff', fontSize: 22, fontWeight: '800' },
  perfilInfo: { marginLeft: 15, flex: 1 },
  nomeUsuario: { fontSize: 17, fontWeight: '800', color: colors.primaryDark },
  emailUsuario: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  badgeMatricula: { 
    backgroundColor: '#e2e8f0', 
    alignSelf: 'flex-start', 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: 6, 
    marginTop: 8 
  },
  matriculaTexto: { fontSize: 10, fontWeight: '800', color: '#475569' },

  secaoTitulo: { 
    fontSize: 11, 
    fontWeight: '900', 
    color: colors.textPlaceholder, 
    marginLeft: 20, 
    marginTop: 20, 
    marginBottom: 10, 
    letterSpacing: 1 
  },
  grupoCards: { marginHorizontal: 20, backgroundColor: 'transparent' },
  cardOpcao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 15,
    marginBottom: 10,
    shadowColor: colors.textPlaceholder,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  opcaoTitulo: { fontSize: 15, fontWeight: '700', color: colors.primaryDark },
  opcaoTituloDanger: { color: '#dc2626' },
  opcaoSubtitulo: { fontSize: 12, color: colors.textPlaceholder, marginTop: 2 },
  versao: { textAlign: 'center', color: '#cbd5e1', fontSize: 12, marginTop: 16 }
});

export default styles;



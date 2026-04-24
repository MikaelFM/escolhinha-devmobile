import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 100,
    marginBottom: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primaryDark,
    letterSpacing: -0.5,
  },
  subtitulo: {
    fontSize: 14,
    color: colors.textPlaceholder,
    marginTop: 4,
  },

  perfilCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderMedium,
    marginBottom: 20,
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTexto: {
    color: colors.textInverted,
    fontSize: 22,
    fontWeight: '800',
  },
  perfilInfo: {
    marginLeft: 15,
    flex: 1,
  },
  nomeUsuario: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.primary,
  },
  emailUsuario: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badgeMatricula: {
    backgroundColor: colors.borderMedium,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 8,
  },
  matriculaTexto: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.textMuted,
  },

  secaoTitulo: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.textPlaceholder,
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
    letterSpacing: 1,
  },
  grupoCards: {
    marginHorizontal: 20,
    backgroundColor: colors.background,
  },
  cardOpcao: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  opcaoTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  opcaoTituloDanger: {
    color: colors.error,
  },
  opcaoSubtitulo: {
    fontSize: 12,
    color: colors.textPlaceholder,
    marginTop: 2,
  },

  versao: {
    textAlign: 'center',
    color: colors.borderStrong,
    fontSize: 11,
    marginTop: 20,
    marginBottom: 20,
  },
});

export default styles;

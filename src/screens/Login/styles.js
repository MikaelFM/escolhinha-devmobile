import { StyleSheet } from 'react-native';
import { colors } from '../../global/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
  },
  erroTexto: {
    color: colors.error,
    fontSize: 13,
    fontWeight: '500',
  },
  esqueceuContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: 6,
  },
  esqueceuTexto: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '500',
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
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
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



import {
  useEffect,
  useRef,
  useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Ionicons } from '@expo/vector-icons';

import InputField from '../../components/InputField';
import { colors } from '../../constants/colors';
import { useAuth } from '../../contexts/AuthContext';
import { tokenService } from '../../services/tokenService';
import { verificarSuporteBiometria } from '../../utils/biometria';
import ModalPrimeiroAcesso from './ModalPrimeiroAcesso';
import styles from './styles';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [carregandoBiometria, setCarregandoBiometria] = useState(false);
  const [biometriaDisponivel, setBiometriaDisponivel] = useState(false);
  const [modalPrimeiroAcesso, setModalPrimeiroAcesso] = useState(false);
  const tentativaAutomaticaBiometriaRef = useRef(false);

  const { signIn, signInBiometria } = useAuth();

  useEffect(() => {
    const verificarBiometriaDisponivel = async () => {
      try {
        const [suporteBiometria, temBiometriaAtiva, preferenciaBiometria] = await Promise.all([
          verificarSuporteBiometria(),
          tokenService.temBiometriaAtiva(),
          tokenService.obterPreferenciaBiometria(),
        ]);

        setBiometriaDisponivel(suporteBiometria && temBiometriaAtiva && preferenciaBiometria);
      } catch (e) {
        setBiometriaDisponivel(false);
      }
    };

    verificarBiometriaDisponivel();
  }, []);

  useEffect(() => {
    if (biometriaDisponivel && !tentativaAutomaticaBiometriaRef.current) {
      tentativaAutomaticaBiometriaRef.current = true;
      handleEntrarComBiometria();
    }
  }, [biometriaDisponivel]);

  const handleEntrar = async () => {
    if (carregandoBiometria) {
      return;
    }

    setErro('');

    if (!email || !password) {
      setErro('Por favor, preencha o usuário e a senha.');
      return;
    }

    setCarregando(true);

    try {
      const resultado = await signIn(email, password);

      if (!resultado.sucesso) {
        setErro(resultado.mensagem);
      }
    } catch (erro) {
      setErro('Erro ao conectar. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const handleEntrarComBiometria = async () => {
    if (carregando || carregandoBiometria) {
      return;
    }

    setErro('');
    setCarregandoBiometria(true);

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Entrar com biometria',
        fallbackLabel: 'Usar senha',
        cancelLabel: 'Cancelar',
        disableDeviceFallback: false,
      });

      if (!result.success) {
        return;
      }

      const resultado = await signInBiometria();
      if (!resultado.sucesso) {
        setErro(resultado.mensagem);
      }
    } catch (error) {
      setErro('Não foi possível autenticar com biometria.');
    } finally {
      setCarregandoBiometria(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Login</Text>
        </View>

        <View style={styles.form}>
          <InputField
            style={styles.inputField}
            placeholder="Usuário"
            value={email}
            onChangeText={v => { setEmail(v); }}
            erro={false}
            keyboardType="default"
            autoCapitalize="none"
            disabled={carregando || carregandoBiometria}
          />

          <InputField
            style={styles.inputField}
            placeholder="Senha"
            value={password}
            onChangeText={v => { setPassword(v); }}
            erro={false}
            variante="senha"
            disabled={carregando || carregandoBiometria}
          />

          <View style={styles.erroContainer}>
            {erro ? (
              <View style={styles.erroBox}>
                <Text style={styles.erroTexto}>{erro}</Text>
              </View>
            ) : null}
          </View>

          <TouchableOpacity
            style={styles.primeiroAcessoContainer}
            onPress={() => setModalPrimeiroAcesso(true)}
            disabled={carregando || carregandoBiometria}
          >
            <Ionicons name="help-circle-outline" size={15} color={colors.primary} />
            <Text style={styles.primeiroAcessoTexto}>Primeiro acesso?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.botaoEntrar,
              (carregando || carregandoBiometria) && styles.botaoEntrarDesabilitado,
            ]}
            activeOpacity={0.85}
            onPress={handleEntrar}
            disabled={carregando || carregandoBiometria}
          >
            {(carregando || carregandoBiometria) ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ActivityIndicator color={colors.textInverted} size="small" />
                <Text style={styles.botaoEntrarTexto}>
                  {carregandoBiometria ? 'Entrando com biometria...' : 'Entrando...'}
                </Text>
              </View>
            ) : (
              <Text style={styles.botaoEntrarTexto}>Entrar</Text>
            )}
          </TouchableOpacity>

          {biometriaDisponivel && (
            <TouchableOpacity
              style={[
                styles.botaoBiometria,
                (carregando || carregandoBiometria) && styles.botaoEntrarDesabilitado,
              ]}
              activeOpacity={0.85}
              onPress={handleEntrarComBiometria}
              disabled={carregando || carregandoBiometria}
            >
              {carregandoBiometria ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <ActivityIndicator color={colors.primary} size="small" />
                  <Text style={styles.botaoBiometriaTexto}>Autenticando...</Text>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="finger-print-outline" size={18} color={colors.primaryDark} />
                  <Text style={styles.botaoBiometriaTexto}>Entrar com Biometria</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ModalPrimeiroAcesso
        visible={modalPrimeiroAcesso}
        onClose={() => setModalPrimeiroAcesso(false)}
      />
    </SafeAreaView>
  );
}

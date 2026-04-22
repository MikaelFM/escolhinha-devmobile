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
  Alert
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

import InputField from '../../components/InputField';
import { colors } from '../../global/colors';
import { useAuth } from '../../context/AuthContext';
import { tokenService } from '../../services/tokenService';
import styles from './styles';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [carregandoBiometria, setCarregandoBiometria] = useState(false);
  const [biometriaDisponivel, setBiometriaDisponivel] = useState(false);
  const tentativaAutomaticaBiometriaRef = useRef(false);
  
  const { signIn, signInBiometria } = useAuth();

  useEffect(() => {
    const verificarBiometriaDisponivel = async () => {
      try {
        const [hasHardware, isEnrolled, temBiometriaAtiva, preferenciaBiometria] = await Promise.all([
          LocalAuthentication.hasHardwareAsync(),
          LocalAuthentication.isEnrolledAsync(),
          tokenService.temBiometriaAtiva(),
          tokenService.obterPreferenciaBiometria(),
        ]);

        setBiometriaDisponivel(hasHardware && isEnrolled && temBiometriaAtiva && preferenciaBiometria);
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
    setErro('');
    
    if (!email || !password) {
      setErro('Por favor, preencha o e-mail e a senha.');
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
      console.log('Erro no login:', erro);
    } finally {
      setCarregando(false);
    }
  };

  const handleEsqueceuSenha = () => {
    Alert.alert(
      'Recuperar Senha',
      'Funcionalidade em desenvolvimento'
    );
  };

  const handleEntrarComBiometria = async () => {
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
      setErro('NÃ£o foi possÃ­vel autenticar com biometria.');
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
              placeholder="E-mail"
              value={email}
              onChangeText={v => { setEmail(v); }}
              erro={false}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!carregando}
            />

            <InputField
              style={styles.inputField}
              placeholder="Senha"
              value={password}
              onChangeText={v => { setPassword(v); }}
              erro={false}
              variante="senha"
              editable={!carregando}
            />

            <View style={styles.erroContainer}>
              {erro ? (
                <View style={styles.erroBox}>
                  <Text style={styles.erroTexto}>{erro}</Text>
                </View>
              ) : null}
            </View>

            <TouchableOpacity 
              style={styles.esqueceuContainer}
              onPress={handleEsqueceuSenha}
              disabled={carregando}
            >
              <Text style={styles.esqueceuTexto}>Esqueceu sua senha?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.botaoEntrar,
                carregando && styles.botaoEntrarDesabilitado
              ]}
              activeOpacity={0.85}
              onPress={handleEntrar}
              disabled={carregando}
            >
              {carregando ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.botaoEntrarTexto}>Entrar</Text>
              )}
            </TouchableOpacity>

          </View>
        </View>
    </SafeAreaView>
  );
}


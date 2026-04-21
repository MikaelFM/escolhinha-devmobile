import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';

import InputField from '../../components/InputField';
import { colors } from '../../global/colors';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  
  const { signIn } = useAuth();

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
});
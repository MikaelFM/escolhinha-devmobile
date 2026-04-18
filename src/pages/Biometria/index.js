import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  SafeAreaView 
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

const BiometricScreen = () => {
  const [isCompatible, setIsCompatible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsCompatible(compatible);
    })();
  }, []);

  async function onAuthenticate() {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        return Alert.alert("Erro", "Seu dispositivo não suporta biometria.");
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        return Alert.alert("Configuração", "Nenhuma biometria encontrada. Por favor, cadastre uma nas configurações do celular.");
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Login com Biometria',
        fallbackLabel: 'Usar Senha',
        cancelLabel: 'Cancelar',
        disableDeviceFallback: false,
      });

      if (result.success) {
        setIsAuthenticated(true);
        Alert.alert("Sucesso", "Bem-vindo de volta!");
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro inesperado.");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Segurança Biométrica</Text>
        
        <View style={[styles.statusBadge, { backgroundColor: isCompatible ? '#d4edda' : '#f8d7da' }]}>
          <Text style={{ color: isCompatible ? '#155724' : '#721c24' }}>
            {isCompatible ? "Dispositivo Compatível" : "Hardware Incompatível"}
          </Text>
        </View>

        <Text style={styles.description}>
          {isAuthenticated 
            ? "Você está autenticado no sistema!" 
            : "Clique no botão abaixo para acessar sua conta de forma segura."}
        </Text>

        <TouchableOpacity 
          style={[styles.button, isAuthenticated && styles.buttonSuccess]} 
          onPress={onAuthenticate}
        >
          <Text style={styles.buttonText}>
            {isAuthenticated ? "Autenticado ✓" : "Entrar com Biometria"}
          </Text>
        </TouchableOpacity>

        {isAuthenticated && (
          <TouchableOpacity onPress={() => setIsAuthenticated(false)} style={{ marginTop: 20 }}>
            <Text style={{ color: '#007AFF' }}>Sair / Bloquear</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 30,
  },
  description: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonSuccess: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BiometricScreen;
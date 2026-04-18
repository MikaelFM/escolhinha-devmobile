import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const SendPushNotification = () => {
  const [loading, setLoading] = useState(false);
  const [tokenExpo, setToken] = useState(null);

  useEffect(() => {
    registerForPushNotifications();
  }, []);

  const registerForPushNotifications = async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert('Erro', 'Permissão para notificações negada!');
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token)
      setToken(token);
    } catch (error) {
      console.log("Erro ao obter token:", error);
    }
  };

  const sendNotification = async () => {
    console.log('oi')

    if (!tokenExpo) {
      Alert.alert("Erro", "Token ainda não disponível.");
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Accept-encoding': 'gzip, deflate',
        },
        body: JSON.stringify({
          to: tokenExpo,
          title: 'Olá!',
          body: 'Notificação enviada com sucesso.',
          sound: 'default',
        }),
      });

      const data = await response.json();
      console.log('Sucesso:', data);
      Alert.alert('Sucesso', 'Notificação enviada!');
    } catch (error) {
      console.log('Erro ao enviar:', error);
      Alert.alert('Erro', 'Falha ao enviar notificação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.tokenLabel}>Seu Token Expo:</Text>
      <Text style={styles.tokenValue}>{tokenExpo || "Carregando..."}</Text>

      <TouchableOpacity 
        style={[styles.button, !tokenExpo && styles.disabledButton]} 
        disabled={loading || !tokenExpo}
        onPress={sendNotification}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Me enviar uma notificação</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  tokenLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  tokenValue: {
    fontSize: 12,
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4630EB',
    padding: 18,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SendPushNotification;
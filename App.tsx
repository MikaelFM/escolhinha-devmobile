import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Routes from './src/routes';
import RoutesAluno from './src/routes_aluno';
import Login from './src/pages/Login';
import { AuthProvider, useAuth } from './src/context/AuthContext';

const Stack = createStackNavigator();

function RootNavigation() {
  const { isLoading, userToken, userData } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2B9D48" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!userToken ? (
        <Stack.Screen name="login" component={Login} />
      ) : userData.role === 'ADMIN' ? (
        <Stack.Screen name="appProfessor" component={Routes} />
      ) : (
        <Stack.Screen name="appAluno" component={RoutesAluno} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <RootNavigation />
      </AuthProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
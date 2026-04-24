import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Routes from './src/navigation/routes';
import Login from './src/screens/Login';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { colors } from './src/constants/colors';

const Stack = createStackNavigator();

function RootNavigation() {
  const { isLoading, userToken, userData } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator id="root-stack" screenOptions={{ headerShown: false }}>
      {!userToken ? (
        <Stack.Screen name="login" component={Login} />
      ) : (
        <Stack.Screen name="mainApp">
          {(props) => <Routes {...props} userRole={userData?.role} />}
        </Stack.Screen>
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
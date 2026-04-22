import { createStackNavigator } from '@react-navigation/stack';

import HomeAluno from '../screens/HomeAluno';
import AlteracaoSenha from '../screens/AlteracaoSenha';

const Stack = createStackNavigator();

export default function RoutesAluno() {
  return (
    <Stack.Navigator screenOptions={{ animation: 'none' }}>
      <Stack.Screen 
        name="homeAluno" 
        component={HomeAluno}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="alteracaoSenha" 
        component={AlteracaoSenha}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
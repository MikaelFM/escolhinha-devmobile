import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import HomeProfessor from '../screens/HomeProfessor';
import HomeAluno from '../screens/HomeAluno';
import FichaAluno from '../screens/FichaAluno';
import RegistroPresenca from '../screens/RegistroPresenca';
import ListAlunos from '../screens/ListAlunos';
import HistoricoMensalidades from '../screens/HistoricoMensalidades';
import CadastroAluno from '../screens/CadastroAluno';
import AlteracaoSenha from '../screens/AlteracaoSenha';
import Configuracoes from '../screens/Configuracoes';
import { colors } from '../constants/colors';

const Stack = createStackNavigator();

const BackButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 10 }}>
      <Ionicons name="chevron-back" size={28} color={colors.primary} />
    </TouchableOpacity>
  );
};

const headerComVoltar = {
  headerShown: true,
  headerTintColor: colors.primary,
  headerLeft: () => <BackButton />,
};

export default function Routes({ userRole }) {
  return (
    <Stack.Navigator 
      screenOptions={{
        animation: 'none',
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.borderMedium,
        }
      }}
    >
      {userRole === 'ADMIN' ? (
        <>
          <Stack.Screen name="home" component={HomeProfessor} options={{ headerShown: false }} />
          <Stack.Screen name="fichaAluno" component={FichaAluno} options={{ ...headerComVoltar, headerTitle: 'Ficha do Aluno' }} />
          <Stack.Screen name="registroPresenca" component={RegistroPresenca} options={{ headerShown: false }} />
          <Stack.Screen name="listAlunos" component={ListAlunos} options={{ headerShown: false }} />
          <Stack.Screen name="historicoMensalidades" component={HistoricoMensalidades} options={{ ...headerComVoltar, headerTitle: 'Mensalidades' }} />
          <Stack.Screen name="cadastroAluno" component={CadastroAluno} options={{ ...headerComVoltar, headerTitle: '' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="homeAluno" component={HomeAluno} options={{ headerShown: false }} />
        </>
      )}

      <Stack.Screen name="alteracaoSenha" component={AlteracaoSenha} options={{ ...headerComVoltar, headerTitle: '' }} />
      <Stack.Screen name="configuracoes" component={Configuracoes} options={{ ...headerComVoltar, headerTitle: '' }} />
    </Stack.Navigator>
  );
}
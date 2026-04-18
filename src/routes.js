import { createStackNavigator } from '@react-navigation/stack';

import Home from './pages/Home';
import FichaAluno from './pages/FichaAluno';
import RegistroPresenca from './pages/RegistroPresenca';
import ListAlunos from './pages/ListAlunos';
import HistoricoMensalidades from './pages/HistoricoMensalidades';
import CadastroAluno from './pages/CadastroAluno';
import AlteracaoSenha from './pages/AlteracaoSenha';

const Stack = createStackNavigator();

const headerComVoltar = {
  headerShown: true,
  headerBackTitleVisible: false,
  headerTintColor: '#1d4ed8',
};

export default function Routes () {
  return (
    <Stack.Navigator screenOptions={{ animation: 'none' }}>
      <Stack.Screen 
        name="home" 
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="fichaAluno" 
        component={FichaAluno}
        options={{ ...headerComVoltar, headerTitle: 'Ficha do Aluno' }}
      />
      <Stack.Screen 
        name="registroPresenca" 
        component={RegistroPresenca}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="listAlunos" 
        component={ListAlunos}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="historicoMensalidades" 
        component={HistoricoMensalidades}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="cadastroAluno" 
        component={CadastroAluno}
        options={{ ...headerComVoltar, headerTitle: 'Cadastro de Aluno' }}
      />
      <Stack.Screen 
        name="alteracaoSenha" 
        component={AlteracaoSenha}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
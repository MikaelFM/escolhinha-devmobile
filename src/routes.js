import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import Home from './pages/Home';
import FichaAluno from './pages/FichaAluno';
import RegistroPresenca from './pages/RegistroPresenca';
import ListAlunos from './pages/ListAlunos';
import HistoricoMensalidades from './pages/HistoricoMensalidades';
import CadastroAluno from './pages/CadastroAluno';
import AlteracaoSenha from './pages/AlteracaoSenha';
import Configuracoes from './pages/Configuracoes';
import { colors } from './global/colors';

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

export default function Routes () {
  return (
    <Stack.Navigator screenOptions={{
      animation: 'none',
      headerStyle: {
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
      }
    }}>
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
        options={{ ...headerComVoltar, headerTitle: 'Mensalidades' }}
      />
      <Stack.Screen
        name="cadastroAluno"
        component={CadastroAluno}
        options={{ ...headerComVoltar, headerTitle: '' }}
      />
      <Stack.Screen
        name="alteracaoSenha"
        component={AlteracaoSenha}
        options={{  ...headerComVoltar, headerTitle: '', }}
      />
      <Stack.Screen
        name="configuracoes"
        component={Configuracoes}
        options={{  ...headerComVoltar, headerTitle: '', }}
      />
    </Stack.Navigator>
  );
}
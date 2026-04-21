import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { colors } from '../../global/colors';

import DashboardAluno from '../DashboardAluno';
import HistoricoPresencasGeral from '../HistoricoPresencaAluno';
import HistoricoPagamentosAluno from '../HistoricoPagamentosAluno';
import ConfiguracoesAluno from '../ConfiguracoesAluno';

import { Ionicons } from '@expo/vector-icons'
import { Feather } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function HomeAluno() {
    return(
        <Tab.Navigator
            id="main-tabs"  
            screenOptions={{
                tabBarShowLabel: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: '#94a3b8',
                tabBarStyle: {
                    position: 'absolute',
                    borderTopWidth: 0,
                    elevation: 0,
                    backgroundColor: '#ffffff',
                    paddingTop: 8,
                    paddingBottom: 10,
                }
            }}
        >
            <Tab.Screen
                name='dashboardAluno'
                component={DashboardAluno}
                options={{
                    headerShown: false,
                    tabBarIcon: ({color, size, focused}) => {
                        return <Feather name="home" size={size} color={color}></Feather>
                    }
                }}
            />
            <Tab.Screen
                name='historicoPresencasGeral'
                component={HistoricoPresencasGeral}
                options={{
                    headerShown: false,
                    tabBarIcon: ({color, size, focused}) => {
                        return <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={size} color={color}></Ionicons>
                    }
                }}
            />
            <Tab.Screen
                name='historicoPagamentosAluno'
                component={HistoricoPagamentosAluno}
                options={{
                    headerShown: false,
                    tabBarIcon: ({color, size, focused}) => {
                        return <Ionicons name={focused ? 'card' : 'card-outline'} size={size} color={color}></Ionicons>
                    }
                }}
            />
            <Tab.Screen
                name='configuracoesAluno'
                component={ConfiguracoesAluno}
                options={{
                    headerShown: false,
                    tabBarIcon: ({color, size, focused}) => {
                        return <Ionicons name={focused ? 'settings' : 'settings-outline'} size={size} color={color}></Ionicons>
                    }
                }}
            />
        </Tab.Navigator>
    )
}


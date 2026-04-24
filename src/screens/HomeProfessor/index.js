import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { colors } from '../../constants/colors';

import DashboardProfessor from '../DashboardProfessor';
import ListaAlunos from '../ListAlunos';
import RegistroPresenca from '../RegistroPresenca';
import AjustesProfessor from '../AjustesProfessor';

import { Ionicons } from '@expo/vector-icons'
import { Feather } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function HomeProfessor() {
    return(
        <Tab.Navigator
            id="main-tabs"  
            screenOptions={{
                tabBarShowLabel: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textPlaceholder,
                tabBarStyle: {
                    position: 'absolute',
                    borderTopWidth: 0,
                    elevation: 0,
                    backgroundColor: colors.background,
                    paddingTop: 8,
                    paddingBottom: 10,
                }
            }}
        >
            <Tab.Screen
                name='dashboard'
                component={DashboardProfessor}
                options={{
                    headerShown: false,
                    tabBarIcon: ({color, size, focused}) => {
                        return <Feather name="home" size={size} color={color}></Feather>
                    }
                }}
            />
            <Tab.Screen
                name='registroPresenca'
                component={RegistroPresenca}
                options={{
                    headerShown: false,
                    tabBarIcon: ({color, size, focused}) => {
                        return <Feather name="user-check" size={size} color={color}></Feather>
                    }
                }}
            />
            <Tab.Screen
                name='search'
                component={ListaAlunos}
                options={{
                    headerShown: false,
                    tabBarIcon: ({color, size, focused}) => {
                        return <Ionicons name={focused ? 'people' : 'people-outline'} size={size} color={color}></Ionicons>
                    }
                }}
            />
            <Tab.Screen
                name='profile'
                component={AjustesProfessor}
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



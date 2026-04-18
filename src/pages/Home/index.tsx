import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import Dashboard from '../Dashboard';
import ListaAlunos from '../ListAlunos';
import RegistroPresenca from '../RegistroPresenca';
import ConfiguracoesProfessor from '../ConfiguracoesProfessor';

import { Ionicons } from '@expo/vector-icons'

const Tab = createBottomTabNavigator();

export default function Home() {
    return(
        <Tab.Navigator
            id="main-tabs"  
            screenOptions={{
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#1d4ed8',
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
                name='Dashboard'
                component={Dashboard}
                options={{
                    headerShown: false,
                    tabBarIcon: ({color, size, focused}) => {
                        return <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color}></Ionicons>
                    }
                }}
            />
            <Tab.Screen
                name='registroPresenca'
                component={RegistroPresenca}
                options={{
                    headerShown: false,
                    tabBarIcon: ({color, size, focused}) => {
                        return <Ionicons name={focused ? 'checkbox' : 'checkbox-outline'} size={size} color={color}></Ionicons>
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
                component={ConfiguracoesProfessor}
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


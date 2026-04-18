import { createStackNavigator } from '@react-navigation/stack';

import Home

const Stack = createStackNavigator();

export default function Dashboard() {
  return (
    <Stack.Navigator screenOptions={{ animation: 'none' }}>
      <Stack.Screen 
        name="Home" 
        component={SearchResult}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="QuadraDetails" 
        component={QuadraDetails} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ScheduleScreen" 
        component={ScheduleScreen} 
        options={{ title: 'Reserva' }} 
      />
    </Stack.Navigator>
  );
}
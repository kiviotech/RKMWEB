import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Yourrequest from '../components/Request/Yourrequest';

import RescheduleRequest from './Request/RescheduleRequest/ResheduleRequest';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="yourrequest">
        <Stack.Screen name="Yourrequest" component={Yourrequest} />
        <Stack.Screen name="RescheduleRequest" component={RescheduleRequest} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

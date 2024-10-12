// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
// import Request from './pages/request';
// import RescheduleRequest from './components/Request/RescheduleRequest/ResheduleRequest';
// import Dashboard from './components/Dashboard/Dashboard';
// import RequestStatus from './components/requeststatus/requeststatus';
// import { SafeAreaProvider } from 'react-native-safe-area-context';

// export default function App() {
//   return (
//     <SafeAreaProvider>
//       <View style={styles.container}>
//      <Request/>
//      {/* <RescheduleRequest/> */}
//      {/* <Dashboard/> */}
//      {/* <RequestStatus/> */}
//       <StatusBar style="auto" />
//     </View>
//     </SafeAreaProvider>
    
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });



import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUp from './app/SignUp';
import SignIn from './app/SignIn';
import Dashboard from "./components/Dashboard/Dashboard";
import Request from './pages/request';
import ApplicationForm from './pages/ApplicationForm';
import RescheduleRequest from './components/Request/Reschedule/ResheduleRequest';






const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Signup">
        <Stack.Screen name="Signup" component={SignUp} options={{ headerShown: false }} />
        <Stack.Screen name="Signin" component={SignIn}  options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={Dashboard}  options={{ headerShown: false }} />
        <Stack.Screen name="Request" component={Request}  options={{ headerShown: false }} />
        <Stack.Screen name="ApplicationForm" component={ApplicationForm}  options={{ headerShown: false }} />
        <Stack.Screen name="RescheduleRequest" component={RescheduleRequest}  options={{ headerShown: false }} />
       </Stack.Navigator>
</NavigationContainer>
  );
}





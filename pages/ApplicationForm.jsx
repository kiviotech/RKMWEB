import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MultiStepForm from '../components/ApplicationForm/MultiStepForm'; // Import the MultiStepForm component
import NewApplicationForm from '../components/ApplicationForm/NewApplicationForm';
import NewApplicationFormP2 from '../components/ApplicationForm/NewApplicationFormP2';
import NewApplicationFormP3 from '../components/ApplicationForm/NewApplicationFormP3';
import NewApplicationFormP4 from '../components/ApplicationForm/NewApplicationFormP4';
import ApplicationFormPages from '../components/ApplicationForm/ApplicationFormPages';
import Icon from 'react-native-vector-icons/Ionicons';

const ApplicationForm = ({navigation}) => {
    const backDashboard=()=>{
        navigation.navigate('Dashboard')
      }
    return (
        <SafeAreaProvider>
            <TouchableOpacity style={styles.backArrow} onPress={backDashboard} >
                <Icon name="arrow-back-outline" size={24} color="#9B5DE5" />
            </TouchableOpacity>
            <View style={styles.container}>
                {/* <MultiStepForm /> */}
                {/* <NewApplicationForm />
                <NewApplicationFormP2 />
                <NewApplicationFormP3 /> */}
                <NewApplicationFormP4 />
                {/* <ApplicationFormPages /> */}
                {/* Use the MultiStepForm component here */}
                
            </View>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1, // Ensure the container takes full height
        // padding: 20, // Optional: Add padding for better layout
    },
    backArrow: {
    position: 'absolute',
    top: 50, // Adjust this to move the arrow down further
    left: 15,
    zIndex: 1, // Ensures the back arrow is above other elements
  },
});

export default ApplicationForm;

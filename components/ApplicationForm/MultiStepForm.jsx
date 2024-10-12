import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack'; // This should work after installation
import NewApplicationForm from './NewApplicationForm';
import NewApplicationFormP2 from './NewApplicationFormP2';
import NewApplicationFormP3 from './NewApplicationFormP3';
import NewApplicationFormP4 from './NewApplicationFormP4';

const Stack = createStackNavigator();

const MultiStepForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    aadhar: '',
    occupation: '',
    guestMembers: '',
    arrivalDate: '',
    departureDate: '',
    previouslyVisited: '',
    previouslyVisitedDate: '',
    reasonForRevisit: '',
    recommendationLetter: ''
  });

  // Function to update form data
  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Stack.Navigator>
      <Stack.Screen name="NewApplicationForm">
        {(props) => <NewApplicationForm {...props} formData={formData} updateFormData={updateFormData} />}
      </Stack.Screen>
      <Stack.Screen name="NewApplicationFormP2">
        {(props) => <NewApplicationFormP2 {...props} formData={formData} updateFormData={updateFormData} />}
      </Stack.Screen>
      <Stack.Screen name="NewApplicationFormP3">
        {(props) => <NewApplicationFormP3 {...props} formData={formData} updateFormData={updateFormData} />}
      </Stack.Screen>
      <Stack.Screen name="NewApplicationFormP4">
        {(props) => <NewApplicationFormP4 {...props} formData={formData} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default MultiStepForm;

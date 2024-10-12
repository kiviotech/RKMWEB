

import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Animated } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import StepIndicator from '../StepIndicator/StepIndicator';
import {router} from 'expo-router'

// NewApplicationForm component
const NewApplicationForm = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [aadhar, setAadhar] = useState('');
    const [occupation, setOccupation] = useState('');
    const [guestMembers, setGuestMembers] = useState('');

    const [filledFields, setFilledFields] = useState(0); // Track filled fields
    const totalFields = 8; // Updated total number of fields on this page
    const progress = useRef(new Animated.Value(0)).current; // Progress animation

    // Function to track and update filled fields count
    const handleInputChange = (setter, value, prevValue) => {
        setter(value);
        // Only update the filled fields count if the field was previously empty and now has a value
        if (!prevValue && value) {
            setFilledFields((prev) => prev + 1);
        } else if (prevValue && !value) {
            setFilledFields((prev) => prev - 1);
        }
    };

    const handleProceed = () => {
        if (name && age && gender && email && phone && address && aadhar && occupation && guestMembers) {
            // Move to the next step (Page 2)
            Animated.timing(progress, {
                toValue: 25, // Update progress to 25% for the next step
                duration: 500,
                useNativeDriver: false,
            }).start();
          
            //navigation.navigate('/NewApplicationFormP2'); // Navigate to the next page of the form
        } else {
            alert('Please fill in all the fields before proceeding.');
        }

        router.push({
            pathName: "/NewApplicationFormP2"
        })
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.container}>

                        <StepIndicator step={1} progress={progress} filledFields={filledFields} totalFields={totalFields}/>

                        {/* Applicant Details */}
                        <Text style={styles.header}>Applicant Details</Text>

                         {/* Input fields with labels */}
                         <View style={styles.inputGroup}>
                            <Text style={styles.label}>Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="John Doe"
                                placeholderTextColor="#515151"
                                value={name}
                                onChangeText={(value) => handleInputChange(setName, value, name)}
                            />
                        </View>

                         {/* Age and Gender */}
                         <View style={styles.inputGroup}>
                            <View style={styles.row}>
                                <View style={styles.inputGroupHalf}>
                                    <Text style={styles.label}>Age</Text>
                                    <View style={styles.agePicker}>
                                        <Picker
                                            selectedValue={age}
                                            style={styles.picker}
                                            onValueChange={(itemValue) => handleInputChange(setAge, itemValue, age)}
                                        >
                                            <Picker.Item label="Age" value="" />

                                            {[...Array(101).keys()].map((value) => (
                                                <Picker.Item key={value} label={`${value}`} value={value} />
                                            ))}
                                        </Picker>
                                    </View>
                                </View>

                                <View style={styles.inputGroupHalf}>
                                    <Text style={styles.label}>Gender</Text>
                                    <View style={styles.genderPicker}>
                                        <Picker
                                            selectedValue={gender}
                                            style={styles.picker}
                                            onValueChange={(itemValue) => handleInputChange(setGender, itemValue, gender)}
                                        >

<Picker.Item label="Gender" value="" />
                                            <Picker.Item label="Male" value="male" />
                                            <Picker.Item label="Female" value="female" />
                                        </Picker>
                                    </View>
                                </View>
                            </View>
                        </View>

                         {/* Email Input */}
                         <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email id</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Email id"
                                placeholderTextColor="#515151"
                                keyboardType="email-address"
                                value={email}
                                onChangeText={(value) => handleInputChange(setEmail, value, email)}
                            />
                        </View>

                         {/* No. of guest members Input */}
                         <View style={styles.inputGroup}>
                            <Text style={styles.label}>No. of guest members</Text>
                            <View style={styles.guestmember}>
                                <Picker
                                    selectedValue={guestMembers}
                                    style={styles.picker}
                                    onValueChange={(itemValue) => handleInputChange(setGuestMembers, itemValue, guestMembers)}
                                >
                                    <Picker.Item label="Select members" value="" />

                                    {[...Array(15).keys()].map((value) => (
                                        <Picker.Item key={value+1} label={`${value+1}`} value={value+1} />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                              {/* Occupation Input */}
                              <View style={styles.inputGroup}>
                            <Text style={styles.label}>Occupation</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Occupation"
                                placeholderTextColor="#515151"
                                value={occupation}
                                onChangeText={(value) => handleInputChange(setOccupation, value, occupation)}
                            /> 
                        </View>

                           {/* Aadhar number Input with Verify button inside */}
                           <View style={styles.inputGroup}>
                            <Text style={styles.label}>Aadhar number</Text>
                            <View style={styles.aadharContainer}>
                                <TextInput
                                    style={[styles.input, styles.inputWithVerify]}
                                    placeholder="**** **** **** ****"
                                    placeholderTextColor="#515151"
                                    value={aadhar}
                                    onChangeText={(value) => handleInputChange(setAadhar, value, aadhar)}
                                />

</View>
                            <TouchableOpacity style={styles.verifyButton}>
                                    <Text style={styles.verifyText}>Verify Aadhar</Text>
                                </TouchableOpacity>
                        </View>

                         {/* Address Input */}
                         <View style={styles.inputGroup}>
                            <Text style={styles.label}>Address</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Your Address"
                                placeholderTextColor="#515151"
                                value={address}
                                onChangeText={(value) => handleInputChange(setAddress, value, address)}
                            />
                        </View>

                          {/* Phone Number Input */}
                          <View style={styles.inputGroup}>
                            <Text style={styles.label}>Phone number</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Phone number"
                                placeholderTextColor="#515151"
                                value={phone}
                                onChangeText={(value) => handleInputChange(setPhone, value, phone)}
                            />
                        </View>

                          {/* Proceed Button */}
                          <TouchableOpacity style={styles.button} onPress={handleProceed}>
                            <Text style={styles.buttonText}>Proceed</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};


// Define styles at the top
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        // width: '100%',
        width: '414',
        padding: 20
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 4,
        color: '#515151',
    },
    input: {
        width: 351,
        height: 48,
        borderWidth: 1,
        // borderColor: '#C0C0C0',
        borderColor: '#B6C2D3',
        borderRadius: 4,
        paddingLeft: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width:351,
    },
    inputGroupHalf: {
        width: 155,
        height: 74,
        marginBottom: 20,
    },
    agePicker: {
        height: 48,
        borderWidth: 1,
        // borderColor: '#C0C0C0',
        width: 155,
        borderColor: '#B6C2D3',
        borderRadius: 4,
        // paddingLeft: 10,
    },
    guestmember: {
        height: 48,
        borderWidth: 1,
        // borderColor: '#C0C0C0',
        width: 351,
        borderColor: '#B6C2D3',
        borderRadius: 4,
        color: "#515151"
        // paddingLeft: 10,
    },
    genderPicker: {
        height: 48,
        borderWidth: 1,
        borderColor: '#C0C0C0',
        borderRadius: 4,
        // paddingLeft: 10,
    },
    picker: {
        flex: 1,
        height: 48,
        borderWidth: 1,
        // borderColor: '#C0C0C0',
        borderColor: '#B6C2D3',
        borderRadius: 4,
        paddingLeft: 10,
        color:"#515151"
    },
    aadharContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    inputWithVerify: {
        flex: 1,
    },
    verifyButton: {
        marginLeft: 10,
    },
    verifyText: {
        color: '#9867E9',
    },
    button: {
        alignSelf:'flex-end',
        backgroundColor: '#9867E9',
        height: 48,
        width: 127,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    buttonText: {
        color: '#FFFFFF',
        
        fontSize: 16,
    },
});

export default NewApplicationForm;
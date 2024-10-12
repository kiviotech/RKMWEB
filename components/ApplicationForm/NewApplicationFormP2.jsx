

import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, TextInput, TouchableOpacity, Animated } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import StepIndicator from '../StepIndicator/StepIndicator';

const NewApplicationFormP2 = () => {
    const [activeGuest, setActiveGuest] = useState(1); // Track active guest button (1, 2, or 3)
    const [name, setName] = useState('');
    const [aadhar, setAadhar] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [countryCode, setCountryCode] = useState('+91'); // Default country code for phone number

    const [filledFields, setFilledFields] = useState(0);
    const totalFields = 5; // Total number of fields for this page
    const progress = useRef(new Animated.Value(25)).current; // Start progress from 25%

    const handleInputChange = (setter, value, prevValue) => {
        setter(value);
        if (!prevValue && value) {
            setFilledFields((prev) => prev + 1);
        } else if (prevValue && !value) {
            setFilledFields((prev) => prev - 1);
        }
    };

    const handleGuestChange = (guestNumber) => {
        setActiveGuest(guestNumber);
        // Reset all input fields when switching guests
        setName('');
        setAadhar('');
        setPhone('');
        setEmail('');
        setAddress('');
    };

    const handleProceed = () => {
        if (name && aadhar && phone && email && address) {
            Animated.timing(progress, {
                toValue: 50, // Update progress to 50% for the next step
                duration: 500,
                useNativeDriver: false,
            }).start();
            // Proceed to next step or action here
        } else {
            alert('Please fill in all the fields before proceeding.');
        }
    };

    const handleBack = () => {
        navigation.navigate('NewApplicationForm'); // Navigate to previous form
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>
                {/* Step Indicator */}
                <StepIndicator step={2} progress={progress} filledFields={filledFields} totalFields={totalFields} />

                {/* Heading */}
                <Text style={styles.heading}>Guest Details</Text>
                 {/* Guest Button Section */}
                 <View style={styles.guestButtonContainer}>
                    <TouchableOpacity
                        style={[styles.guestButton, activeGuest === 1 && styles.activeGuestButton]}
                        onPress={() => handleGuestChange(1)}
                    >
                        <Text style={[styles.guestButtonText, activeGuest === 1 && styles.activeGuestButtonText]}>Guest 1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.guestButton, activeGuest === 2 && styles.activeGuestButton]}
                        onPress={() => handleGuestChange(2)}
                    >
                     <Text style={[styles.guestButtonText, activeGuest === 2 && styles.activeGuestButtonText]}>Guest 2</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.guestButton, activeGuest === 3 && styles.activeGuestButton]}
                        onPress={() => handleGuestChange(3)}
                    >
                        <Text style={[styles.guestButtonText, activeGuest === 3 && styles.activeGuestButtonText]}>Guest 3</Text>
                    </TouchableOpacity>
                </View>

                 {/* Input Fields */}
                 <View style={styles.inputGroup}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        placeholderTextColor="#515151"
                        value={name}
                        onChangeText={(value) => handleInputChange(setName, value, name)}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Aadhar number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="**** **** **** ****"
                        placeholderTextColor="#515151"
                        value={aadhar}
                        onChangeText={(value) => handleInputChange(setAadhar, value, aadhar)}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Phone number</Text>
                    <View style={styles.phoneInputContainer}>
                        <View style={styles.countryCodePicker}>
                            <Picker
                                selectedValue={countryCode}
                                style={styles.picker}
                                onValueChange={(itemValue) => setCountryCode(itemValue)}
                            >
                                <Picker.Item label="+91" value="+91" />
                                <Picker.Item label="+1" value="+1" />
                                <Picker.Item label="+44" value="+44" />
                                {/* Add more country codes if needed */}
                            </Picker>
                            </View>
                        <View style={styles.separator} />
                        <TextInput
                            style={[styles.input, styles.phoneInput]}
                            placeholder="Phone number"
                            placeholderTextColor="#515151"
                            value={phone}
                            onChangeText={(value) => handleInputChange(setPhone, value, phone)}
                        />
                    </View>
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email id</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email id"
                        placeholderTextColor="#515151"
                        value={email}
                        onChangeText={(value) => handleInputChange(setEmail, value, email)}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Address"
                        placeholderTextColor="#515151"
                        value={address}
                        onChangeText={(value) => handleInputChange(setAddress, value, address)}
                    />
                     </View>
                <View style={styles.buttonContainer}>
                {/* Proceed Button */}
                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.proceedButton} onPress={handleProceed}>
                        <Text style={styles.proceedButtonText}>Proceed</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 28,
        width: 134,
    },
    guestButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 352,
        marginBottom: 28,
        padding: 4,
        backgroundColor: "#rgba(182, 194, 211, 0.32)",
        borderRadius: 4,
    },
    guestButton: {
        width: 86,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    activeGuestButton: {
        backgroundColor: '#9867E9',
    },
    guestButtonText: {
        color: '#515151',
    },
    activeGuestButtonText: {
        color: '#FFFFFF',
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
        borderColor: '#B6C2D3',
        borderRadius: 4,
        paddingLeft: 10,
    },
    phoneInputContainer: {
        width: 351,
        height: 48,
        borderWidth: 1,
        borderColor: '#B6C2D3',
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    countryCodePicker: {
        width: 70,
        height: '100%',
        justifyContent: 'center',
    },
    separator: {
        height: 31,
        width: 1,
        backgroundColor: '#B6C2D3',
        marginLeft: 5,
        marginRight: 5,
    },
    phoneInput: {
        flex: 1,
        borderLeftColor:"#ffffff"
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    backButton: {
        width: 127,
        height: 43,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderColor: '#B6C2D3',
        borderWidth: 1,
        borderRadius: 4,
    },
    backButtonText: {
        color: '#525E6F',
    },
    proceedButton: {
        alignSelf: 'flex-end',
        backgroundColor: '#9867E9',
        height: 48,
        width: 127,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    proceedButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    picker: {
        borderBlockColor:'#FFFFFF',
        borderColor:'#FFFFFF',
        paddingLeft:10,
        height : 35
    },
});

export default NewApplicationFormP2;
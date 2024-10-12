



import React, { useState, useRef } from 'react';
import { StyleSheet, ScrollView, View,Image, Text, TextInput, TouchableOpacity, Animated, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import StepIndicator from '../StepIndicator/StepIndicator';

const NewApplicationFormP3 = () => {
    const [arrivalDate, setArrivalDate] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [previouslyVisited, setPreviouslyVisited] = useState('');
    const [previouslyVisitedDate, setPreviouslyVisitedDate] = useState('');
    const [reasonForRevisit, setReasonForRevisit] = useState('');
    const [recommendationLetter, setRecommendationLetter] = useState('');

    const [filledFields, setFilledFields] = useState(0);
    const totalFields = 6; // Total number of fields for this page
    const progress = useRef(new Animated.Value(50)).current; // Start progress from 50% for the 3rd step

    const handleInputChange = (setter, value, prevValue) => {
        setter(value);
        if (!prevValue && value) {
            setFilledFields((prev) => prev + 1);
        } else if (prevValue && !value) {
            setFilledFields((prev) => prev - 1);
        }
    };

    const handleProceed = () => {
        if (arrivalDate && departureDate && previouslyVisited && previouslyVisitedDate && reasonForRevisit && recommendationLetter) {
            Animated.timing(progress, {
                toValue: 75, // Update progress to 75% for the next step
                duration: 500,
                useNativeDriver: false,
            }).start();
            // Proceed to next step or action here
        } else {
            Alert.alert('Please fill in all the fields before proceeding.');
        }
    };

    const handleBack = () => {
        // Logic to navigate back to the previous page
        navigation.navigate('NewApplicationFormP2'); // Adjust navigation as necessary
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>
                {/* Step Indicator */}
                <StepIndicator step={3} progress={progress} filledFields={filledFields} totalFields={totalFields} />
                 {/* Heading */}
                 <Text style={styles.heading}>Visit Detail</Text>

{/* Input Fields */}
<View style={styles.inputGroup}>
    <Text style={styles.label}>Arrival Date</Text>
    <TextInput
        style={styles.input}
        placeholder="DD-MM-YY"
        placeholderTextColor="#515151"
        value={arrivalDate}
        onChangeText={(value) => handleInputChange(setArrivalDate, value, arrivalDate)}
        // Add date picker logic here
    />
</View>
<View style={styles.inputGroup}>
                    <Text style={styles.label}>Departure Date</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="DD-MM-YY"
                        placeholderTextColor="#515151"
                        value={departureDate}
                        onChangeText={(value) => handleInputChange(setDepartureDate, value, departureDate)}
                        // Add date picker logic here
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Previously Visited</Text>
                    <View style={styles.radioGroup}>
                        <TouchableOpacity onPress={() => handleInputChange(setPreviouslyVisited, 'Yes', previouslyVisited)}>
                            <View style={[styles.radioButton, previouslyVisited === 'Yes' && styles.selectedRadio]}>
                                {previouslyVisited === 'Yes' && <View style={styles.selectedInnerRadio} />}
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.radioLabel}>Yes</Text>
                        <TouchableOpacity onPress={() => handleInputChange(setPreviouslyVisited, 'No', previouslyVisited)}>
                            <View style={[styles.radioButton, previouslyVisited === 'No' && styles.selectedRadio]}>
                                {previouslyVisited === 'No' && <View style={styles.selectedInnerRadio} />}
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.radioLabel}>No</Text>
                    </View>
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Previously Visited Date</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="DD-MM-YY"
                        placeholderTextColor="#515151"
                        value={previouslyVisitedDate}
                        onChangeText={(value) => handleInputChange(setPreviouslyVisitedDate, value, previouslyVisitedDate)}
                        // Add date picker logic here
                    />
                    <Text style={styles.warningText}>*Visited less than 6 months ago, high chances of getting rejected</Text>
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>State reason for Re-visit</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder=""
                        placeholderTextColor="#515151"
                        value={reasonForRevisit}
                        onChangeText={(value) => handleInputChange(setReasonForRevisit, value, reasonForRevisit)}
                        multiline={true}
                        numberOfLines={4}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Recommendation Letter</Text>
                    <View style={styles.uploadContainer}>
                        <TouchableOpacity style={styles.uploadButton}>
                            {/* <Text style={styles.uploadText}>📤</Text> */}
                            <Image 
                            style={styles.tinyLogo}
                            source={require('../../assets/uparrow.png')} />
                        </TouchableOpacity>
                        <Text style={styles.uploadInstruction}>Drag and drop files here to upload</Text>
                        <Text style={styles.uploadNote}>Only JPEG, PNG and SVG files are allowed</Text>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    {/* Back Button */}
                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>

                    {/* Proceed Button */}
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
    radioGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: 181,
    },
    radioButton: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#B6C2D3',
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    selectedRadio: {
        backgroundColor: '#9867E9',
    },
    selectedInnerRadio: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
    },
    radioLabel: {
        marginRight: 16,
        color: '#515151',
    },
    warningText: {
        fontSize: 10,
        color: '#FC5275',
        marginTop: 4,
    },
    textArea: {
        height: 104,
        textAlignVertical: 'top',
    },
    uploadContainer: {
        width: 351,
        height: 82,
        borderWidth: 1,
        borderColor: '#B6C2D3',
        borderRadius: 4,
        display: 'flex',
        flexDirection:'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    uploadButton: {
        // position: 'absolute',
        // top: 10,
        // right: 10,
    },
    tinyLogo:{
        width: 21.61,
        height: 21.61,
    },
    uploadText: {
        fontSize: 24,
    },
    uploadInstruction: {
        color: '#212121',
        textAlign: 'center',
    },
    uploadNote: {
        color: '#757575',
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    backButton: {
        
        borderWidth:2,
        borderColor: '#B6C2D3',
        borderRadius: 4,
        padding: 10,
        width: 100,
    },
    proceedButton: {
        backgroundColor: '#9867E9',
        
        borderRadius: 4,
        padding: 10,
        width: 100,
    },
    backButtonText: {
        color: '#525E6F',
        textAlign: 'center',
    },
    proceedButtonText: {
        color: '#FFFFFF',
        textAlign: 'center',
    },
});

export default NewApplicationFormP3;
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Calendar } from 'react-native-calendars'; // Importing Calendar
import RNPickerSelect from 'react-native-picker-select'; // Importing RNPickerSelect
import Yourrequest from '../Yourrequest';

const RescheduleRequest = ({navigation}) => {
    const [arrivalDate, setArrivalDate] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [guestCount, setGuestCount] = useState(2); // Default to 2 guests
    const [calendarVisible, setCalendarVisible] = useState(false);
    const [isArrivalDate, setIsArrivalDate] = useState(true); // To track which date is being selected

    const handleReschedule = () => {
        // Logic for rescheduling goes here
    };

    const onDayPress = (day) => {
        if (isArrivalDate) {
            setArrivalDate(day.dateString);
        } else {
            setDepartureDate(day.dateString);
        }
        setCalendarVisible(false); // Close calendar after selecting a date
    };

    const guestOptions = Array.from({ length: 10 }, (_, i) => ({
        label: (i + 1).toString(), // Options from 1 to 10
        value: i + 1,
    }));

    const backrequest=()=>{
        navigation.navigate('Request')
      }

    return (
        <View style={styles.container}>
            {/* Back Arrow */}
            <TouchableOpacity style={styles.backArrow} onPress={ backrequest}>
                <Icon name="arrow-back-outline" size={24} color="#9B5DE5" />
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.title}>Rescheduling Request</Text>

            {/* Arrival Date Input */}
            <View style={styles.inputfields}>
                <View style={styles.inputContainer}>
                    <Text>Arrival Date</Text>
                    <TouchableOpacity onPress={() => { setIsArrivalDate(true); setCalendarVisible(true); }}>
                        <TextInput
                            style={styles.input}
                            value={arrivalDate}
                            placeholder="Select Arrival Date"
                            editable={false} // Make it non-editable to prevent manual input
                        />
                    </TouchableOpacity>
                </View>

                {/* Departure Date Input */}
                <View style={styles.inputContainer}>
                    <Text>Departure Date</Text>
                    <TouchableOpacity onPress={() => { setIsArrivalDate(false); setCalendarVisible(true); }}>
                        <TextInput
                            style={styles.input}
                            value={departureDate}
                            placeholder="Select Departure Date"
                            editable={false} // Make it non-editable to prevent manual input
                        />
                    </TouchableOpacity>
                </View>

                {/* No of Guest Members Input */}
                <View style={styles.inputContainer}>
                    <Text>No of Guest Members</Text>
                    <View style={styles.calContainer}>
                        <RNPickerSelect
                            onValueChange={(value) => setGuestCount(value)}
                            items={guestOptions}
                            style={{
                                ...pickerSelectStyles,
                                iconContainer: {
                                    top: 15,
                                    right: 10,
                                },
                            }}
                            placeholder={{ label: "Select Number of Guests", value: null }}
                            value={guestCount}
                        // Icon={() => {
                        //     return <Icon name="chevron-down" size={24} color="gray" />;
                        // }}
                        />
                    </View>
                </View>
            </View>

            {/* Button Row */}
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={ backrequest}>
                    <Text style={styles.buttonTextC}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rescheduleButton} onPress={handleReschedule}>
                    <Text style={styles.buttonTextR}>Reschedule Request</Text>
                </TouchableOpacity>
            </View>

            {/* Calendar Modal */}
            <Modal
                transparent={true}
                visible={calendarVisible}
                animationType="slide"
                onRequestClose={() => setCalendarVisible(false)}
            >
                <View style={styles.calendarContainer}>
                    <Calendar style={styles.innercalendarContainer}
                        onDayPress={onDayPress}
                        markedDates={{
                            [arrivalDate]: { selected: true, marked: true },
                            [departureDate]: { selected: true, marked: true },
                        }}
                    />
                    <TouchableOpacity onPress={() => setCalendarVisible(false)}>
                        <Text style={styles.closeCalendar}>Close Calendar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

export default RescheduleRequest;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    backArrow: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 1,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginTop: 95,
        marginTop: 80, // Added margin to create space below the arrow
        marginLeft:15,
    },
    inputfields: {
        marginTop: 30,
    },
    inputContainer: {
        marginBottom: 15,
        marginLeft: 5,
        marginRight: 5,
        fontSize: 16,
        fontWeight: "bold",
    },
    input: {
        height: 48,
        width: 351,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        padding: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginHorizontal: 5,
    },
    cancelButton: {
        height: 33,
        width: 76,
        backgroundColor: '#fff',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: "#525E6F",
    },
    rescheduleButton: {
        height: 33,
        width: 141,
        backgroundColor: '#fff',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: "#A3D65C",
    },
    buttonTextC: {
        color: '#525E6F',
        fontWeight: 'bold',
        fontSize: 11,
    },
    buttonTextR: {
        color: '#A3D65C',
        fontWeight: 'bold',
        fontSize: 11,
    },
    calendarContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        
    },
    closeCalendar: {
        marginTop: 20,
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

    innercalendarContainer:{
      minWidth:300,
      minHeight:400,
      borderRadius:10,
    },
    calContainer: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderStyle: 'solid',
        borderRadius: 10,
    }
});

// Styles for the dropdown
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        height: 48,
        width: 351,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        padding: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    inputAndroid: {
        height: 48,
        width: 351,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        padding: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
});

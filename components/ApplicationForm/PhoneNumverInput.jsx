import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // If you're using picker

export default function PhoneNumberInput() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState('+91');
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.countryCodeContainer} 
        onPress={() => setIsPickerVisible(!isPickerVisible)}
      >
        <Text style={styles.countryCodeText}>{selectedCountryCode}</Text>
      </TouchableOpacity>

      {isPickerVisible && (
        <Picker
          selectedValue={selectedCountryCode}
          style={styles.picker}
          onValueChange={(itemValue) => {
            setSelectedCountryCode(itemValue);
            setIsPickerVisible(false);
          }}
        >
          <Picker.Item label="+91" value="+91" />
          <Picker.Item label="+1" value="+1" />
          <Picker.Item label="+44" value="+44" />
          {/* Add more country codes as needed */}
        </Picker>
      )}

      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        value={phoneNumber}
        onChangeText={(text) => setPhoneNumber(text)}
        keyboardType="phone-pad"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 5,
    padding: 10,
    width: '90%',
    alignSelf: 'center',
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  countryCodeText: {
    fontSize: 16,
    marginRight: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 10,
  },
  picker: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: 'white',
  },
});

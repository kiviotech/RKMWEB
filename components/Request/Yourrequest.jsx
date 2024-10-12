import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './YourRequestStyles';
import CancelRequestModal from './CancelRequestDailog/CancelRequestModel'; // Import the modal component
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const Yourrequest = ({ request, color }) => {
  const navigation = useNavigation(); // Use navigation hook
  const [modalVisible, setModalVisible] = useState(false);

  const handleCancelRequest = () => {
    // Logic to cancel the request goes here
    setModalVisible(false);
  };

  const handleReschedule = () => {
    navigation.navigate('RescheduleRequest'); // Navigate to RescheduleRequest
  };

  return (
    <View>
      {/* Card */}
      <View style={styles.card}>
        <Text style={[styles.cardTitle, { color: color }]}>{request}</Text>

        {/* Details */}
        <View style={styles.detailsRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>John Dee</Text>
          <Text style={styles.label}>Gender :</Text>
          <Text style={styles.value}>M</Text>
          <Text style={styles.label}>No. of members:</Text>
          <Text style={styles.value}>3</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.label}>Date of Arrival:</Text>
          <Text style={styles.value}>15/10/24</Text>
          <Text style={styles.label}>Date of Departure:</Text>
          <Text style={styles.value}>17/10/24</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.label}>Email :</Text>
          <Text style={styles.value}>john.dee@gmail.com</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.label}>Mobile no. :</Text>
          <Text style={styles.value}>+91 0000000000</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.rescheduleButton} onPress={handleReschedule}>
            <Text style={styles.buttonTextRE}>Reschedule Request</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => setModalVisible(true)} // Show modal on press
          >
            <Text style={styles.buttonTextCA}>Cancel Request</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Cancel Request Modal */}
      <CancelRequestModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleCancelRequest}
      />
    </View>
  );
};

export default Yourrequest;

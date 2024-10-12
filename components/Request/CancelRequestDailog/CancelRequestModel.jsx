import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Image, SafeAreaView } from 'react-native';
import svgs from '../../../constants/svgs';

const Alert2 = svgs.alert;
const CancelRequestModal = ({ visible, onClose, onConfirm }) => {
  return (
    <SafeAreaView>
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* <Icon name={Icon} size={50} color="#FC5275" style={styles.icon} /> */}
           <Alert2/>
          <Text style={styles.message}>Are you sure you want to cancel your request?</Text>
          <Text style={styles.infoMessage}>
            If you cancel now, you will need to submit a new request to attend, which will require approval and could take some time. Please confirm your decision.
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.noButton} onPress={onClose}>
              <Text style={styles.buttonTextN}>No, Go Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.yesButton} onPress={onConfirm}>
              <Text style={styles.buttonTextY}>Yes, Cancel Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay background
  },
  card: {
    height: 329,
    width: 325,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    marginBottom: 10,
  },
  message: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoMessage: {
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 10,
    padding:5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  noButton: {
    height: 33,
    width: 102,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth:1,
    borderColor:"#4B4B4B",
  },
  yesButton: {
    height: 33,
    width: 142,
    backgroundColor: '#FFBDCB',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth:1,
    borderColor:"#FC5275",
  },
  buttonTextN: {
    color: '#4B4B4B',
    fontWeight: 'bold',
    fontSize:11,
  },
  buttonTextY: {
    color: '#FC5275',
    fontWeight: 'bold',
    fontSize:11,
  },
});

export default CancelRequestModal;

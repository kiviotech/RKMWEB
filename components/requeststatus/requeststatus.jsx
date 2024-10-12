import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import svgs from '../../constants/svgs';



const Profile=svgs.profile;
const Notification=svgs.notification
const RequestStatus = () => {
  return (
    <View style={styles.container}>
       <View style={styles.header}>
        <TouchableOpacity>
          
         <Profile/>
        </TouchableOpacity>
        <TouchableOpacity>
          
          <Notification/>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Welcome back,</Text>
      <Text style={styles.username}>Username</Text>

      <View style={styles.requestStatusContainer}>
        <View style={styles.requestStatusCard}>
          <Text style={styles.requestStatusTitle}>Request Status</Text>
          <View style={styles.requestStatusContent}>
            <Icon name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.approvedText}>Your Request was approved!</Text>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.addToCalendarButton}>
              <Icon name="calendar-outline" size={16} color="#fff" />
              <Text style={styles.buttonText}>Add to Calendar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.viewRoomDetailsButton}>
              <Icon name="bed-outline" size={16} color="#fff" />
              <Text style={styles.buttonText}>View room details</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actionCards}>
          <TouchableOpacity style={styles.rescheduleCard}>
            <Icon name="time-outline" size={15} color="#FF9800" />
            <Text style={styles.rescheduleText}>Reschedule my Request</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelCard}>
            <Icon name="close-circle-outline" size={15} color="#F44336" />
            <Text style={styles.cancelText}>Cancel my Request</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoText}>Get a detailed roadmap on how to reach the venue</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    top:50,
    // left:20,
    // zIndex:1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop:35,
  },
  username: {
    fontSize: 20,
    color: '#9867E9',
    marginBottom: 20,
    fontWeight:"bold",
  },
  requestStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  requestStatusCard: {
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 10,
    width: 237, // Set width to 237
    height: 159, // Set height to 159
    marginRight: 10,
  },
  requestStatusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  requestStatusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  approvedText: {
    marginLeft: 10,
    fontSize: 11,
    color: '#A3D65C',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addToCalendarButton: {
    backgroundColor: '#A3D65C',
    padding: 5,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: 93, // Set width to 93
    height: 40, // Set height to 24
    marginRight: 5,
  },
  viewRoomDetailsButton: {
    backgroundColor: '#A3D65C',
    padding: 5,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: 93, // Set width to 93
    height: 40, // Set height to 24
    
  },
  buttonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize:7,
    
  },
  actionCards: {
    flexDirection: 'column',
    flex: 1,
  },
  rescheduleCard: {
    backgroundColor: '#FFF3E0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: 112, // Set width to 112
    height: 73, // Set height to 73
  },
  cancelCard: {
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: 112, // Set width to 112
    height: 73, // Set height to 73
  },
  rescheduleText: {
    marginLeft: 10,
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 8, // Set font size to 8
  },
  cancelText: {
    marginLeft: 10,
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 8, // Set font size to 8
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  infoText: {
    color: '#0D47A1',
  },
});

export default RequestStatus;

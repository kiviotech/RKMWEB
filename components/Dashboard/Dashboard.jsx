import React from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import svgs from '../../constants/svgs';
import Request from '../../pages/request';



const Dots=svgs.dots;
const Notification=svgs.notification;
const HomeScreen = ({navigation}) => {

  const request=()=>{
    navigation.navigate('Request')
  }
  const createrequest=()=>{
    navigation.navigate('ApplicationForm')
  }
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          
          <Dots/>
        </TouchableOpacity>
        <TouchableOpacity onPress={request}>
          
          <Notification/>
        </TouchableOpacity>
      </View>

      {/* Welcome Section */}
      <Text style={styles.welcomeText}>Welcome back,</Text>
      <Text style={styles.username}>Username</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
      <Icon name="search-outline" size={20} color="#9B5DE5" style={styles.searchIcon} />
        <TextInput style={styles.searchInput} placeholder="  Search..." />
        
      </View>
      <TouchableOpacity style={styles.button} onPress={createrequest}>
          <Text style={styles.buttonText}>Create Request</Text>
      </TouchableOpacity>

      {/* Announcement */}
      <View style={styles.announcementContainer}>
        <Text style={styles.announcementText}>🎉 Congrats! Your application has been approved</Text>
      </View>

      {/* Donation Cards */}
      <View style={styles.donationContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Donation</Text>
          <Text style={styles.amount1}>₹4,567</Text>
          <TouchableOpacity style={styles.viewMoreContainer}>
            <Text style={styles.viewMoreT}>View more</Text>
            <Icon name="chevron-forward-outline" size={8} color="#9B5DE5" />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pending Donations</Text>
          <Text style={styles.amount2}>₹1,234</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.payButton}>
              <Text style={styles.payButtonText}>Pay Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.viewMoreContainer}>
              <Text style={styles.viewMore}>View more</Text>
              <Icon name="chevron-forward-outline" size={8} color="#9B5DE5" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Upcoming Events */}
      <Text style={styles.eventsTitle}>Upcoming Events</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
        {[1, 2, 3].map((_, index) => (
          <View key={index} style={styles.eventCard}>
            <Text style={styles.eventName}>Event Name</Text>
            <Text style={styles.eventDescription}>Lorem ipsum dolor sit amet consectetur.</Text>
            <View style={styles.iconRow}>
              <View style={styles.iconText}>
                <Icon name="time-outline" size={14} color="#9B5DE5" />
                <Text style={styles.eventInfo}>Time</Text>
              </View>
              <View style={styles.iconText}>
                <Icon name="location-outline" size={14} color="#9B5DE5" />
                <Text style={styles.eventInfo}>Location</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      {/* <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Icon name="home-outline" size={30} color="#9B5DE5" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="notifications-outline" size={30} color="#9B5DE5" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="person-outline" size={30} color="#9B5DE5" />
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    top:50,
    // left:20,
    // zIndex:1,
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
  welcomeText: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop:35,
  },
  username: {
    fontSize: 25,
    color: '#9867E9',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  searchIcon: {
    marginLeft: 5,
    color:"#525E6F"
  },
  announcementContainer: {
    // backgroundColor: '#E5F7FF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth:1,
  },
  announcementText: {
    color: '#000000',
  },
  donationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    marginBottom: 10,
    color:"#000000",
    fontWeight:"bold",
  },
  amount1: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color:"#A3D65C",
  },
  amount2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color:"#FC5275",
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  payButton: {
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
    height:19,
    width:63,
    borderWidth:1,
    borderColor:"#9867E9"
  },
  payButtonText: {
    color: '#9867E9',
    fontSize: 5,
    textAlign:"center",
  },
  viewMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewMoreT:{
    color: '#9B5DE5',
    marginRight: 5,
    fontSize:8,
    marginLeft:80,
    
  },
  viewMore: {
    color: '#9B5DE5',
    marginRight: 5,
    fontSize:8,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  carousel: {
    marginBottom: 20,
  },
  eventCard: {
    width: 162,
    height:144,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  eventName: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 10,
    marginBottom: 10,
  },
  iconRow: {
    marginTop: 0,
  },
  iconText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  eventInfo: {
    marginLeft: 5,
    fontSize: 8,
    color: '#333',
  },
  // bottomNav: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   paddingVertical: 10,
  //   borderTopWidth: 1,
  //   borderColor: '#E0E0E0',
  // },
});

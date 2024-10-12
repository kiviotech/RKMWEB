// app/signin.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For the eye icon
import { router } from "expo-router";



const SignIn= ({navigation}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const dashboard = () => {
    navigation.navigate('Dashboard'); // Navigate using navigation prop
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Text style={styles.logoText}>LOGO</Text>

      {/* Username Input */}
      <View style={styles.imageContainer}>
      <Text style={styles.label}>Username</Text>
      
      </View>
      <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        placeholderTextColor="#9a9a9a"
        value={username}
        onChangeText={setUsername}
      />
</View>
      {/* Password Input */}
      <View style={styles.imageContainer}>
      <Text style={styles.label}>Password</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry={!isPasswordVisible}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#9a9a9a"
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          <Ionicons
            name={isPasswordVisible ? "eye" : "eye-off"}
            size={24}
            color="#9a9a9a"
          />
        </TouchableOpacity>
      </View>

      {/* <Text style={styles.assistiveText}>Assistive text</Text> */}

      {/* Sign In Button */}
      <TouchableOpacity style={styles.signInButton}  onPress={dashboard}>
        <Text style={styles.signInButtonText}>Sign In</Text>
      </TouchableOpacity>

      

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#333",
    alignSelf: "flex-start",
    marginBottom: 3,
    marginLeft: 8, // Align with the input field
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    width: 350,
    height: 45,
    paddingLeft: 10,
    color: "#333",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
  },
  signInButton: {
    backgroundColor: "#8e44ad",
    borderRadius: 8,
    width: 350,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  
  assistiveText: {
    fontSize: 12,
    color: "#9a9a9a",
    marginTop:-10,
    
    marginLeft: 30,

    width: 300,
  },
  imageContainer:{
    display:"flex",
    width:351,
    flexDirection: 'row',
    // position:"relative",
    justifyContent:"space-between",
    // gap:
    

  },
  image:{
    marginRight:25

  }
});

export default SignIn;

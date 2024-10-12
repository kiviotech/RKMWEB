import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For the eye icon (requires @expo/vector-icons)
import { router } from "expo-router";

const SignUp = ({navigation}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

    const handleDetailsScreen = () => {
        navigation.navigate('Signin'); // Navigate using navigation prop
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
          placeholder="Username"
          placeholderTextColor="#9a9a9a"
        />
      </View>

      {/* Password Input */}
      <View style={styles.imageContainer}>
      <Text style={styles.label}>Password</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
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

      {/* Assistive Text */}
      {/* <Text style={styles.assistiveText}>Assistive text</Text> */}

      {/* Confirm Password Input */}
      <View style={styles.imageContainer}>
      <Text style={styles.label}>Confirm Password</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={!isConfirmPasswordVisible}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholderTextColor="#9a9a9a"
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
        >
          <Ionicons
            name={isConfirmPasswordVisible ? "eye" : "eye-off"}
            size={24}
            color="#9a9a9a"
          />
        </TouchableOpacity>
      </View>

      {/* Assistive Text */}
      {/* <Text style={styles.assistiveText}>Assistive text</Text> */}

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.signUpButton} onPress={handleDetailsScreen}>
        <Text style={styles.signUpButtonText}>Sign Up</Text>
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
    marginBottom: 10,
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
    right: 10,
  },
  assistiveText: {
    fontSize: 12,
    color: "#9a9a9a",
    // marginBottom: 2,
    // textAlign: "left",
    marginTop:-8,
    marginLeft: 30,

    width: 300,
  },
  signUpButton: {
    backgroundColor: "#8e44ad",
    borderRadius: 8,
    width: 350,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
    marginRight:10

  }
  
});

export default SignUp;

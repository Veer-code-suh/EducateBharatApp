import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import logo from '../../Assets/logo.png';
import LightTheme from "../../Theme/LightTheme";
import { useToast } from "react-native-toast-notifications";
import { BACKEND_URL } from "@env";
import { Dimensions } from 'react-native';
import { COLOR } from "../../Constants";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SignupScreen = ({ navigation }) => {
  const toast = useToast();
  const ActiveTheme = LightTheme;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");

  const handleLogin = () => {
    // TODO: Send the email and password to your server for authentication.
    navigation.navigate("loginscreen")
  };

  const handleCreateAccount = () => {
    if (email === "" || password === "" || name === "" || age === "" || phone === "") {
      toast.show("Please fill all the fields", {
        type: "danger",
      });
      return;
    }

    fetch(BACKEND_URL + "/checkuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone: phone }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "User does not exists with that phone") {
          navigation.navigate('checkotp', { email: email, password: password, name: name, age: age, phone: phone });
        } else {
          toast.show("User already exists", {
            type: "danger",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        toast.show("Something went wrong", {
          type: "danger",
        });
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Image source={logo} style={styles.brandLogo} />
          <Text style={{ ...ActiveTheme.title, margin: 10 }}>Signup</Text>
          <TextInput
            placeholderTextColor={'grey'}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            style={ActiveTheme.input}
          />
          <TextInput
            placeholderTextColor={'grey'}
            placeholder="Age"
            value={age}
            onChangeText={setAge}
            style={ActiveTheme.input}
          />
          <TextInput
            placeholderTextColor={'grey'}
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            style={ActiveTheme.input}
          />
          <TextInput
            placeholderTextColor={'grey'}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={ActiveTheme.input}
          />
          <TextInput
            placeholderTextColor={'grey'}
            placeholder="Set New Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            style={ActiveTheme.input}
          />
          <Text
            style={ActiveTheme.button}
            onPress={handleCreateAccount}
          >
            Signup
          </Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.forgotPasswordLink}>Already have an account?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: LightTheme.fullscreen.backgroundColor,
  },
  brandLogo: {
    width: 100,
    height: 100,
    alignSelf: "center",
  },
  forgotPasswordLink: {
    color: COLOR.col3,
    fontSize: 13,
  },
  createAccountLink: {
    color: COLOR.col3,
    fontSize: 15,
    textDecorationLine: "underline",
    textDecorationStyle: "dotted",
  },
  or: {
    fontSize: 17,
    margin: 20,
  },
});

export default SignupScreen;

import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  BackHandler,
  ActivityIndicator
} from "react-native";
import logo from '../../Assets/logo.png'

import LightTheme from "../../Theme/LightTheme";



import { Dimensions } from 'react-native';
import { COLOR } from "../../Constants";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { BACKEND_URL } from "@env";
import { useToast } from "react-native-toast-notifications";
import { useRecoilState } from "recoil";
import { LoginState } from "../../RecoilState/LoginState";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const toast = useToast();
  const ActiveTheme = LightTheme
  const [phone, setphone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [islogin, setIsLogin] = useRecoilState(LoginState)


  const handleLogin = () => {
    // TODO: Send the phone and password to your server for authentication.
    // navigation.navigate("bottomnavigator")

    console.log(BACKEND_URL)

    if (phone == "" || password == "") {
      toast.show("Something went wrong", {
        type: "danger",
      });
    }

    else {
      setLoading(true)
      // console.log(BACKEND_URL)
      fetch(BACKEND_URL + "/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "phone": phone,
          "password": password
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          console.log('login func',json)
          setLoading(false)
          if (json.error) {
            toast.show(json.error, {
              type: "danger",
            });

          }
          else {
            toast.show("Logged In Successfully", {
              type: "success",
            });
            // navigation.navigate('loginscreen')

            let token = json.token
            AsyncStorage.setItem('token', token)
            setIsLogin(true)
          }
        })
        .catch((error) => {
          console.error(error);
          toast.show("Something went wrong", {
            type: "danger",
          });
          setLoading(false)
          setIsLogin(false)
        });
    }
  };

  const handleForgotPassword = () => {
    // TODO: Show a modal or redirect to a page where the user can reset their password.
  };

  const handleCreateAccount = () => {
    // TODO: Navigate to the create account page.
    navigation.navigate("signupscreen")
  };


  React.useEffect(() => {
    // const backAction = () => {
    //   // BackHandler.exitApp();
    //   return true; // Return true to prevent default back button behavior
    // };

    // const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    // return () => backHandler.remove();
  }, []);


  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.brandLogo} />
      <Text style={{
        ...ActiveTheme.title,
        margin: 10
      }}>Login</Text>
      <TextInput
        placeholder="Phone"
        value={phone}
        onChangeText={setphone}
        style={ActiveTheme.input} placeholderTextColor={'grey'}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        style={ActiveTheme.input} placeholderTextColor={'grey'}
      />
      {
        loading ?
          <ActivityIndicator size="large" color={COLOR.col3} />
          :
          <Text
            style={ActiveTheme.button}
            onPress={handleLogin}
          >Login</Text>
      }
      <TouchableOpacity

        onPress={handleForgotPassword}>
        <Text style={styles.forgotPasswordLink}>Forgot Password?</Text>
      </TouchableOpacity>
      <Text style={styles.or}>OR</Text>
      <TouchableOpacity
        onPress={handleCreateAccount}>
        <Text
          style={styles.createAccountLink}

        >Create New Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: LightTheme.fullscreen.backgroundColor
  },
  brandLogo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    alignSelf: "center",
  },

  forgotPasswordLink: {
    color: COLOR.col3,
    fontSize: 13
  },
  createAccountLink: {
    color: COLOR.col3,
    fontSize: 15,
    textDecorationLine: "underline",
    textDecorationStyle: "dotted"
  },
  or: {
    fontSize: 17,
    margin: 20
  }
});

export default LoginScreen;

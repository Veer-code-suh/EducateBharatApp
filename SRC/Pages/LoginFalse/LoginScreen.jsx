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
import { Toast, useToast } from "react-native-toast-notifications";
import { useRecoilState } from "recoil";
import { LoginState } from "../../RecoilState/LoginState";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
    const toast = useToast();
    const ActiveTheme = LightTheme
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const [islogin, setIsLogin] = useRecoilState(LoginState)


    const handleLogin = () => {
        // TODO: Send the phone and password to your server for authentication.
        // navigation.navigate("bottomnavigator")


        if (phone == "" || password == "") {
            Toast.show("Something went wrong", {
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
                    console.log('login func', json)
                    setLoading(false)
                    if (json.error) {
                        Toast.show(json.error, {
                            type: "danger",
                        });

                    }
                    else {
                        Toast.show("Logged In Successfully", {
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
                    Toast.show("Something went wrong", {
                        type: "danger",
                    });
                    setLoading(false)
                    setIsLogin(false)
                });
        }
    };

    const handleForgotPassword = () => {
        // TODO: Show a modal or redirect to a page where the user can reset their password.
        navigation.navigate("ForgotPasswordScreen")

    };

    const handleCreateAccount = () => {
        // TODO: Navigate to the create account page.
        navigation.navigate("SignupScreen")
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
            <Text style={{ ...styles.title, margin: 10 }}>Login</Text>
            <TextInput
                placeholder="Phone"
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
                placeholderTextColor={'grey'}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                style={styles.input}
                placeholderTextColor={'grey'}
            />
            {loading ? (
                <ActivityIndicator size="large" color="#007BFF" />
            ) : (
                <Text style={styles.button} onPress={handleLogin}>
                    Login
                </Text>
            )}
            <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgotPasswordLink}>Forgot Password?</Text>
            </TouchableOpacity>
            <Text style={styles.or}>OR</Text>
            <TouchableOpacity onPress={handleCreateAccount}>
                <Text style={styles.createAccountLink}>Create New Account</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F5F5F5',
    },
    brandLogo: {
        width: 100,
        height: 100,
        marginBottom: 20,
        objectFit:'contain'
    },
    title: {
        fontSize: 24,
        color: '#333',
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginVertical: 10,
    },
    button: {
        backgroundColor: COLOR.col2,
        color: '#FFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        textAlign: 'center',
        marginTop: 10,
        width: '80%',
    },
    forgotPasswordLink: {
        color: COLOR.col2,
        marginTop: 10,
    },
    or: {
        marginVertical: 10,
        color: '#666',
    },
    createAccountLink: {
        color: COLOR.col2
    },
});

export default LoginScreen;
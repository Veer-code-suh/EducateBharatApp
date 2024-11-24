import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from "react-native";

import logo from '../../Assets/logo.png'

import LightTheme from "../../Theme/LightTheme";



import { Dimensions } from 'react-native';
import { COLOR } from "../../Constants";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { Toast, useToast } from "react-native-toast-notifications";
import { BACKEND_URL } from "@env";
import { color } from "react-native-elements/dist/helpers";

const CheckOtpSignup = ({ navigation, route }) => {
    const toast = useToast();
    const ActiveTheme = LightTheme
    const { email, password, name, age, phone } = route.params;
    const [loading, setLoading] = useState(false);

    const [otp, setOtp] = useState(null);
    const [timer, setTimer] = useState(1 * 60 * 1000);

    const [correctOtp, setCorrectOtp] = useState(null);

    useEffect(() => {
        sendOtp()
    }, []);
    const sendOtp = () => {
        fetch(BACKEND_URL + '/sendotp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone: phone
            })
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json)
                setCorrectOtp(json.otp)
            })
    }

    const handleOtpChange = (text) => {
        setOtp(text);
    };


    const handleVerify = () => {
        // TODO: Send the OTP to your server for verification.
        // navigation.navigate('loginscreen')
        if (email == "" || password == "" || name == "" || age == "" || phone == "") {
            Toast.show("Something went wrong", {
                type: "danger",
            });
            navigation.navigate('SignupScreen')
            return
        }

        if (otp.length < 4) {
            Toast.show("Please enter OTP", {
                type: "danger",
            });
            return
        }

        else if (otp == correctOtp && correctOtp != null && otp != null) {
            Toast.show("OTP Verified", {
                type: "success",
            });
            // console.log('http://10.0.2.2:4000')


            setLoading(true)

            fetch(BACKEND_URL + '/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    name: name,
                    age: age,
                    phone: phone
                })
            })
                .then((response) => response.json())
                .then((json) => {
                    console.log('signup func', json)
                    setLoading(false)
                    if (json.error) {
                        Toast.show(json.error, {
                            type: "danger",
                        });
                    }
                    else {
                        Toast.show("Account Created", {
                            type: "success",
                        });
                        navigation.navigate('LoginScreen')
                    }
                })
                .catch((error) => {
                    console.error(error);
                    Toast.show("Something went wrong", {
                        type: "danger",
                    });
                    setLoading(false)
                });


            // http://10.0.2.2:4000


        }

        else {
            Toast.show("Incorrect OTP", {
                type: "danger",
            });
        }


    };

    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.brandLogo} />
            <Text style={styles.title}>Verify OTP</Text>
            <Text style={styles.infoText}>A Verification Code has been sent to the provided phone.</Text>
            <TextInput
                placeholder="OTP"
                keyboardType="number-pad"
                value={otp}
                onChangeText={handleOtpChange}
                placeholderTextColor="grey"
                maxLength={4}
                style={styles.input}
            />
            {loading ? (
                <ActivityIndicator size="large" color={COLOR.col3} style={styles.loader} />
            ) : (
                <Text style={styles.button} onPress={handleVerify}>
                    Verify
                </Text>
            )}
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
    },

    infoText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        color: COLOR.col2
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: COLOR.col2,
        color: COLOR.col2,
        borderWidth: 2,
        borderRadius: 25,
        padding: 10,
        marginVertical: 5,
        paddingHorizontal: 20,
        fontSize: 15
    },
    button: {
        textAlignVertical: "center",
        textAlign: "center",
        backgroundColor: COLOR.col2,
        color: COLOR.col1,
        borderRadius: 20,
        marginTop: 10,
        width: '80%',
        padding: 10,
        fontSize: 16,
    },
    loader: {
        marginTop: 20,
    },
});

export default CheckOtpSignup;

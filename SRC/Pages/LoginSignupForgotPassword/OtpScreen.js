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
import { useToast } from "react-native-toast-notifications";
import { BACKEND_URL } from "@env";

const OtpScreen = ({ navigation, route }) => {
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
            toast.show("Something went wrong", {
                type: "danger",
            });
            navigation.navigate('signupscreen')
            return
        }

        if (otp.length < 4) {
            toast.show("Please enter OTP", {
                type: "danger",
            });
            return
        }

        else if (otp == correctOtp && correctOtp != null && otp != null) {
            toast.show("OTP Verified", {
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
                        toast.show(json.error, {
                            type: "danger",
                        });
                    }
                    else {
                        toast.show("Account Created", {
                            type: "success",
                        });
                        navigation.navigate('loginscreen')
                    }
                })
                .catch((error) => {
                    console.error(error);
                    toast.show("Something went wrong", {
                        type: "danger",
                    });
                    setLoading(false)
                });


            // http://10.0.2.2:4000


        }

        else {
            toast.show("Incorrect OTP", {
                type: "danger",
            });
        }


    };


    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.brandLogo} />
            <Text style={{
                ...ActiveTheme.title,
                margin: 10
            }}>Verify OTP</Text>
            <Text style={styles.t1}>A Verification Code has been sent to the provided phone.</Text>
            <TextInput
                placeholder="OTP"
                keyboardType="number-pad"
                value={otp}
                onChangeText={handleOtpChange} placeholderTextColor={'grey'}
                maxLength={4}
                style={{
                    ...ActiveTheme.input,
                    textAlign: "center"
                }} />

            {
                loading ?
                    <ActivityIndicator
                        size="large"
                        color={COLOR.col3}
                        style={{
                            marginTop: 20
                        }}
                    />
                    :
                    <Text
                        style={ActiveTheme.button}
                        onPress={handleVerify}
                    >Verify</Text>
            }
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
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 10,
    },
    t1: {
        marginBottom: 20,
        color: COLOR.col3
    },
    button: {
        width: 100,
        height: 40,
        backgroundColor: "#000000",
        color: "#ffffff",
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    forgotPasswordLink: {
        color: "#000000",
        fontSize: 16,
        textDecorationLine: "underline",
    },
    timer: {
        fontSize: 16,
        color: "#000000",
        marginTop: 10,
    },
});

export default OtpScreen;

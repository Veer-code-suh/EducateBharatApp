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
import { Toast, useToast } from "react-native-toast-notifications";
import logo from '../../Assets/logo.png'; // Update with actual logo path
import { BACKEND_URL } from "@env";
import { Dimensions } from 'react-native';
import { COLOR } from "../../Constants";

const windowHeight = Dimensions.get('window').height;

const SignupScreen = ({ navigation }) => {
    const toast = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [phone, setPhone] = useState("");

    const handleLogin = () => {
        navigation.navigate("LoginScreen");
    };

    const handleCreateAccount = () => {

        // navigation.navigate('CheckOtpSignup', { email: "virajj014@gmail.com", password: "hj13456", name: "Harshal Jain", age: 21, phone: "7000896210" });
        // return;

        if (!email || !password || !name || !age || !phone) {
            Toast.show("Please fill all the fields", { type: "danger" });
            return;
        }

        fetch(`${BACKEND_URL}/checkuser`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message === "User does not exists with that phone") {
                    navigation.navigate('CheckOtpSignup', { email, password, name, age, phone });
                } else {
                    Toast.show("User already exists", { type: "danger" });
                }
            })
            .catch(() => {
                Toast.show("Something went wrong", { type: "danger" });
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
                    <Text style={styles.title}>Signup</Text>
                    <TextInput
                        placeholder="Full Name"
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                        placeholderTextColor="grey"
                    />
                    <TextInput
                        placeholder="Age"
                        value={age}
                        onChangeText={setAge}
                        style={styles.input}
                        placeholderTextColor="grey"
                    />
                    <TextInput
                        placeholder="Phone Number"
                        value={phone}
                        onChangeText={setPhone}
                        style={styles.input}
                        placeholderTextColor="grey"
                    />
                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        placeholderTextColor="grey"
                    />
                    <TextInput
                        placeholder="Set New Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.input}
                        placeholderTextColor="grey"
                    />
                    <Text style={styles.button} onPress={handleCreateAccount}>
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F5F5F5',
        minHeight: windowHeight,
    },
    brandLogo: {
        width: 100,
        height: 100,
        marginBottom: 20,
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
    forgotPasswordLink: {
        color: COLOR.col2,
        marginTop: 10,
        fontSize: 14,
    },
});

export default SignupScreen;

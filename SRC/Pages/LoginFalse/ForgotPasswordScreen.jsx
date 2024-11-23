import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from "react-native";
import logo from '../../Assets/logo.png';
import { COLOR } from "../../Constants";
import { Toast, useToast } from "react-native-toast-notifications";

const ForgotPasswordScreen = ({ navigation }) => {
  const toast = useToast();
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = () => {



    // navigation.navigate('CheckOtpForgotPassword', { phone:"7000896210", password: "vj123456"});

    // return;

    if (phone === "" || newPassword === "" || confirmPassword === "") {
      Toast.show("Please fill in all fields", { type: "danger" });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show("Passwords do not match", { type: "danger" });
      return;
    }
    setLoading(true);
    // Mock password reset request

    navigation.navigate('CheckOtpForgotPassword', { phone, password: newPassword });

  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.brandLogo} />
      <Text style={{ ...styles.title, margin: 10 }}>Reset Password</Text>
      <TextInput
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        placeholderTextColor="grey"
      />
      <TextInput
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry={true}
        style={styles.input}
        placeholderTextColor="grey"
      />
      <TextInput
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={true}
        style={styles.input}
        placeholderTextColor="grey"
      />
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <Text style={styles.button} onPress={handleResetPassword}>
          Reset Password
        </Text>
      )}
      <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
        <Text style={styles.backToLogin}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  brandLogo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    objectFit: "contain",
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
  backToLogin: {
    color: COLOR.col2,
    marginTop: 10,
  },
});

export default ForgotPasswordScreen;

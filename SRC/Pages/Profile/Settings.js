import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import  MaterialIcons  from 'react-native-vector-icons/MaterialIcons';
import  MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';
import  Entypo  from 'react-native-vector-icons/Entypo';
import  Feather  from 'react-native-vector-icons/Feather';
import  FontAwesome5  from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { COLOR } from '../../Constants';

const Settings = ({ navigation }) => {
  

    return (
        <View style={styles.container}>
            <ScrollView style={styles.containerin}>
                <Text style={styles.head1}>User Section</Text>
              

                <View style={styles.head2out}>
                    <FontAwesome5 name="money-check-alt" size={24} color="black"
                        style={styles.head2icon}
                    />
                    <Text style={styles.head2}>
                        Purchases</Text>

                </View>
                <View style={styles.settingitem}>
                    <Text style={styles.settingitemtext}>My Courses</Text>
                    <MaterialIcons name="keyboard-arrow-right" size={24} color="black"
                        style={styles.settingitemicon}
                        onPress={() => navigation.navigate('mycourses')}
                    />
                </View>
                <View style={styles.settingitem}>
                    <Text style={styles.settingitemtext}>My Orders</Text>
                    <MaterialIcons name="keyboard-arrow-right" size={24} color="black"
                        style={styles.settingitemicon}
                        onPress={() => navigation.navigate('allorders')}
                    />
                </View>
                <View style={styles.settingitem}>
                    <Text style={styles.settingitemtext}>Test Scores</Text>
                    <MaterialIcons name="keyboard-arrow-right" size={24} color="black"
                        style={styles.settingitemicon}
                        onPress={() => navigation.navigate('testscorespage')}
                    />
                </View>
                <View style={styles.head2out}>
                    <Feather name="more-horizontal" size={24} color="black"
                        style={styles.head2icon}
                    />
                    <Text style={styles.head2}>
                        Support</Text>
                </View>

                <TouchableOpacity
                    onPress={() => Linking.openURL('https://www.google.com/')}
                >
                    <View style={styles.settingitem}>
                        <Text style={styles.settingitemtext}>Terms & Conditions</Text>
                        <Entypo name="list" size={24} color="black"
                            style={styles.settingitemicon}
                        />
                    </View>

                </TouchableOpacity>


                <TouchableOpacity
                    onPress={() => Linking.openURL('https://www.google.com/')}
                >
                    <View style={styles.settingitem}>
                        <Text style={styles.settingitemtext}>Privacy Policy</Text>
                        <MaterialIcons name="privacy-tip" size={24} color="black"
                            style={styles.settingitemicon}
                        />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleLogout()}>
                    <View style={styles.settingbtn}>
                        <Text style={styles.settingbtntext}>Logout</Text>
                        <MaterialCommunityIcons name="logout-variant" size={24} color="black"
                            style={styles.settingbtnicon}
                        />
                    </View>
                </TouchableOpacity>
            </ScrollView>

           
        </View>
    )
}

export default Settings

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    bottomnav: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    head1: {
        fontSize: 30,
        marginTop: 20,
        textAlign: 'center',
        color: COLOR.col3,
    },
    containerin: {
        marginHorizontal: 20,
    }
    ,
    head2out: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginVertical: 10,
        marginTop: 30,
    },
    head2: {
        fontSize: 20,
        marginLeft: 10,
        // marginTop: 20,
        color: COLOR.col3,
    },
    head2icon: {
        color: COLOR.col3,
    },
    settingitem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 5,
    },
    settingitemtext: {
        fontSize: 16,
        color: COLOR.col3,
    },
    settingitemicon: {
        // marginRight: 10,
        color: COLOR.col3,
    },
    settingbtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        backgroundColor: COLOR.col3,
        padding: 10,
        borderRadius: 20,
        width: '50%',
        alignSelf: 'center',
    },
    settingbtntext: {
        fontSize: 16,
        color: 'white',
        marginRight: 10,
    },
    settingbtnicon: {
        color: 'white',
    },


})
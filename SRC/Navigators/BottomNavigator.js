import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeNavigator from './HomeNavigator';
import { Dimensions } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import StorePage from '../Pages/InnerPages/StorePage';

import { COLOR } from '../Constants';
import MyCourses from '../Pages/InnerPages/MyCourses';
import Settings from '../Pages/Profile/Settings';

const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName="HomeNavigator"
            screenOptions={{
                tabBarStyle: {
                    position: 'absolute',
                    height: 50,
                },
                tabBarShowLabel: false,
                headerShown: false,
            }}>
            <Tab.Screen name="HomeNavigator" component={HomeNavigator}
                options={{
                    tabBarIcon: ({ focused, color, size }) =>
                    (
                        <View style={styles.iconContainer}>
                            <Octicons name="home" size={25} color={focused ? COLOR.col2 : 'grey'} />
                        </View>
                    )
                }}
            />
            <Tab.Screen name="StorePage" component={StorePage}
                options={{
                    tabBarIcon: ({ focused, color, size }) =>
                    (

                        <View style={styles.iconContainer}>
                            <AntDesign name="book" size={25} color={focused ? COLOR.col2 : 'grey'} />
                        </View>

                    )
                }}
            />

            <Tab.Screen name="Settings" component={Settings}
                options={{
                    tabBarIcon: ({ focused, color, size }) =>
                    (

                        <View style={styles.iconContainer}>
                            {/* three dot */}
                            <Feather name="user" size={25} color={focused ? COLOR.col2 : 'grey'} />
                        </View>

                    )
                }}
            />
        </Tab.Navigator>


    )
}

export default BottomNavigator

const styles = StyleSheet.create({
    iconContainer: {
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        justifyContent: 'space-evenly',
        width: Dimensions.get('window').width / 5 - 10,
    },
    iconText: {
        fontSize: 8,
        color: 'black',
        position: 'relative'
    },
})
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomePage from '../Pages/HomeScreens/HomePage';
import { COLOR } from '../Constants';
import DrawerContent from '../Components/DrawerContent';
import { useRecoilState } from 'recoil';
import { LoginState } from '../RecoilState/LoginState';


const HomeNavigator = () => {

    const Drawer = createDrawerNavigator();

    return (
        <Drawer.Navigator initialRouteName="Home"
            drawerContent={
                (props) => <DrawerContent {...props} />
            }
            screenOptions={
                {
                    headerShown: false,
                    drawerStyle: {
                        backgroundColor: 'white',
                        width: 240,

                    },
                    drawerActiveBackgroundColor: COLOR.col2,
                    drawerActiveTintColor: COLOR.col4,
              
                }
            }>
            <Drawer.Screen name="Home" component={HomePage} />
        </Drawer.Navigator>

    )
}

export default HomeNavigator

const styles = StyleSheet.create({})
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Feather from 'react-native-vector-icons/Feather';
import { COLOR } from '../Constants';
const HomeTop = ({ navigation }) => {
    const closeDrawer = () => {
        navigation.closeDrawer()
    }

    const openDrawer = () => {
        navigation.openDrawer()
    }
    return (
        <View style={styles.topout}>
            <Feather name="menu" size={24} color={COLOR.col3} 
            onPress={openDrawer}
            />
            <Feather name="shopping-cart" size={24} color={COLOR.col3}
            onPress={() => navigation.navigate("cart")}
            />
        </View>
    )
}

export default HomeTop

const styles = StyleSheet.create({
    topout: {
        width: "95%",
        height: 50,
        backgroundColor: COLOR.col1,
        justifyContent: "center",
        paddingHorizontal: 10,
        elevation: 5,
        margin: 10,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    }
})
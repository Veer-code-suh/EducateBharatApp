import { StyleSheet, Text, View,ScrollView } from 'react-native'
import React from 'react'
import { Button } from 'react-native';
import LightTheme from "../../Theme/LightTheme";
import HomeTop from '../../Components/HomeTop';


import HomeCarousel from '../../Components/HomeCarousel';
import HomeJeeNeet from '../../Components/Home/HomeJeeNeet';
import HomeProducts from '../../Components/Home/HomeProducts';


const HomePage = ({ navigation }) => {

  const ActiveTheme = LightTheme
  return (
    <ScrollView style={styles.container}>
      <HomeTop navigation={navigation} />
      <View style={styles.carousel}>
        <HomeCarousel style={styles.carousel} />
      </View>
      <HomeJeeNeet />
      <HomeProducts navigation={navigation}/>
      <View style={{
        height: 50
      }}></View>
    </ScrollView>
  )
}

export default HomePage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    backgroundColor: LightTheme.fullscreen.backgroundColor
  },
  carousel: {
    // backgroundColor: 'blue',
    height: 230,
    alignItems: 'center'
  }
})
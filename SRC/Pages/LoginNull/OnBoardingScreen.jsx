import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import logo from '../../Assets/logo.png'
import { Image } from 'react-native-elements';
import { COLOR } from '../../Constants';


const OnBoardingScreen = () => {
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.fullpage}>
      <Image source={logo} style={{ width:200, height:200, aspectRatio: 1 }} />
      <ActivityIndicator size={30} color={COLOR.col2} animating={loading} />
    </View>
  )
}

export default OnBoardingScreen

const styles = StyleSheet.create({
  fullpage: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent:'center',
    alignItems:'center'
  }
})
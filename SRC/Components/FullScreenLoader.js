import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React from 'react'
import { COLOR } from '../Constants'
import { Dimensions } from 'react-native';

const FullScreenLoader = () => {
    let SCEEN_HEIGHT = Dimensions.get('window').height;
    let SCEEN_WIDTH = Dimensions.get('window').width;
  return (
    <View 
        style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width:SCEEN_WIDTH,
            height:SCEEN_HEIGHT,
            zIndex: 9999,
        }}
    >
     <ActivityIndicator size="large" color={COLOR.col4}/>
    </View>
  )
}

export default FullScreenLoader

const styles = StyleSheet.create({})
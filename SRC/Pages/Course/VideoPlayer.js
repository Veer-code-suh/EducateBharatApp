import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Video from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLOR } from '../../Constants';
import {BACKEND_URL} from "@env"

const VideoPlayer = ({ navigation , route}) => {
  const {videoUrl} = route.params
  // http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
  console.log(videoUrl)
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'black',

      }}
    >
      <View style={styles.topbar}>
        <Ionicons name="return-up-back-outline" size={30} style={styles.backbtn}
          onPress={() => navigation.goBack()}
        />
      </View>
      <Video
        source={{ uri: videoUrl }}
        style={{
          flex: 1,
        }}
        controls={true}
        resizeMode="contain"
        paused={false}
        onBuffer={this.onBuffer}
        fullscreen={true}

      />
    </View>
  )
}

export default VideoPlayer

const styles = StyleSheet.create({
  topbar: {
    width: "100%",
    height: 50,
    backgroundColor: "black",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    zIndex: 1,
    position: "absolute",
    top: 0,
    left: 0
  },
  backbtn: {
    color: COLOR.col1,
    margin: 10
  },
})
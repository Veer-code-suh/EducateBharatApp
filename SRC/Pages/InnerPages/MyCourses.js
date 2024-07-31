import { Dimensions, StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { COLOR, windowWidth } from '../../Constants'
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ScrollView } from 'react-native'
import { BACKEND_URL } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage'

const MyCourses = ({ navigation }) => {

  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)

  const getMyCourses = async () => {
    const token = await AsyncStorage.getItem('token')
    setLoading(true)
    fetch(`${BACKEND_URL}/getMyCourses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },

    })
      .then(res => res.json())
      .then(data => {
        // console.log(data)
        setCourses(data.courses)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }

  useEffect(() => {
    getMyCourses()
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.topbar}>
        <Ionicons name="return-up-back-outline" size={30} style={styles.backbtn}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.heading}>My Courses</Text>
      </View>
      {/* <TouchableOpacity
        onPress={
          () => {
            navigation.navigate('coursepage')
          }
        }
      >
        <View style={styles.c1}>
          <AntDesign name='book' size={30} color='black' style={styles.icon} />
          <Text style={styles.t1}>JEE</Text>
          <Text style={styles.t1}>Mains</Text>
        </View>
      </TouchableOpacity> */}


      {
        loading == false && courses.length==0 &&
        <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLOR.col4 }}>No Courses</Text>
        </View>
      }
      {
        loading == true &&
        <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <ActivityIndicator size="large" color={COLOR.col4} />
        </View>
      }
      {
        courses && loading == false && courses.length > 0 &&
        <ScrollView>
          {
            courses.map((item, index) => {
              return (
                <TouchableOpacity key={index} onPress={() => navigation.navigate('coursepage', { course: item })}>

                  <View style={styles.c1}>
                    <AntDesign name='book' size={30} color='black' style={styles.icon} />
                    <Text style={styles.t1}>{item.courseName}</Text>
                  </View>
                </TouchableOpacity>
              )
            })
          }
        </ScrollView>
      }
    </View>
  )
}

export default MyCourses

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: windowWidth,
    backgroundColor: COLOR.col3,
    flex: 1
  },
  c1: {
    backgroundColor: COLOR.col4,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    width: windowWidth - 10,
    height: windowWidth / 3.5 + 20,
    margin: 5
  },
  t1: {
    color: COLOR.col3,
  },
  icon: {
    fontSize: 40,
    color: COLOR.col3,
    marginBottom: 10
  },
  topbar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    width: windowWidth,
    zIndex: 1,
    backgroundColor: "#fff",
    marginBottom: 20
  },
  backbtn: {
    color: "#000",
    marginRight: 10,
    zIndex: 1
  },
  heading: {
    fontSize: 20,
    fontWeight: "500",
    color: COLOR.col3,
    position: "absolute",
    width: windowWidth,
    textAlign: "center"
  }
})
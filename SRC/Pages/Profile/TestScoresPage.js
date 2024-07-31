import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { LoginState } from '../../RecoilState/LoginState'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BACKEND_URL } from '@env';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLOR } from '../../Constants'

const TestScoresPage = ({ navigation }) => {
  const [islogin, setIsLogin] = useRecoilState(LoginState)
  const [user, setUser] = useState({})
  const [quizzes, setQuizzes] = useState([])
  const getUserDatafromToken = async () => {
    let token = await AsyncStorage.getItem("token")

    fetch(BACKEND_URL + "/getuserdatafromtoken", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setUser(data.userdata)
        setQuizzes(data.userdata.testScores)
        // console.log(data.userdata.testScores[0].quizData)
      })
  }

  useEffect(() => {
    getUserDatafromToken()
  }, [islogin])
  return (
    <View style={styles.container}>
      {
        quizzes.length>0 && quizzes.map((quiz, index) => {
          return (
            <View key={index} style={styles.settingitem}>
              <Text style={styles.settingitemtext}>{quiz.quizId}</Text>
              <MaterialIcons name="keyboard-arrow-right" size={24} color="black"
                style={styles.settingitemicon}
                onPress={() => navigation.navigate('testscoresingle', { quiz: quiz })}
              />
            </View>
          )
        })
      }
    </View>
  )
}

export default TestScoresPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  settingitem: {

    padding: 10, borderWidth: 1, borderColor: COLOR.col4, margin: 10,
    borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLOR.col4

  },
  settingitemtext: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  settingitemicon: {
    position: 'absolute',
    right: 10,
  },
})
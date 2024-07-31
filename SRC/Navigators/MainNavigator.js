import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useRecoilState } from 'recoil';
import { LoginState } from '../RecoilState/LoginState';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLOR } from '../Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native'


import OnBoardingScreen from '../Pages/OnBoardingScreen';
import LoginScreen from '../Pages/LoginSignupForgotPassword/LoginScreen';
import SignupScreen from '../Pages/LoginSignupForgotPassword/SignUpScreen';
import OtpScreen from '../Pages/LoginSignupForgotPassword/OtpScreen';
import AboutUs from '../Pages/InnerPages/AboutUs';
import CoursePage from '../Pages/Course/CoursePage';
import ChapterNotes from '../Pages/Course/ChapterNotes';
import ChapterTests from '../Pages/Course/ChapterTests';
import ChapterVideos from '../Pages/Course/ChapterVideos';
import SpecificChapter from '../Pages/Course/SpecificChapter';
import CourseChapters from '../Pages/Course/CourseChapters';
import ProductPage from '../Pages/InnerPages/ProductPage';
import VideoPlayer from '../Pages/Course/VideoPlayer';
import PdfViewer from '../Pages/Course/PdfViewer';
import QuestionPage from '../Pages/Quiz/QuestionPage';
import SubmitQuiz from '../Pages/Quiz/SubmitQuiz';
import Cart from '../Pages/InnerPages/Cart';
import AllOrders from '../Pages/Orders/AllOrders';
import OrderPage from '../Pages/Orders/OrderPage';
import MyCourses from '../Pages/InnerPages/MyCourses';
import TestScoresPage from '../Pages/Profile/TestScoresPage';
import TestScoreSingle from '../Pages/Profile/TestScoreSingle';
import BottomNavigator from './BottomNavigator';


const MainNavigator = () => {
  const [islogin, setIsLogin] = useRecoilState(LoginState)
  const Stack = createNativeStackNavigator()

  const checkLogin = async () => {
    let loginToken = await AsyncStorage.getItem('token')
    // console.log(loginToken)
    if (loginToken != null) {
      // Alert("Login")
      setIsLogin(true)
    }
    else {
      setIsLogin(false)
    }
  }
  useEffect(() => {
    checkLogin()
  }, [])


  return (

    <NavigationContainer>
      {
        islogin == null &&
        <Stack.Navigator screenOptions={{
          headerShown: false
        }}>
          <Stack.Screen name="OnBoardingScreen" component={OnBoardingScreen} />
        </Stack.Navigator>

      }

      {
        islogin == false &&
        <Stack.Navigator screenOptions={{
          headerShown: false
        }}>
          <Stack.Screen name="loginscreen" component={LoginScreen} />
          <Stack.Screen name="signupscreen" component={SignupScreen} />
          <Stack.Screen name="checkotp" component={OtpScreen}
            options={{
              headerShown: true,
              headerTitle: 'Verify OTP',
              headerStyle: {
                backgroundColor: COLOR.col3,
              },
              headerTintColor: COLOR.col1,

            }}
          />
        </Stack.Navigator>
      }


      {
        islogin == true &&
        <Stack.Navigator screenOptions={{
          headerShown: false
        }}>

          <Stack.Screen name="bottomnavigator" component={BottomNavigator} />
          <Stack.Screen name="aboutus" component={AboutUs} />
          <Stack.Screen name="coursepage" component={CoursePage} />
          <Stack.Screen name="chapternotes" component={ChapterNotes} />
          <Stack.Screen name="chaptertests" component={ChapterTests} />
          <Stack.Screen name="chaptervideos" component={ChapterVideos} />
          <Stack.Screen name="chapterspecific" component={SpecificChapter} />
          <Stack.Screen name="coursechapters" component={CourseChapters}
            options={{
              headerShown: true,
              headerTitle: '',
            }}
          />


          <Stack.Screen name="productpage" component={ProductPage} />
          <Stack.Screen name="videoplayer" component={VideoPlayer} />
          <Stack.Screen name="pdfviewer" component={PdfViewer} />
          <Stack.Screen name="questionpage" component={QuestionPage} />
          <Stack.Screen name="submitquiz" component={SubmitQuiz} />


          <Stack.Screen name="cart" component={Cart}
            options={{
              headerShown: true,
              headerTitle: 'My Cart',
              headerStyle: {
                backgroundColor: COLOR.col3,
              },
              headerTintColor: COLOR.col1,
            }}
          />



          <Stack.Screen name="allorders" component={AllOrders}
            options={{
              headerShown: true,
              headerTitle: 'My Orders',
              headerStyle: {
                backgroundColor: COLOR.col3,
              },
              headerTintColor: COLOR.col1,
            }}
          />
          <Stack.Screen name="orderpage" component={OrderPage}
            options={{
              headerShown: true,
              headerTitle: '',
              headerStyle: {
                backgroundColor: COLOR.col3,
              },
              headerTintColor: COLOR.col1,
            }}
          />
          <Stack.Screen name="mycourses" component={MyCourses}
          />



          <Stack.Screen name="testscorespage" component={TestScoresPage}
            options={{
              headerShown: true,
              headerTitle: 'Test Scores',
              headerStyle: {
                backgroundColor: COLOR.col3,
              },
              headerTintColor: COLOR.col1,
            }}
          />


          <Stack.Screen name="testscoresingle" component={TestScoreSingle}
            options={{
              headerShown: true,
              headerTitle: 'Test Scores',
              headerStyle: {
                backgroundColor: COLOR.col3,
              },
              headerTintColor: COLOR.col1,
            }}
          />
        </Stack.Navigator>
      }
    </NavigationContainer>
  )
}

export default MainNavigator

const styles = StyleSheet.create({})
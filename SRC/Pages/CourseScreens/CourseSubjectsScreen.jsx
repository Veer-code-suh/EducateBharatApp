import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Image } from 'react-native-elements';
import { COLOR, windowWidth } from '../../Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { BACKEND_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Toast } from 'react-native-toast-notifications';

const CourseSubjectsScreen = ({ route }) => {
  const navigation = useNavigation();
  const [isDemo, setIsDemo] = useState(null);

  const { course } = route.params;

  const [thiscourse, setThisCourse] = useState({
    ...course,
  });

  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Subjects'); // Tab toggle state

  const fetchCourseQnaData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/courseqnabycourseid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course._id }),
      });
      const data = await response.json();
      if (response.ok) {
        setThisCourse({
          ...thiscourse,
          ...data.course,
        });
      } else {
        console.error('Failed to fetch course data:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const [user, setUser] = React.useState({})

  React.useEffect(() => {

    getUserFromToken()
  }, [])

  const getUserFromToken = async () => {
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
        if (data.error) {
          Toast.show(data.error, {
            type: "danger",
          });

        }
        else {
          console.log('isPurchased ', course)
          setUser(data.userdata)

          if (data.userdata.coursePurchased.includes(course._id)) {
            setIsDemo(false);
            // purchased
          }
          else if (parseInt(course.coursePrice, 10) == 0) {
            setIsDemo(false);
          }
          else {
            setIsDemo(true);
            // not purchased
          }
        }
      })
  }

  useEffect(() => {
    fetchCourseQnaData();
  }, [course._id]);



  const openQuiz = (quiz) => {
    const courseData = { courseId: thiscourse._id, courseName: thiscourse.courseName };



    if (quiz.access != 'PAID' || isDemo == false) {
      navigation.navigate('CourseQuizScreen', {
        course: courseData, quiz, quizType: 'course'
      });
    }
    else {
      Toast.show('Please purchase this course to unlock the quiz')
    }
  }

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topbar}>
        <Ionicons
          name="return-up-back-outline"
          size={20}
          style={styles.backbtn}
          onPress={() => navigation.goBack()}
        />
      </View>

      {/* Course Header */}
      <View style={styles.c1}>
        {
          course.courseImage && <Image source={{ uri: course.courseImage }} style={styles.image} />
        }
        <Text style={styles.courseName}>{course.courseName}</Text>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Subjects' && styles.activeTab]}
          onPress={() => setSelectedTab('Subjects')}
        >
          <Text style={[styles.tabText, selectedTab === 'Subjects' && styles.activeTabText]}>Subjects</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Quizzes' && styles.activeTab]}
          onPress={() => setSelectedTab('Quizzes')}
        >
          <Text style={[styles.tabText, selectedTab === 'Quizzes' && styles.activeTabText]}>Quizzes</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {loading ? (
          <ActivityIndicator size={20} color={COLOR.col6} />
        ) : selectedTab === 'Subjects' ? (
          thiscourse?.courseSubjects?.length > 0 ? (
            <View style={styles.subjectsList}>
              {thiscourse.courseSubjects.map((subject) => (
                <TouchableOpacity
                  style={styles.subjectName}
                  key={subject._id}
                  onPress={() =>
                    navigation.navigate('CourseInsideSubjectScreen', {
                      course: {
                        courseId: course._id,
                        courseName: course.courseName,
                        selectedSubject: subject,
                      },
                    })
                  }
                >
                  <Text style={styles.subjectNameText}>{subject.subjectName}</Text>
                  <AntDesign name="caretright" size={10} style={styles.subjectNameText} />
                </TouchableOpacity>
              ))}
            </View>
          ) : (

            <Text style={{
              textAlign: 'center',
              color: COLOR.col2,
              fontSize:12

            }}>No Subjects Found</Text>

          )
        ) : thiscourse?.courseQuizzes?.length > 0 ? (
          <View style={styles.quizzesList}>
            {thiscourse.courseQuizzes.map((quiz) => (
              <TouchableOpacity
                style={styles.quizName}
                key={quiz._id}
                onPress={() =>
                  openQuiz(quiz)
                }
              >
                <Text style={styles.quizNameText}>{quiz.courseQuizName}</Text>
                {isDemo && quiz.access == "PAID" ? (
                  <Ionicons name="lock-closed" size={20} color={COLOR.col3} style={styles.icon} />
                ) : (
                  <Ionicons name="eye" size={20} color={COLOR.col3} style={styles.icon} />
                )}

              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={{
            textAlign: 'center',
            color: COLOR.col2,
            fontSize:12

          }}>No Quizzes Found</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default CourseSubjectsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    width: windowWidth,
    zIndex: 1,
    backgroundColor: COLOR.col3
  },
  backbtn: {
    color: COLOR.col1,
    marginRight: 10,
  },
  c1: {
    margin: 10,
    overflow: 'hidden',
    flexDirection: 'row'
  },
  image: {
    width: 50,
    aspectRatio: '16/9'
  },
  courseName: {
    fontSize: 12,
    fontWeight: '400',
    flex: 1,
    padding: 10,
    color: COLOR.col3,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeTab: {
    borderColor: COLOR.col3,
  },
  tabText: {
    color: COLOR.col2,
  },
  activeTabText: {
    color: COLOR.col3,
    fontWeight: 'bold',
  },
  content: {
    padding: 10,
  },
  subjectsList: {
    marginBottom: 20,
  },
  subjectName: {
    backgroundColor: COLOR.col3,
    marginBottom: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subjectNameText: {
    color: COLOR.col1,
    fontSize: 12,
  },
  quizzesList: {
    marginBottom: 20,
  },
  quizName: {
    backgroundColor: COLOR.col3,
    marginBottom: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quizNameText: {
    color: COLOR.col1,
    fontSize: 12,
    flex: 1
  },
  quizAccess: {
    color: COLOR.col3,
    fontSize: 12,
    marginRight: 10,
  },
});

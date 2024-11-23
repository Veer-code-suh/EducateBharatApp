import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { COLOR } from '../../Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from "@env";
import { Toast } from 'react-native-toast-notifications';

const CourseInsideSubjectScreen = ({ route }) => {
  const navigation = useNavigation();

  const { courseName, selectedSubject, courseId, coursePrice } = route.params?.course || {};

  const [isDemo, setIsDemo] = useState(null);
  const [selectedTab, setSelectedTab] = useState('Chapters'); // Tab toggle state
  const [chapters, setChapters] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  const [loading, setLoading] = useState(false);


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
          console.log('isPurchased ', data.userdata.coursePurchased.includes(courseId))
          setUser(data.userdata)

          if (data.userdata.coursePurchased.includes(courseId)) {
            setIsDemo(false);
            // purchased
          }
          else if(parseInt(coursePrice, 10) == 0){
            setIsDemo(false);
          }
          else {
            setIsDemo(true);
            // not purchased
          }
        }
      })
  }

  const getChaptersAndQuizzesOfSubject = async () => {

    try {
      setLoading(true);
      let token = await AsyncStorage.getItem("token");
      const response = await fetch(BACKEND_URL + "/getChaptersAndQuizesBySubjectId", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          subjectId: selectedSubject._id
        })
      });

      const data = await response.json();
      if (data.error) {
        Toast.show(data.error, { type: "danger" });
      } else {
        setChapters(data.subject.subjectChapters);
        setQuizzes(data.subject.subjectQuizzes);
      }
    } catch (error) {
      Toast.show("Failed to load data", { type: "danger" });
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getChaptersAndQuizzesOfSubject();
  }, [selectedSubject._id]);


  const openChapter = (chapter) => {
    const course = { courseId, courseName };
    const subject = selectedSubject;

    navigation.navigate('CourseChapterScreen', { course, subject, chapter });
  }

  const openQuiz = (quiz) => {
    const course = { courseId, courseName };
    const subject = selectedSubject;


    if (quiz.access != 'PAID' || isDemo == false) {
      navigation.navigate('CourseQuizScreen', {
        course, subject, quiz, quizType: 'subject'
      });
    }
    else {
      Toast.show('Please purchase this course to unlock the quiz')
    }
  }

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topbar}>
        <Ionicons
          name="return-up-back-outline"
          size={20}
          style={styles.backbtn}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.textContainer}>

          <Text style={styles.previousText}>
            {courseName} <AntDesign name="right" size={10} color={COLOR.col1} /> {selectedSubject.subjectName}
          </Text>
        </View>
      </View>

      {/* Tab selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Chapters' && styles.activeTab]}
          onPress={() => setSelectedTab('Chapters')}
        >
          <Text style={[styles.tabText, selectedTab === 'Chapters' && styles.activeTabText]}>Chapters</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Quizzes' && styles.activeTab]}
          onPress={() => setSelectedTab('Quizzes')}
        >
          <Text style={[styles.tabText, selectedTab === 'Quizzes' && styles.activeTabText]}>Quizzes</Text>
        </TouchableOpacity>
      </View>


      {
        loading ?

          <ActivityIndicator color={COLOR.col3} size={20} />

          :
          <ScrollView style={styles.content}>
            {selectedTab === 'Chapters' ? (
              chapters.length > 0 ? (
                chapters.map((chapter) => (
                  <TouchableOpacity key={chapter._id} style={styles.quizItem} onPress={() => openChapter(chapter)}>
                    <Text style={styles.itemText}>{chapter.chapterName.trim()}</Text>
                    <AntDesign name="caretright" size={10} color={COLOR.col1} style={styles.icon} />
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noDataText}>No Chapters Found</Text>
              )
            ) : (
              quizzes.length > 0 ? (
                quizzes.map((quiz) => (
                  <TouchableOpacity key={quiz._id} style={styles.quizItem}
                    onPress={() => openQuiz(quiz)}
                  >
                    <Text style={styles.itemText}>{quiz.subjectQuizName}</Text>
                    {isDemo && quiz.access == "PAID" ? (
                      <Ionicons name="lock-closed" size={20} color={COLOR.col3} style={styles.icon} />
                    ) : (
                      <Ionicons name="eye" size={20} color={COLOR.col3} style={styles.icon} />
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noDataText}>No Quizzes Found</Text>
              )
            )}
          </ScrollView>
      }
    </View>
  );
};

export default CourseInsideSubjectScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: COLOR.col6,
  },
  backbtn: {
    color: COLOR.col1,
    marginRight: 10,
  },
  textContainer: {
    flex: 1, // Allow Text to take available width
  },
  previousText: {
    color: COLOR.col1,
    fontSize: 10,
    flexWrap: 'wrap', // Wrap text to the next line
    flexShrink: 1, // Prevents text from overflowing
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLOR.col3,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: COLOR.col3,
  },
  activeTab: {
    borderColor: COLOR.col1,
  },
  tabText: {
    color: COLOR.col1,
  },
  activeTabText: {
    color: COLOR.col1,
    fontWeight: 'bold',
  },
  content: {
    padding: 10,
  },
  quizItem: {
    backgroundColor: COLOR.col3,
    marginBottom: 10,
    padding: 10,
    color: COLOR.col1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  itemText: {
    color: COLOR.col1,
    fontSize: 12,
    flex: 1,
  },
  noDataText: {
    textAlign: 'center',
    color: COLOR.col3,
    marginTop: 20,
  },
  icon: {
    marginLeft: 10,
    color: 'white',

  },
});

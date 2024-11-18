import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from 'react-native-vector-icons/Entypo';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { COLOR } from '../../Constants';
import { Toast } from 'react-native-toast-notifications';
import { BACKEND_URL } from "@env";

const CourseChapterScreen = ({ route }) => {
  const { course, subject, chapter } = route.params;
  const [isDemo, setIsDemo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [thisChapter, setThisChapter] = useState(null);


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
          console.log('isPurchased ', data.userdata.coursePurchased.includes(course.courseId))
          setUser(data.userdata)

          if (data.userdata.coursePurchased.includes(course.courseId)) {
            setIsDemo(false);
            // purchased
          }
          else if(parseInt(course.coursePrice, 10) == 0){
            setIsDemo(false);
          }
          else {
            setIsDemo(true);
            // not purchased
          }
        }
      })
  }

  const getChapterData = async (chapter) => {
    const token = await AsyncStorage.getItem('token');
    fetch(BACKEND_URL + '/getChapterById', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({ chapterId: chapter?._id })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          Toast.show(data.error, {
            type: 'danger',
            duration: 1000
          });
        } else {
          setThisChapter(data.chapter);
        }
      });
  };

  useEffect(() => {
    getChapterData(chapter);
  }, [chapter]);

  return (
    <View style={styles.container}>
      <View style={styles.topbar}>
        <Ionicons
          name="return-up-back-outline"
          size={20}
          style={styles.backbtn}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.textContainer}>
          <Text style={styles.previousText}>
            {course.courseName}{' '}
            <AntDesign name="right" size={10} color={COLOR.col4} />{' '}
            {subject.subjectName}{' '}
            <AntDesign name="right" size={10} color={COLOR.col4} />{' '}
            {chapter.chapterName}
          </Text>
        </View>
      </View>

      {thisChapter ? (
        <View style={styles.chapterDetails}>
          <Text style={styles.chapterTitle}>{thisChapter.chapterName}</Text>

          {/* Videos Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Lectures</Text>
              <Entypo name="video" size={20} color={COLOR.col1} />
            </View>
            {thisChapter.chapterVideos.length > 0 ? (
              thisChapter.chapterVideos.map((video, index) => (
                <TouchableOpacity key={index} style={styles.sectionCard}
                  onPress={() => {
                    (isDemo == false || video.access == 'FREE') && navigation.navigate('VideoPlayerScreen', { videoUrl: video.videoUrl });
                  }}
                >
                  <Text style={styles.sectionCardText}>{video.videoName}</Text>

                  {
                    isDemo && video.access == 'PAID' ?

                      <Ionicons name="lock-closed" size={30} color="black" style={styles.sectionCardIcon}

                      />
                      :
                      <Entypo name="eye" size={30} color="black" style={styles.sectionCardIcon}

                      />
                  }
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.sectionCard1}>
                <Text style={styles.sectionCardText}>No Lectures</Text>
              </View>
            )}
          </View>

          {/* Notes Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Notes</Text>
              <SimpleLineIcons name="notebook" size={20} color={COLOR.col1} />
            </View>
            {thisChapter.chapterNotes.length > 0 ? (
              thisChapter.chapterNotes.map((note, index) => {
                return (
                  <TouchableOpacity key={index} style={styles.sectionCard}
                    onPress={() => {
                      (isDemo == false || note.access == 'FREE') && navigation.navigate('PdfViewerScreen', { pdfUrl: note.notesUrl });
                    }}
                  >
                    <Text style={styles.sectionCardText}>{note.notesName}</Text>
                    {
                      isDemo && note.access == 'PAID' ?

                        <Ionicons name="lock-closed" size={30} color="black" style={styles.sectionCardIcon}

                        />
                        :
                        <Entypo name="eye" size={30} color="black" style={styles.sectionCardIcon}

                        />
                    }
                  </TouchableOpacity>
                )
              })
            ) : (
              <View style={styles.sectionCard1}>
                <Text style={styles.sectionCardText}>No Notes</Text>
              </View>
            )}
          </View>

          {/* Quizzes Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Quizzes</Text>
              <AntDesign name="rocket1" size={20} color={COLOR.col1} />
            </View>
            {thisChapter.chapterQuizzes.length > 0 ? (
              thisChapter.chapterQuizzes.map((quiz, index) => (
                <TouchableOpacity key={index} style={styles.sectionCard}
                  onPress={() => {
                    (isDemo == false || quiz.access == 'FREE') && navigation.navigate('CourseQuizScreen', {
                      subject: subject,
                      chapter: chapter,
                      course: course,
                      quiz: quiz,
                      quizType: 'chapter'
                    });
                  }}
                >
                  <Text style={styles.sectionCardText}>{quiz.chapterQuizName}</Text>
                  {
                    isDemo && quiz.access == 'PAID' ?

                      <Ionicons name="lock-closed" size={30} color="black" style={styles.sectionCardIcon}

                      />
                      :
                      <Entypo name="eye" size={30} color="black" style={styles.sectionCardIcon}

                      />
                  }
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.sectionCard1}>
                <Text style={styles.sectionCardText}>No Quizzes</Text>
              </View>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={COLOR.col4} size={30}/>
          <Text style={styles.loadingText}>Loading chapter details...</Text>
        </View>
      )}
    </View>
  );
};

export default CourseChapterScreen;

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
    color: COLOR.col4,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  previousText: {
    color: COLOR.col1,
    fontSize: 10,
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  chapterDetails: {
    padding: 10,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLOR.col4,
  },
  section: {
    marginVertical: 10,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingHorizontal: 5,
    marginBottom: 10
  },
  sectionHeaderText: {
    fontSize: 16,
    color: COLOR.col1,
    flex: 1
  },
  sectionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: COLOR.col5,
    marginVertical: 5,
    borderRadius: 5,
  },
  sectionCard1:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: COLOR.col3,
    marginVertical: 5,
    borderRadius: 5,
  },
  sectionCardText: {
    fontSize: 12,
    color: COLOR.col1,
    flex: 1
  },

  sectionCardIcon: {
    marginLeft: 10,
    fontSize: 20,
    color: COLOR.col1,
  },
  loadingContainer:{
    flex:1,
    justifyContent:'center'
  },
  loadingText: {
    textAlign: 'center',
    color: COLOR.col3,
  },
});

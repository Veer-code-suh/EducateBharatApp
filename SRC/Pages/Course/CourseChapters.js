import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import courseImage from "../../Assets/Course/courseimage.png"
import { Image } from 'react-native-elements'
import { COLOR, windowWidth } from '../../Constants'
import { ScrollView } from 'react-native-gesture-handler'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { BACKEND_URL } from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage'

const CourseChapters = ({ navigation, route }) => {
  const { course } = route.params

  const [thiscourse, setThisCourse] = useState(course)


  const getFullCourse = async (subjects) => {
    let token = await AsyncStorage.getItem("token")
    let updated = []

    subjects.map((subject, index) => {
      // [{"_id": "647268ccd41014252c389a60", "subjectName": "Biology"}]

      fetch(BACKEND_URL + "/getChaptersBySubjectId", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          subjectId: subject._id
        })

      })
        .then(res => res.json())
        .then(data => {
          // console.log(data)
          if (data.error) {
            toast.show(data.error, {
              type: "danger",
            });

          }
          else {
            updated.push(data.subject)
            setThisCourse({ ...thiscourse, courseSubjects: updated })
            console.log(thiscourse)
          }
        })
    })
  }

  React.useEffect(() => {
    if (course.courseSubjects.length > 0) {
      getFullCourse(course.courseSubjects)
    }

    // {"course": {"__v": 6, "_id": "64724afc1024d70b4701aca6", "courseDescription": "The National Testing Agency (NTA) conducts the National Eligibility cum Entrance Test (NEET) exam in 13 languages. The single national-level undergraduate medical entrance exam, NEET UG held every year for admission to 645 medical, 318 dental, 914 AYUSH, and 47 BVSc and AH colleges in India.", "courseImage": "/public\\files\\1685211900751.jpg", "courseName": "NEET", "coursePrice": "7555", "coursePriceCurrency": "INR", "courseQuizzes": [[Object]], "courseRating": "0", "courseReviews": [], "courseSubjects": [[Object]], "createdAt": "2023-05-27T18:25:00.830Z", "updatedAt": "2023-05-28T00:59:13.592Z"}, "message": "success"}
  }, [])

  React.useEffect(() => {
    console.log(' Subject quiz ' ,thiscourse?.courseSubjects[2]?.subjectQuizzes)
  }, [thiscourse])
  // console.log(course.courseSubjects)

  // {"__v": 2, "_id": "6472490d57f54e90ae6b2fc3", "courseDescription": "Joint Entrance Examination – Main, formerly All India Engineering Entrance Examination, is an Indian standardised computer-based test for admission to various technical undergraduate programs in engineering, architecture, and planning across colleges in India.", "courseImage": "/public\\files\\1685215537585.png", "courseName": "JEE MAINS 2024", "coursePrice": "4999", "coursePriceCurrency": "INR", "courseQuizzes": [], "courseRating": "0", "courseReviews": [], "courseSubjects": [{"_id": "64725e2b2b5e001d443473f1", "subjectName": "Maths"}, {"_id": "64726125d41014252c389a38", "subjectName": "Chemistry"}], "createdAt": "2023-05-27T18:16:45.518Z", "updatedAt": "2023-05-27T19:59:33.425Z"}

  const [activeSubject, setActiveSubject] = useState(null)

  return (
    <ScrollView>
      <View style={styles.c1}>
        <Image source={{ uri: course.courseImage }} style={styles.image} />
        <Text style={styles.courseName}>{course.courseName}</Text>
      </View>

    

      
        {
          thiscourse.courseSubjects.map((subject, index) => {
            return (
              <View style={styles.subjectout} key={index}>
                {/* [{"_id": "647268ccd41014252c389a60", "subjectName": "Biology"}] */}

                <View key={index} style={styles.subject}>
                  <Text style={styles.subjectName}>{subject.subjectName}</Text>
                  {
                    activeSubject === index ?
                      <AntDesign name="up" size={20} style={styles.icon} onPress={() => setActiveSubject(null)} />
                      :
                      <AntDesign name="down" size={20} style={styles.icon} onPress={() => {
                        setActiveSubject(index)
                        // console.log(subject)
                      }} />
                  }
                </View>

                {
                  activeSubject === index &&
                  <View style={styles.chapters}>
                    {
                      subject.subjectChapters.map((chapter, index) => {
                        return (
                          <View key={index} style={styles.chapter}>
                            <Fontisto name="radio-btn-passive" size={20} style={styles.icon1}
                              onPress={
                                () => {
                                  navigation.navigate('chapterspecific', {
                                    chapter: chapter,
                                    course: course
                                  })
                                }
                              }
                            />
                            <Text style={styles.chapterName}
                            onPress={
                              () => {
                                navigation.navigate('chapterspecific', {
                                  chapter: chapter,
                                  course: course
                                })
                              }
                            }
                            >{chapter.chapterName}</Text>
                          </View>
                        )
                      })
                    }

                    <Text 
                    style={{
                      fontSize: 13,
                      fontWeight: 'bold',
                      color: COLOR.col1,
                      marginTop: 10,
                      marginBottom: 0,
                      backgroundColor: COLOR.col2,
                      padding: 10,
                      borderRadius: 0
                    }}
                    >Subject Quiz</Text>

                    {
                      subject.subjectQuizzes.length>0 ? subject.subjectQuizzes.map((quiz, index) => {
                         return (
                          <View key={index} style={styles.chapter}>
                            <Fontisto name="radio-btn-passive" size={20} style={styles.icon1}
                              onPress={
                                () => {
                                  navigation.navigate('questionpage', {
                                    quiz: quiz,
                                    initial: 0,
                                    quizType: 'subject',
                                    course
                                  })
                                }
                              }
                            />

                            <Text style={styles.chapterName}
                            onPress={
                              () => {
                                navigation.navigate('questionpage', {
                                  quiz: quiz,
                                  initial: 0,
                                  quizType: 'subject',
                                  course
                                })
                              }
                            }
                            >{quiz.subjectQuizName}</Text>
                          </View>
                         )
                      })
                      :
                      <Text>No Quiz Available</Text>
                    }

                  </View>
                }
              </View>
            )
          })
        }

        {/* courseQuizzes */}
        {course.courseQuizzes.length>0 &&  <Text style={styles.heading}>Full Tests</Text>}
          {
            course.courseQuizzes.length>0 && course.courseQuizzes.map((quiz, index) => {
              return (
                <View key={index} style={styles.subjectout}>
                  <View style={styles.subject}>
                    <Text style={styles.subjectName}>{quiz.courseQuizName}</Text>
                    <AntDesign name="right" size={20} style={styles.icon} onPress={() => {
                      navigation.navigate('questionpage', { quiz: quiz, initial: 0 ,quizType: 'fullquiz',course})
                    }} />
                  </View>
                </View>
              )
            })
          }

          <View style={{height: 100}}></View>
    </ScrollView>
  )
}

export default CourseChapters

const styles = StyleSheet.create({
  c1: {
    margin: 10,
    borderRadius: 10,
    // elevation: 5,
    borderColor: COLOR.col4,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: COLOR.col4,
  },
  heading: {
    fontSize: 20,
    fontWeight: '500',
    paddingHorizontal: 20,
    marginTop: 20,
    color: COLOR.col3,

  },
  image: {
    width: '100%',
    height: 200,
  },
  courseName: {
    fontSize: 20,
    fontWeight: '500',
    padding: 20,
    color: COLOR.col3,
  },
  subjectout: {
    margin: 10,
    borderRadius: 30,
    // elevation: 5,
    // borderColor: COLOR.col4,
    // borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: COLOR.col3
  },
  subject: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingVertical: 10,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLOR.col1,
  },
  icon: {
    // backgroundColor: 'red',
    color: COLOR.col1,
  },
  chapters: {
    backgroundColor: COLOR.col4,
    padding: 20,
    gap: 20,
  },
  chapter: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  chapterName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#545454',
  },
  icon1: {
    // backgroundColor: 'red',
    color: COLOR.col3,
    fontSize: 20,
    borderRadius: 50,
  },
  nodata: {
    fontSize: 16,
    fontWeight: '500',
    color: COLOR.col4,
    textAlign: 'center',
    marginVertical: 20,
  }
}) 
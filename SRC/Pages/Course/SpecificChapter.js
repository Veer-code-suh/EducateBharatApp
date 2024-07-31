import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { ScrollView } from 'react-native-gesture-handler'
import { COLOR } from '../../Constants'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { BACKEND_URL } from "@env";

import AsyncStorage from '@react-native-async-storage/async-storage'
import { useToast } from 'react-native-toast-notifications'

const SpecificChapter = ({ navigation, route }) => {
  const toast = useToast()
  const { chapter, course } = route.params
  console.log(chapter)

  const [thisChapter, setThisChapter] = React.useState(null)
  // const chapter = {
  //   name: 'Physical World and Measurement',
  //   videos: [
  //     {
  //       name: 'Video 1',
  //       url: ""
  //     },
  //     {
  //       name: 'Video 2',
  //       url: ""
  //     },
  //     {
  //       name: 'Video 3',
  //       url: ""
  //     }
  //   ],
  //   notes: [
  //     {
  //       name: 'Note 1',
  //       url: ""
  //     },
  //     {
  //       name: 'Note 2',
  //       url: ""
  //     }
  //   ],
  //   quizzes: [
  //     {
  //       name: 'Quiz 1',
  //       url: "",
  //       data: [
  //         {
  //           "question": "What is the capital of France?",
  //           "options": ["London", "Paris", "Berlin", "Rome"],
  //           "answer": 1,
  //           "userAnswer": null,
  //         },
  //         {
  //           "question": "Which planet is known as the 'Red Planet'?",
  //           "options": ["Mars", "Venus", "Jupiter", "Mercury"],
  //           "answer": 0,
  //           "userAnswer": null,
  //         },
  //         {
  //           "question": "What is the chemical symbol for gold?",
  //           "options": ["Ag", "Au", "Cu", "Fe"],
  //           "answer": 1,
  //           "userAnswer": null,

  //         },
  //         {
  //           "question": "Who painted the Mona Lisa?",
  //           "options": ["Pablo Picasso", "Vincent van Gogh", "Leonardo da Vinci", "Claude Monet"],
  //           "answer": 2,
  //           "userAnswer": null,

  //         },
  //         {
  //           "question": "Which country won the 2018 FIFA World Cup?",
  //           "options": ["Brazil", "Germany", "France", "Argentina"],
  //           "answer": 2,
  //           "userAnswer": null,

  //         },
  //         {
  //           "question": "What is the largest planet in our solar system?",
  //           "options": ["Mars", "Venus", "Jupiter", "Mercury"],
  //           "answer": 2,
  //           "userAnswer": null,

  //         },
  //         {
  //           "question": "Who wrote the play 'Romeo and Juliet'?",
  //           "options": ["William Shakespeare", "Jane Austen", "George Orwell", "Charles Dickens"],
  //           "answer": 0,
  //           "userAnswer": null,

  //         },
  //         {
  //           "question": "Which animal is known as the 'King of the Jungle'?",
  //           "options": ["Lion", "Elephant", "Giraffe", "Tiger"],
  //           "answer": 0,
  //           "userAnswer": null,

  //         },
  //         {
  //           "question": "What is the symbol for the chemical element oxygen?",
  //           "options": ["O", "O2", "OH", "Om"],
  //           "answer": 0,
  //           "userAnswer": null,

  //         },
  //         {
  //           "question": "Who discovered the theory of relativity?",
  //           "options": ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Nikola Tesla"],
  //           "answer": 1,
  //           "userAnswer": null,

  //         }
  //       ]
  //     },
  //     {
  //       name: 'Quiz 2',
  //       url: "",
  //       data: [
  //         {
  //           "question": "What is the capital of France?",
  //           "options": ["London", "Paris", "Berlin", "Rome"],
  //           "answer": 1,
  //           "userAnswer": null,
  //         },
  //         {
  //           "question": "Which planet is known as the 'Red Planet'?",
  //           "options": ["Mars", "Venus", "Jupiter", "Mercury"],
  //           "answer": 0,
  //           "userAnswer": null,
  //         },
  //         {
  //           "question": "What is the chemical symbol for gold?",
  //           "options": ["Ag", "Au", "Cu", "Fe"],
  //           "answer": 1,
  //           "userAnswer": null,

  //         },
  //         {
  //           "question": "Who painted the Mona Lisa?",
  //           "options": ["Pablo Picasso", "Vincent van Gogh", "Leonardo da Vinci", "Claude Monet"],
  //           "answer": 2,
  //           "userAnswer": null,

  //         },
  //         {
  //           "question": "Which country won the 2018 FIFA World Cup?",
  //           "options": ["Brazil", "Germany", "France", "Argentina"],
  //           "answer": 2,
  //           "userAnswer": null,

  //         },
  //         {
  //           "question": "What is the largest planet in our solar system?",
  //           "options": ["Mars", "Venus", "Jupiter", "Mercury"],
  //           "answer": 2,
  //           "userAnswer": null,

  //         },
  //         {
  //           "question": "Who wrote the play 'Romeo and Juliet'?",
  //           "options": ["William Shakespeare", "Jane Austen", "George Orwell", "Charles Dickens"],
  //           "answer": 0,
  //           "userAnswer": null,

  //         },
  //         {
  //           "question": "Which animal is known as the 'King of the Jungle'?",
  //           "options": ["Lion", "Elephant", "Giraffe", "Tiger"],
  //           "answer": 0,
  //           "userAnswer": null,

  //         },
  //         {
  //           "question": "What is the symbol for the chemical element oxygen?",
  //           "options": ["O", "O2", "OH", "Om"],
  //           "answer": 0,
  //           "userAnswer": null,

  //         },
  //         {
  //           "question": "Who discovered the theory of relativity?",
  //           "options": ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Nikola Tesla"],
  //           "answer": 1,
  //           "userAnswer": null,

  //         }
  //       ]
  //     }
  //   ],
  // }

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
        console.log(data?.chapter);
//        
        if (data.error) {
          toast.show(data.error, {
            type: 'danger',
            duration: 1000
          })

        }

        else{
           setThisChapter(data.chapter);
        }
      })
  }

  React.useEffect(() => {
    getChapterData(chapter);
  }, [chapter])
  return (
    <ScrollView
      style={styles.container}
    >
      <View style={styles.topbar}>
        <Ionicons name="return-up-back-outline" size={30} style={styles.backbtn}
          onPress={() => navigation.navigate('coursechapters',{
            course:course
          })}
        />
      </View>
      {/* <Text style={styles.head}>Chapter</Text> */}
      <Text style={styles.chapter}>{thisChapter?.name}</Text>

      <View style={styles.c1}>
        <View style={styles.c11}>
          <Text style={styles.c12t}>Lectures</Text>
          <Entypo name="video" size={20} color="black" />
        </View>
        {/* {thisChapter?.chapterVideos.map((video, index) => {
          return (
            <View key={index} style={styles.c12}>
              <Text style={styles.c12t}>{video.name}</Text>
              <Entypo name="controller-play" size={30} color="black" style={styles.c12i}
                onPress={() => {
                  navigation.navigate('videoplayer')
                }}
              />
            </View>
          )
        })} */}

        {
          thisChapter?.chapterVideos.length>0 ? thisChapter?.chapterVideos.map((video, index) => {
            return (
              <View key={index} style={styles.c12}>
                <Text style={styles.c12t}>{video.videoName}</Text>
                <Entypo name="controller-play" size={30} color="black" style={styles.c12i}
                  onPress={() => {
                    navigation.navigate('videoplayer', { videoUrl: video.videoUrl })
                  }}
                />
              </View>
            )
          })
            :
            <View style={styles.c121}
            >
              <Text style={styles.c12t}>No Lectures</Text>
            </View>

        }
      </View>

      <View style={styles.c1}>
        <View style={styles.c11}>
          <Text style={styles.c12t}>Notes</Text>
          <SimpleLineIcons name="notebook" size={20} color="black" />
        </View>
        {/* {thisChapter?.notes.map((note, index) => {
          return (
            <View key={index} style={styles.c12}>
              <Text style={styles.c12t}>{note.name}</Text>
              <Entypo name="eye" size={30} color="black" style={styles.c12i}
                onPress={() => {
                  navigation.navigate('pdfviewer')
                }}
              />
            </View>
          )
        })} */}

        {
          thisChapter?.chapterNotes.length>0 ? thisChapter?.chapterNotes.map((note, index) => {
            return (
              <View key={index} style={styles.c12}>
                <Text style={styles.c12t}>{note.notesName}</Text>
                <Entypo name="eye" size={30} color="black" style={styles.c12i}
                  onPress={() => {
                    navigation.navigate('pdfviewer', { pdfUrl: note.notesUrl })
                  }}
                />
              </View>
            )
          }
          )
          :
          <View style={styles.c121}
          >
            <Text style={styles.c12t}>No Notes</Text>
          </View>
        }
      </View>

      <View style={styles.c1}>
        <View style={styles.c11}>
          <Text style={styles.c12t}>Quizzes</Text>
          <AntDesign name="rocket1" size={20} color="black" />
        </View>
        {/* {thisChapter?.quizzes.map((quiz, index) => {
          return (
            <View key={index} style={styles.c12}>
              <Text style={styles.c12t}>{quiz.name}</Text>
              <Fontisto name="hourglass-start" size={30} color="black" style={styles.c12i}
                onPress={() => {
                  navigation.navigate('questionpage', { quiz: quiz, initial: 0 })
                }}
              />
            </View>
          )
        })} */}
        {
          thisChapter?.chapterQuizzes.length>0 ? thisChapter?.chapterQuizzes.map((quiz, index) => {
            return (
              <View key={index} style={styles.c12}>
                <Text style={styles.c12t}>{quiz.chapterQuizName}</Text>
                <Fontisto name="hourglass-start" size={30} color="black" style={styles.c12i}
                  onPress={() => {
                    navigation.navigate('questionpage', { quiz: quiz, initial: 0 , quizType: 'chapter' , chapter: chapter, course :course })
                    // navigation.navigate('questionpage', { quiz: quiz, initial: 0 ,quizType: 'fullquiz',course :course})
                  }}
                />

              </View>
            )
          })
          :
          <View style={styles.c121}
          >
            <Text style={styles.c12t}>No Quizzes</Text>
          </View>
        }
      </View>
    </ScrollView>
  )
}

export default SpecificChapter

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.col3
  },
  backbtn: {
    color: COLOR.col1,
    margin: 10
  },
  head: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 10,
    color: COLOR.col1
  },
  chapter: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    color: COLOR.col4,
    marginVertical: 20
  },
  c1: {
    margin: 10,
    borderRadius: 10,
    backgroundColor: COLOR.col4,
    paddingVertical: 10,
  },
  c11: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 5,
    gap: 10,
    flexDirection: 'row-reverse',
  },
  c12: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLOR.col1,
    margin: 5,
    borderRadius: 30,
  },
  c121: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLOR.col4,
    margin: 5,
    borderRadius: 30,
  },
  c12t: {
    fontSize: 12,
    fontWeight: '500',
    color: COLOR.col3
  },
  c12i: {
    backgroundColor: COLOR.col3,
    borderRadius: 30,
    padding: 5,
    color: COLOR.col1,
    fontSize: 20
  }
})
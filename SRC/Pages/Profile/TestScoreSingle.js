import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  quizname: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
    color: 'grey',
  },
  totalmarks: {
    fontSize: 16,
    margin: 10,
    color: 'grey',
  },
  yourscore: {
    fontSize: 16,
    margin: 10,
    color: 'grey',
  },
  questionno: {
    fontSize: 16,
    fontWeight: 'bold',
    margin: 10,
    color: 'grey',

  },
  question: {
    fontSize: 16,
    margin: 10,
    color: 'grey',

  },
  youranswer: {
    fontSize: 16,
    margin: 10,
    color: 'grey',

  },
  correctanswer: {
    fontSize: 16,
    margin: 10,
    color: 'grey',

  },
  marks: {
    fontSize: 16,
    margin: 10,
    color: 'grey',

  },
  qtn: {
    margin: 10,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    color: 'grey',

  }
});

const TestScoreSingle = ({ route }) => {
  const { quiz } = route.params
  console.log(quiz)

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.quizname}>Quiz Name: {quiz.courseQuizName}</Text>
      <Text style={styles.totalmarks}>Total Marks: {quiz.total}</Text>
      <Text style={styles.yourscore}>Your Score: {quiz.score}</Text>
      <View>
        {quiz?.quizData?.courseQuizQNA.map((question, index) => {
          return (
            <View key={index} style={styles.qtn}>
              <Text style={styles.questionno}>Question No: {index + 1}</Text>
              <Text style={styles.question}>Question: {question.questionName}</Text>
              <Text style={styles.youranswer}>Your Answer: {question.userAnswer}</Text>
              <Text style={styles.correctanswer}>Correct Answer: {question.questionAnswer}</Text>
              <Text style={styles.marks}>Marks: {question.questionMarks}</Text>
            </View>
          )
        })}
      </View>
    </ScrollView>
  )
}

export default TestScoreSingle
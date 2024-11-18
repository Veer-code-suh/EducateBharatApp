import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Linking, FlatList, ScrollView, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { COLOR } from '../../Constants';
import { BACKEND_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Pdf from 'react-native-pdf';
import Entypo from 'react-native-vector-icons/Entypo'
const TestScoresScreen = ({ route }) => {
  const { quiz } = route.params; // Get quizId from route params
  const [quizData, setQuizData] = useState(null); // State to store quiz data
  const [loading, setLoading] = useState(true); // State to handle loading indicator
  const [error, setError] = useState(null); // State to handle errors
  const { height } = Dimensions.get('window');

  const navigation = useNavigation();

  useEffect(() => {
    // Function to fetch quiz data using the quizId
    const fetchQuizData = async () => {
      const token = await AsyncStorage.getItem('token');
      setLoading(true);
      fetch(`${BACKEND_URL}/getquizbyid?quizId=${quiz.quizId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {

          setQuizData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setError('Failed to load quiz data');
          setLoading(false);
        });
    };

    fetchQuizData(); // Call the fetch function on component mount
  }, [quiz]); // Dependency array ensures this effect runs when quizId changes



  const renderQuestion = ({ item, index }) => (
    <View style={styles.questionCard}>
      <Text style={styles.questionTitle}>
        {index + 1}. {item.questionName} ({item.questionType})
      </Text>
      <Text style={styles.questionSubject}>Subject: {item.questionSubject}</Text>
      <Text style={styles.questionMarks}>Marks: {item.questionMarks}</Text>
      <Text style={styles.questionMarks}>Negative Marks: {item.questionNegativeMarks}</Text>

      {item.questionPdf && (
        <View style={[styles.pdfContainer, { height: height * 0.5 }]}>
          <Pdf
            trustAllCerts={false}
            source={{ uri: item.questionPdf, cache: true }}
            style={{ flex: 1 }}
          />
        </View>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Quiz Details</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLOR.col4} style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text> // Display error message if fetch fails
      ) : (
        <FlatList
          contentContainerStyle={styles.quizContainer}
          ListHeaderComponent={
            <View style={styles.quizInfo}>
              <View style={styles.table}>
                <View style={styles.row}>
                  <Text style={styles.cellLabel}>Quiz Name:</Text>
                  <Text style={styles.cellValue}>{quizData[`${quizData.quizType}QuizName`]}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.cellLabel}>Quiz Type:</Text>
                  <Text style={styles.cellValue}>{quizData.quizType}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.cellLabel}>Access:</Text>
                  <Text style={styles.cellValue}>{quizData.access}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.cellLabel}>Time Limit:</Text>
                  <Text style={styles.cellValue}>
                    {Math.floor(quizData.timeLimit / 60000)} min
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.cellLabel}>Score:</Text>
                  <Text style={styles.cellValue}>
                    {quizData.score !== null ? `${quizData.score}/${quizData.total}` : "Not Attempted"}
                  </Text>
                </View>
                <TouchableOpacity style={styles.row}
                  onPress={() => {
                    navigation.navigate('PdfViewerScreen', { pdfUrl: quizData.afterSubmissionPdf });
                  }}
                >
                  <Text style={styles.cellLabel}>Quiz Pdf:</Text>
                  {quizData.afterSubmissionPdf && (

                    <View style={styles.cellValue}>
                      <Entypo name="eye" size={20} color={COLOR.col1} 

                      />
                    </View>


                  )}
                </TouchableOpacity>
              </View>

              
            </View>
          }
          data={quizData.quizQuestions}
          renderItem={renderQuestion}
          keyExtractor={(item) => item._id}
          ListFooterComponent={
            <View style={styles.footer}></View> // Just to ensure the padding is correctly applied
          }
          style={{ paddingBottom: 100 }} // Padding at the bottom
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    paddingVertical: 10,
    backgroundColor: COLOR.col4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  topBarTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: COLOR.col1,
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    marginTop: 20,
  },
  quizContainer: {
    padding: 16,
  },
  quizInfo: {
    marginBottom: 20,
  },

  table: {
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  cellLabel: {
    flex: 1,
    fontWeight: 'bold',
    color: '#333',
  },
  cellValue: {
    flex: 2,
    color: '#555',
  },

  pdfButton: {
    backgroundColor: COLOR.col4,
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  pdfButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  questionCard: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: COLOR.col4,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLOR.col4,
    marginBottom: 8,
  },
  questionSubject: {
    fontSize: 14,
    color: COLOR.col1,
    marginBottom: 4,
  },
  questionMarks: {
    fontSize: 14,
    color: COLOR.col1,
    marginBottom: 8,
  },
  footer: {
    paddingBottom: 100, // Additional padding for the footer
  },
});

export default TestScoresScreen;

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert, TextInput, CheckBox, Dimensions, ScrollView } from 'react-native';
import { BACKEND_URL } from '@env';
import Pdf from 'react-native-pdf';
import { COLOR } from '../../Constants';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { color } from 'react-native-elements/dist/helpers';
import { Toast } from 'react-native-toast-notifications';

const CourseQuizQuestionScreen = ({ route }) => {
    const { quizData, course, subject, chapter, quizType } = route.params; // Extract quiz data from route props
    const navigation = useNavigation();
    const { height } = Dimensions.get('window');
    const [timeRemaining, setTimeRemaining] = useState({
        hr: Math.floor(quizData.timeLimit / 3600000), // Convert milliseconds to hours
        min: Math.floor((quizData.timeLimit % 3600000) / 60000), // Convert remaining ms to minutes
        sec: Math.floor((quizData.timeLimit % 60000) / 1000), // Convert remaining ms to seconds
    });

    const [quizDataFull, setQuizDataFull] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [loading, setLoading] = useState(true);

    // GET QUIZ QUESTIONS
    const getQuizQuestionsByQuizId = async () => {
        try {
            let token = await AsyncStorage.getItem("token");
            const response = await fetch(`${BACKEND_URL}/getQuizQuestionsData`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    quizId: quizData._id,
                    quizType: quizType,
                }),
            });

            const data = await response.json();
            if (data.error) {
                console.error("Error fetching quiz data:", data.error);
            } 
            else if(data.quizQuestions[`${quizType}QuizQNA`].length==0){
                Toast.show('0 Questions available')
                navigation.goBack();
            }
            else {
                setQuizDataFull({
                    ...quizData,
                    quizQuestions: data.quizQuestions[`${quizType}QuizQNA`],
                });
            }
        } catch (error) {
            console.error("Error fetching quiz data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timerInterval = setInterval(() => {
            setTimeRemaining((prevTime) => {
                if (prevTime.hr === 0 && prevTime.min === 0 && prevTime.sec === 0) {
                    clearInterval(timerInterval);
                    saveSubmission();

                    return { hr: 0, min: 0, sec: 0 }; // Time is up
                }
                let sec = prevTime.sec - 1;
                let min = prevTime.min;
                let hr = prevTime.hr;

                if (sec < 0) {
                    sec = 59;
                    min -= 1;
                }
                if (min < 0) {
                    min = 59;
                    hr -= 1;
                }
                return { hr, min, sec };
            });
        }, 1000);

        getQuizQuestionsByQuizId();

        return () => clearInterval(timerInterval);
    }, []);

    const showConfirmation = (message, onConfirm) => {
        Alert.alert(
            "Confirmation",
            message,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Yes",
                    onPress: onConfirm,
                },
            ],
            { cancelable: true }
        );
    };

    const handleExitQuiz = () => {
        showConfirmation("Are you sure you want to exit the quiz?", () => {
            navigation.goBack();
        });
    };

    const handleSubmitQuiz = () => {

        showConfirmation("Are you sure you want to submit the quiz?", () => {
            saveSubmission();
        });
    };

    const saveSubmission = async () => {
        const score = calculateScore();
        const total = getMaxMarks();
        try {
            let token = await AsyncStorage.getItem("token");

            // Make sure `QuizQNA` is defined properly, this line assumes that `QuizQNA` is the property name you want.
            const totalQuestions = quizDataFull.quizQuestions?.length; // Assuming quizQuestions is the property that holds the questions

            const response = await fetch(`${BACKEND_URL}/submitQuiz`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    quizId: quizDataFull._id,
                    quizType: quizType,
                    score: score,
                    total: total, // Corrected to use `totalQuestions`
                    quizData: quizDataFull,
                    createdAt: new Date(),
                }),
            });

            const data = await response.json();

            if (data.error) {
                Toast.show(data.error, {
                    type: "danger",
                });
            } else {
                console.log(data);
                navigation.navigate("CourseQuizSubmitScreen", {
                    score: score,
                    total: total,
                    chapter: chapter,
                    subject: subject,
                    course: course,
                    pdf: quizDataFull.afterSubmissionPdf,
                    quizType: quizType
                });
            }
        } catch (err) {
            console.log("Error in saving submission:", err);
        }
    };


    const handleAnswerChange = (questionId, answer) => {
        setUserAnswers((prev) => ({
            ...prev,
            [questionId]: answer,
        }));
    };
    const getMaxMarks = () => {
        let totalMarks = 0;
        quizDataFull?.quizQuestions?.forEach((question) => {
            totalMarks += question.questionMarks; // Add the marks for each question
        });
        return totalMarks;
    };

    const calculateScore = () => {
        let score = 0;
        quizDataFull?.quizQuestions?.forEach((question) => {
            const userAnswer = userAnswers[question._id];

            if (question.questionType === 'MCQ') {
                if (userAnswer !== undefined) {
                    // Answer selected
                    if (userAnswer === question.questionAnswer) {
                        score += question.questionMarks;  // Correct answer
                    } else {
                        score -= question.questionNegativeMarks;  // Incorrect answer
                    }
                }
                // If no answer is selected, do nothing (no marks deducted)
            } else if (question.questionType === 'Short Answer') {
                if (userAnswer !== undefined) {
                    // Answer entered
                    if (userAnswer === question.questionAnswer) {
                        score += question.questionMarks;  // Correct answer
                    } else {
                        score -= question.questionNegativeMarks;  // Incorrect answer
                    }
                }
                // If no answer is entered, do nothing (no marks deducted)
            }
        });
        return score;
    };


    const handleNext = () => {
        setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, quizDataFull.quizQuestions.length - 1));
    };

    const handlePrevious = () => {
        setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    if (loading || !quizDataFull) {
        return <Text>Loading...</Text>;
    }

    const currentQuestion = quizDataFull?.quizQuestions.length>0 ? quizDataFull?.quizQuestions[currentQuestionIndex]:{};
    // console.log(currentQuestion)


    // return (<View></View>)
    return (
        <View style={styles.container}>
            {/* Top Bar */}
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.exitQuiz} onPress={handleExitQuiz}>
                    <Text style={styles.topBtnText}>Exit</Text>
                </TouchableOpacity>
                <Text style={styles.timer}>
                    {`${timeRemaining.hr.toString().padStart(2, '0')}:${timeRemaining.min
                        .toString()
                        .padStart(2, '0')}:${timeRemaining.sec
                            .toString()
                            .padStart(2, '0')}`}
                </Text>
                <TouchableOpacity style={styles.submitQuiz} onPress={handleSubmitQuiz}>
                    <Text style={styles.topBtnText}>Submit</Text>
                </TouchableOpacity>
            </View>

            {/* Question Display */}
            <ScrollView style={styles.questionContainer}>
                <View style={styles.navButtons}>
                    <TouchableOpacity style={styles.navButton} onPress={handlePrevious}>
                        <AntDesign name='leftsquare' size={30} color={COLOR.col4} />
                    </TouchableOpacity>
                    <Text style={styles.questionText}>
                        {currentQuestion.questionName}/{quizDataFull.quizQuestions.length}
                    </Text>
                    <TouchableOpacity style={styles.navButton} onPress={handleNext}>
                        <AntDesign name='rightsquare' size={30} color={COLOR.col4} />

                    </TouchableOpacity>
                </View>

                {currentQuestion.questionPdf && (
                    <View style={[styles.pdfContainer, { height: height * 0.3 }]}>
                        <Pdf
                            trustAllCerts={false}

                            source={{
                                uri: currentQuestion.questionPdf,
                                cache: true,
                            }}

                            style={{ flex: 1 }}
                        />
                    </View>
                )}
                {currentQuestion.questionType === 'MCQ' && currentQuestion.questionOptions.length > 0 && (
                    <View style={styles.optionsContainer}>
                        {currentQuestion.questionOptions.map((option, index) => {
                            const isSelected = userAnswers[currentQuestion._id] === option;
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.option,
                                        isSelected && styles.selectedOption, // Highlight the selected option
                                    ]}
                                    onPress={() => handleAnswerChange(currentQuestion._id, option)}
                                >
                                    <Text
                                        style={styles.optionText}
                                    >
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}


                {currentQuestion.questionType === 'Short Answer' && (
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your answer"
                        value={userAnswers[currentQuestion._id] || ''}
                        onChangeText={(text) => handleAnswerChange(currentQuestion._id, text)}
                    />
                )}
            </ScrollView>

            {/* Navigation Buttons */}


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#f8f9fa',
        elevation: 3,
    },
    timer: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#343a40',
    },
    submitQuiz: {
        backgroundColor: '#28a745',
        fontWeight: 'bold',
        padding: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    exitQuiz: {
        backgroundColor: '#dc3545',
        padding: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    topBtnText: {
        color: 'white',
        fontSize: 14,
    },
    questionContainer: {
        padding: 20,
    },
    questionText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLOR.col4
    },
    pdfContainer: {
        marginTop: 15,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    optionsContainer: {
        marginTop: 10,
    },
    option: {
        backgroundColor: COLOR.col3,
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
    selectedOption: {
        backgroundColor: COLOR.col6,  // Light grey background for selected option
    },
    optionText: {
        fontSize: 16,
        color: COLOR.col1
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
    },
    navButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    scoreContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f8f9fa',
        elevation: 2,
    },
    scoreText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CourseQuizQuestionScreen;

import { StyleSheet, Text, View, ActivityIndicator, FlatList, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLOR } from '../../Constants';
import { BACKEND_URL } from '@env';

const CourseQuizScreen = ({ route }) => {
    const { course, subject, quiz, chapter, quizType } = route.params;

    const [loading, setLoading] = useState(true);
    const [quizData, setQuizData] = useState(null);
    const [quizTaken, setQuizTaken] = useState(false);  // Track if quiz is taken
    const navigation = useNavigation();

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                let token = await AsyncStorage.getItem("token");
                const response = await fetch(`${BACKEND_URL}/getQuizStartData`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        quizId: quiz._id,
                        quizType: quizType,
                    }),
                });

                const data = await response.json();
                if (data.error) {
                    console.error("Error fetching quiz data:", data.error);
                } else {
                    setQuizData(data.quiz);
                }
            } catch (error) {
                console.error("Error fetching quiz data:", error);
            } finally {
                setLoading(false);
            }
        };

        const checkQuizStatus = async () => {
            try {
                let token = await AsyncStorage.getItem("token");
                const response = await fetch(`${BACKEND_URL}/checkquizstatus?quizId=${quiz._id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (data.message === "Quiz has been taken") {
                    setQuizTaken(true);
                } else {
                    setQuizTaken(false);
                }
            } catch (error) {
                console.error("Error checking quiz status:", error);
            }
        };

        fetchQuizData();
        checkQuizStatus();  // Call to check if quiz has been taken
    }, [quiz._id, quizType]);

    const handleStartQuiz = () => {
        if (quizTaken) {
            Alert.alert('Quiz Already Taken', 'You have already taken this quiz.');
        } else {
            navigation.navigate('CourseQuizQuestionScreen', { quizData, course, subject, chapter, quizType });
        }
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={COLOR.col1} />
            </View>
        );
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
                <Text style={styles.topbarText}>Quiz Details</Text>
            </View>

            {/* Quiz Details */}
            <View style={styles.detailsContainer}>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Quiz Name:</Text>
                    <Text style={styles.tableCell}>{quizData[`${quizType}QuizName`]}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Quiz Type:</Text>
                    <Text style={styles.tableCell}>{quizType}</Text>
                </View>

                {chapter && <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Chapter:</Text>
                    <Text style={styles.tableCell}>{chapter.chapterName}</Text>
                </View>}
                {subject && <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Subject:</Text>
                    <Text style={styles.tableCell}>{subject.subjectName}</Text>
                </View>}
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellHeader}>Time Limit:</Text>
                    <Text style={styles.tableCell}>
                        {Math.floor(quizData.timeLimit / 3600000)} hrs {Math.floor((quizData.timeLimit % 3600000) / 60000)} mins {Math.floor((quizData.timeLimit % 60000) / 1000)} secs
                    </Text>
                </View>
            </View>

            {/* Start Quiz Button */}
            {
                quizTaken ?

                    <Text style={styles.quizTakenText1}>{'Quiz Already Attempted'}</Text>

                    :
                    <TouchableOpacity
                        style={styles.startButton}
                        onPress={handleStartQuiz}
                    >
                        <Text style={styles.startButtonText}>{'Start Quiz'}</Text>
                    </TouchableOpacity>
            }
        </View>
    );
};

export default CourseQuizScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
    topbarText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLOR.col1,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailsContainer: {
        padding: 16,
        marginTop: 10,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    tableCellHeader: {
        fontSize: 12,
        flex: 1,
        color: COLOR.col2, // Adjust for your color scheme
    },
    tableCell: {
        fontSize: 16,
        flex: 2,
        color: COLOR.col3, // Adjust for your color scheme
    },

    startButton: {
        backgroundColor: COLOR.col3,
        padding: 15,
        marginHorizontal: 16,
        marginTop: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    startButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    quizTakenText1:{
        color: COLOR.col2,
        fontSize: 12,
        fontWeight: '400',  
        textAlign:'center',
        marginTop:20
    }
});

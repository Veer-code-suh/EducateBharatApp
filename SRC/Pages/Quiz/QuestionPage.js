import { StyleSheet, Text, View, TextInput, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLOR } from '../../Constants';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { BACKEND_URL } from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useToast } from 'react-native-toast-notifications'
import Entypo from 'react-native-vector-icons/Entypo'
import PdfBox from '../../Components/PdfBox';
import Pdf from 'react-native-pdf';
import { Dimensions } from 'react-native';


const QuestionPage = ({ navigation, route }) => {
    const toast = useToast()
    const { quiz, quizType, initial, chapter, course } = route.params;
    const [timeLimit, setTimeLimit] = useState({
        hr: 0,
        min: 0,
        sec: 0
    });
    const [currentQuestion, setCurrentQuestion] = React.useState(0);
    const [thisQuiz, setThisQuiz] = React.useState({});
    const [questions, setQuestions] = React.useState([]);
    const [QuizQNA, setQuizQNA] = React.useState(null);

    // create a set for storing subject names
    const [subjects, setSubjects] = React.useState([]);
    const [selectedSubject, setSelectedSubject] = React.useState("");



    function convertMillisecondsToHMS(milliseconds) {
        const hours = Math.floor(milliseconds / 3600000);
        let remainingMilliseconds = milliseconds % 3600000;
        const minutes = Math.floor(remainingMilliseconds / 60000);
        remainingMilliseconds = remainingMilliseconds % 60000;
        const seconds = Math.floor(remainingMilliseconds / 1000);

        const hms = {
            "hr": hours,
            "min": minutes,
            "sec": seconds,
        };

        return hms;
    }

    const getquizbyid = async () => {
        console.log('inside getquizbyid');
        let token = await AsyncStorage.getItem("token")
        fetch(BACKEND_URL + "/getQuizData", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                quizId: quiz._id,
                quizType: quizType
            }),
        })
            .then(res => res.json())
            .then(data => {
                console.log('qna name', QuizQNA);
                if (data.error) {
                    toast.show(data.error, {
                        type: "danger",
                    });
                }
                else {
                    console.log('quizfull data ', data.quiz[`${QuizQNA}`]);
                    // set subjects from questions
                    setThisQuiz(data.quiz);
                    let mysubjects = new Set();
                    data.quiz[`${QuizQNA}`].map((qna, index) => {
                        mysubjects.add(qna.questionSubject);
                    })

                    mysubjects = Array.from(mysubjects);
                    // let mysubjects1 = ["Maths", "Chemistry", "Physics", "Biology"];
                    setSubjects(mysubjects);
                    setSelectedSubject(mysubjects[0]);
                    // filter questions by subject
                    let myquestions = data.quiz[`${QuizQNA}`].filter((qna, index) => {
                        return qna.questionSubject == mysubjects[0];
                    });
                    // console.log('myquestions ', myquestions);
                    setQuestions(myquestions);
                    setCurrentQuestion(0);

                    let time = convertMillisecondsToHMS(data.quiz.timeLimit);
                    // let time = {
                    //     hr: 0,
                    //     min: 0,
                    //     sec: 3
                    // }
                    setTimeLimit(time);
                }
            })
    }

    React.useEffect(() => {
        // console.log(quiz);
        // setQuestions(quiz.data);
        if (quizType == "chapter") {
            setQuizQNA('chapterQuizQNA');
        }
        else if (quizType == "fullquiz") {
            setQuizQNA('courseQuizQNA');
        }
        else if (quizType == "subject") {
            setQuizQNA('subjectQuizQNA');
        }
        setCurrentQuestion(0);
        if (QuizQNA != null) {
            getquizbyid();
        }


        
    }, [quiz, QuizQNA]);


    useEffect(() => {
        const interval = setInterval(() => {
            if (timeLimit.hr == 0 && timeLimit.min == 0 && timeLimit.sec == 0) {
                clearInterval(interval);
                Forcesubmittest();
            }
            else if (timeLimit.min == 0 && timeLimit.sec == 0) {
                setTimeLimit({
                    hr: timeLimit.hr - 1,
                    min: 59,
                    sec: 59
                });
            }
            else if (timeLimit.sec == 0) {
                setTimeLimit({
                    hr: timeLimit.hr,
                    min: timeLimit.min - 1,
                    sec: 59
                });
            }
            else {
                setTimeLimit({
                    hr: timeLimit.hr,
                    min: timeLimit.min,
                    sec: timeLimit.sec - 1
                });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [timeLimit]);

    const submittest = async () => {
        // let score = 0;
        // questions.map((qna, index) => {
        //     if (qna.userAnswer == qna.answer) {
        //         score++;
        //     }
        // });
        // // alert("Your score is " + score + "/" + questions.length);
        // navigation.navigate("submitquiz", { score: score, total: questions.length });


        Alert.alert(
            "Submit Quiz",
            "Are you sure you want to submit the quiz?",
            [{
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
            },
            {
                text: "OK",
                onPress: async () => {
                    let score = 0;
                    let total = 0;
                    await thisQuiz[`${QuizQNA}`].map((qna, index) => {
                        total += parseInt(qna.questionMarks);

                        if (qna.userAnswer == qna.questionAnswer) {
                            score += parseInt(qna.questionMarks);
                        }
                        else if (qna.userAnswer == null) {
                            score += 0;
                        }
                        else {
                            score -= parseInt(qna.questionNegativeMarks);
                        } 1
                    });
                    alert("Your score is " + score + "/" + total);
                    // console.log('quiz ', thisQuiz.afterSubmissionPdf);

                    let token = await AsyncStorage.getItem("token");
                    fetch(BACKEND_URL + "/submitQuiz", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            quizId: thisQuiz._id,
                            quizType: thisQuiz.quizType,
                            score: score,
                            total: thisQuiz[`${QuizQNA}`].length,
                            quizData: thisQuiz,
                            createdAt: new Date()
                        }),
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data.error) {
                                toast.show(data.error, {
                                    type: "danger",
                                });
                            }
                            else {
                                console.log(chapter, course)
                                navigation.navigate("submitquiz", { score: score, total: total, chapter: chapter, course: course, pdf: thisQuiz.afterSubmissionPdf })
                            }
                        })
                }
            }
            ]
        )

    }

    const Forcesubmittest = async () => {
       


        Alert.alert(
            "Time Up",
            "Your time is up. Submit the quiz.",
            [
            {
                text: "OK",
                onPress: async () => {
                    let score = 0;
                    let total = 0;
                    await thisQuiz[`${QuizQNA}`].map((qna, index) => {
                        total += parseInt(qna.questionMarks);

                        if (qna.userAnswer == qna.questionAnswer) {
                            score += parseInt(qna.questionMarks);
                        }
                        else if (qna.userAnswer == null) {
                            score += 0;
                        }
                        else {
                            score -= parseInt(qna.questionNegativeMarks);
                        } 1
                    });
                    alert("Your score is " + score + "/" + total);
                    // console.log('quiz ', thisQuiz.afterSubmissionPdf);

                    let token = await AsyncStorage.getItem("token");
                    fetch(BACKEND_URL + "/submitQuiz", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            quizId: thisQuiz._id,
                            quizType: thisQuiz.quizType,
                            score: score,
                            total: thisQuiz[`${QuizQNA}`].length,
                            quizData: thisQuiz,
                            createdAt: new Date()
                        }),
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data.error) {
                                toast.show(data.error, {
                                    type: "danger",
                                });
                            }
                            else {
                                console.log(chapter, course)
                                navigation.navigate("submitquiz", { score: score, total: total, chapter: chapter, course: course, pdf: thisQuiz.afterSubmissionPdf })
                            }
                        })
                }
            }
            ]
        )

    }


    const [totalPages, setTotalPages] = useState(0);


    // decrease time by 1 second every second
   

    return (
        <ScrollView style={styles.fullpage}>
            {quizType == "fullquiz" &&
                <View style={styles.quizsubjects}>
                    {/* <Text style={styles.quizsubjectstxt}>Subjects</Text> */}
                    <View style={styles.subjects}>
                        {
                            subjects.map((subject, index) => {
                                return (
                                    <Text key={index} style={
                                        selectedSubject == subject ? styles.selectedsubject : styles.quizsubject
                                    } onPress={async () => {
                                        setSelectedSubject(subject);
                                        // filter questions by subject
                                        let myquestions = await thisQuiz[`${QuizQNA}`].filter((qna, index) => {
                                            return qna.questionSubject == subject;
                                        });
                                        console.log('myquestions ', myquestions);
                                        setQuestions(myquestions);
                                        setCurrentQuestion(0);
                                    }}>
                                        {subject}
                                    </Text>
                                )
                            })
                        }
                    </View>
                </View>
            }

            {
                questions.filter((qna, index) => index == currentQuestion).map((qna, index) => {
                    return (
                        <View key={index} style={styles.questionanswer}>
                            {/* [{"questionAnswer": "Nitrogen", "questionMarks": "4", "questionName": "Which among the following is not present in pure sugar ?", "questionNegativeMarks": "1", "questionOptions": ["Carbon", "Hydrogen", "Nitrogen", "Oxygen"], "questionSubject": "Biology", "questionType": "MCQ", "quizId": "6472a761a0044376be204cba", "quizType": "fullquiz"}] */}
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    paddingHorizontal: 20,
                                    paddingVertical: 10,
                                }}
                            >
                                <Text style={styles.questionnumber}>
                                    Time Left   {timeLimit.hr} : {timeLimit.min} : {timeLimit.sec}
                                </Text>
                                <Text
                                    style={styles.questionnumber}
                                >Q. {currentQuestion + 1} of {questions.length}</Text>

                            </View>
                            <Text style={styles.question}>Q. {qna.questionName}</Text>



                            {/* <PdfBox pdfUrl={qna.questiionPdf} 
                                
                                /> */}
                            <Pdf

                                trustAllCerts={false}
                                source={{
                                    uri: qna.questiionPdf,
                                    cache: true,
                                }}
                                onLoadComplete={(numberOfPages, filePath) => {
                                    setTotalPages(numberOfPages);
                                    console.log(`Number of pages: ${numberOfPages}`);
                                }}
                                onPageChanged={(page, numberOfPages) => {
                                    console.log(`Current page: ${page}`);
                                }}
                                onError={error => {
                                    console.log(error);
                                }}
                                onPressLink={uri => {
                                    console.log(`Link pressed: ${uri}`);
                                }}
                                style={{
                                    flex: 1,
                                    height: totalPages * 300,
                                }}

                                onPageSingleTap={() => {
                                    console.log('onPageSingleTap');
                                }}
                            />
                            {
                                qna.questionType == "MCQ" &&
                                qna.questionOptions.map((item, index) => {
                                    return (
                                        <TouchableOpacity key={index} style={styles.option}
                                            onPress={() => {
                                                if (qna.userAnswer == null) {
                                                    // update this question's userAnswer in questions and quiz

                                                    let temp = [...questions];
                                                    temp[currentQuestion].userAnswer = item;
                                                    setQuestions(temp);

                                                    let temp1 = { ...thisQuiz };
                                                    temp1[`${QuizQNA}`][currentQuestion].userAnswer = item;
                                                    setThisQuiz(temp1);

                                                    console.log('questions ', questions);
                                                    console.log('thisQuiz ', thisQuiz[`${QuizQNA}`]);

                                                }
                                                else {
                                                    let temp = [...questions];
                                                    temp[currentQuestion].userAnswer = item;
                                                    setQuestions(temp);

                                                    let temp1 = { ...thisQuiz };
                                                    temp1[`${QuizQNA}`][currentQuestion].userAnswer = item;
                                                    setThisQuiz(temp1);


                                                }

                                                console.log('real answer ', qna.questionAnswer);
                                                console.log('user answer ', qna.userAnswer);
                                            }}
                                        >
                                            {qna.userAnswer == item ? (
                                                <View style={styles.selectedanswer}>
                                                    <Text style={styles.answertxt1}>{item}</Text>
                                                </View>
                                            ) : (
                                                <View style={styles.unselectedanswer}>
                                                    <Text style={styles.answertxt}>{item}</Text>
                                                </View>
                                            )}

                                        </TouchableOpacity>
                                    )
                                })
                            }

                            {
                                qna.questionType == "Short Answer" &&
                                <TextInput
                                    style={styles.shortanswertxtinput}
                                    placeholderTextColor="#aaaaaa"
                                    onChangeText={text => {
                                        if (qna.userAnswer == null) {
                                            let temp = [...questions];
                                            temp[currentQuestion].userAnswer = text;
                                            setQuestions(temp);

                                            let temp1 = { ...thisQuiz };
                                            temp1[`${QuizQNA}`][currentQuestion].userAnswer = text;
                                            setThisQuiz(temp1);
                                        }
                                        else {
                                            let temp = [...questions];
                                            temp[currentQuestion].userAnswer = text;
                                            setQuestions(temp);

                                            let temp1 = { ...thisQuiz };
                                            temp1[`${QuizQNA}`][currentQuestion].userAnswer = text;
                                            setThisQuiz(temp1);
                                        }
                                    }}
                                    value={qna.userAnswer}
                                    placeholder="Enter your answer"
                                    underlineColorAndroid="transparent"
                                    autoCapitalize="none"
                                />
                            }

                            <Text></Text>
                            <View style={styles.prevnext}>
                                {currentQuestion == 0 && <Text></Text>}

                                {currentQuestion > 0 && <Text onPress={() => setCurrentQuestion(currentQuestion - 1)} style={styles.btn}>Previous</Text>}
                                {currentQuestion < questions.length - 1 && <Text onPress={() => setCurrentQuestion(currentQuestion + 1)} style={styles.btn}>Next</Text>}
                            </View>
                        </View>
                    )
                })
            }


            <Text onPress={() => submittest()} style={styles.submit}>Submit Quiz</Text>

        </ScrollView>
    )
}

export default QuestionPage

const styles = StyleSheet.create({
    fullpage: {
        backgroundColor: COLOR.col4,
        flex: 1,
        height: "100%",
    },
    prevnext: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",

    },
    btn: {
        backgroundColor: COLOR.col3,
        padding: 5,
        paddingHorizontal: 20,
        color: COLOR.col1,
        borderRadius: 25,
    },
    submit: {
        backgroundColor: COLOR.col3,
        padding: 5,
        paddingHorizontal: 20,
        color: COLOR.col1,
        borderRadius: 25,
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
        alignSelf: "flex-end",
        margin: 10,

    },
    questionanswer: {
        margin: 10,
    },
    question: {
        fontSize: 18,
        backgroundColor: COLOR.col3,
        padding: 10,
        paddingHorizontal: 20,
        color: COLOR.col1,
        borderRadius: 25,
        marginVertical: 10,
    },
    answertxt: {
        color: '#545454',
    },
    unselectedanswer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: COLOR.col1,
        padding: 10,
        borderRadius: 25,
    },
    correctanswer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#99B83C',
        padding: 10,
        borderRadius: 25,
    },
    selectedanswer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: COLOR.col3,
        padding: 10,
        borderRadius: 25,
        color: COLOR.col2,

    },
    answertxt1: {
        color: COLOR.col1,
    },



    // subjects
    quizsubjects: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    quizsubjectstxt: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLOR.col3,
        marginVertical: 10,
    },
    subjects: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        flexWrap: "wrap",
        gap: 3,
    },
    quizsubject: {
        backgroundColor: COLOR.col4,
        padding: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginVertical: 5,
        color: COLOR.col3,
    },
    selectedsubject: {
        backgroundColor: COLOR.col1,
        padding: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginVertical: 5,
        color: COLOR.col3,
    },

    shortanswertxtinput: {
        backgroundColor: COLOR.col4,
        padding: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginVertical: 5,
        color: COLOR.col3,
        borderColor: COLOR.col3,
        borderWidth: 1,
    },
    questionnumber: {
        fontSize: 18,
        backgroundColor: COLOR.col3,
        padding: 10,
        paddingHorizontal: 20,
        color: COLOR.col1,
        borderRadius: 25,
        marginVertical: 10,
        alignSelf: "flex-end",
    },
    c12: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: COLOR.col3,
        padding: 2,
        paddingHorizontal: 20,
        borderRadius: 25,
    },
    c12txt: {
        color: COLOR.col1,
    },
    c12i: {
        color: COLOR.col1,
    }
})
import { Dimensions, StyleSheet, Text, View, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { COLOR, windowWidth } from '../../Constants'
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { BACKEND_URL } from "@env";
import { Image } from 'react-native-elements'
import FullScreenLoader from '../FullScreenLoader'

const HomeJeeNeet = () => {
    const [courses, setCourses] = useState([])

    const getallcourses = () => {
        // console.log("Getting all courses" + BACKEND_URL + "/allCourses")
        fetch(BACKEND_URL + "/allCourses", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },

        })
            .then(res => res.json())
            .then(data => {
                // console.log(data.courses)
                setCourses(data.courses)


                //  [{"__v": 2, "_id": "6472490d57f54e90ae6b2fc3", "courseDescription": "Joint Entrance Examination – Main, formerly All India Engineering Entrance Examination, is an Indian standardised computer-based test for admission to various technical undergraduate programs in engineering, architecture, and planning across colleges in India.", "courseImage": "/public\\files\\1685215537585.png", "courseName": "JEE MAINS 2024", "coursePrice": "4999", "coursePriceCurrency": "INR", "courseQuizzes": [], "courseRating": "0", "courseReviews": [], "courseSubjects": [[Object], [Object]], "createdAt": "2023-05-27T18:16:45.518Z", "updatedAt": "2023-05-27T19:59:33.425Z"}, {"__v": 0, "_id": "6472492f57f54e90ae6b2fc7", "courseDescription": "The entrance exam consists of two papers – Paper 1 and Paper 2. It is also carried out in two stages (or shifts) that are held on the same day. All the students must appear for both papers to be eligible for the merit list. Candidates are granted admission to various undergraduate courses and master and dual degree programmes offered by IITs based on marks scored or ranks secured in the JEE Advanced examination.", "courseImage": "/public\\files\\1685211439006.png", "courseName": "JEE ADVANCED 2023", "coursePrice": "4577", "coursePriceCurrency": "INR", "courseQuizzes": [], "courseRating": "0", "courseReviews": [], "courseSubjects": [], "createdAt": "2023-05-27T18:17:19.049Z", "updatedAt": "2023-05-27T19:23:23.067Z"}, {"__v": 6, "_id": "64724afc1024d70b4701aca6", "courseDescription": "The National Testing Agency (NTA) conducts the National Eligibility cum Entrance Test (NEET) exam in 13 languages. The single national-level undergraduate medical entrance exam, NEET UG held every year for admission to 645 medical, 318 dental, 914 AYUSH, and 47 BVSc and AH colleges in India.", "courseImage": "/public\\files\\1685211900751.jpg", "courseName": "NEET", "coursePrice": "7555", "coursePriceCurrency": "INR", "courseQuizzes": [[Object]], "courseRating": "0", "courseReviews": [], "courseSubjects": [[Object]], "createdAt": "2023-05-27T18:25:00.830Z", "updatedAt": "2023-05-28T00:59:13.592Z"}]
            })
    }
    const navigation = useNavigation()

    React.useEffect(() => {
        getallcourses()
    }, [])

    return (
        <View>
            {
                courses.length > 0 ?
                <View style={styles.container}>
                <Text style={styles.head}>
                    Our Courses
                </Text>
                <View style={styles.container}>
                    {
                        courses.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={
                                        () => {
                                            navigation.navigate('coursepage', { course: item })
                                        }
                                    }
                                >
                                    <View style={styles.c1}>
                                        <ImageBackground
                                            source={{ uri: item.courseImage }}
                                            style={styles.c1}
                                            imageStyle={styles.backimage}
                                        >
                                            {/* <AntDesign name='book' size={30} color='black' style={styles.icon} /> */}
                                            <Text style={styles.t1}>{item.courseName}</Text>
                                        </ImageBackground>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
    
                    {/* showall */}
                    {/* <TouchableOpacity>
                        <View style={styles.c1}>
                            <AntDesign name='book' size={30} color='black' style={styles.icon} />
                            <Text style={styles.t1}>Show All</Text>
                        </View>
                    </TouchableOpacity> */}
                </View>
            </View>
            :
            <FullScreenLoader/>
            }
        </View>


    )
}

export default HomeJeeNeet

const styles = StyleSheet.create({
    head: {
        fontSize: 20,
        color: COLOR.col3,
        textAlign: 'left',
        width: '100%',
        paddingHorizontal: 10,
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: windowWidth,
        flexWrap: 'wrap',
    },
    c1: {
        position: 'relative',
        backgroundColor: COLOR.col1,
        // padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        width: windowWidth / 2.1,
        height: windowWidth / 3.5 + 20,
        marginVertical: 5,
        position: 'relative',
        overflow: 'hidden',
elevation: 5                         
    },
    backimage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    t1: {
        color: COLOR.col3,
        textAlign: 'center',
        backgroundColor: COLOR.col1,
        width: '100%',
        padding: 2,
        fontSize: 12,
        position: 'absolute',
        bottom: 0,
    },
    icon: {
        fontSize: 40,
        color: COLOR.col3,
        marginBottom: 10
    }
})
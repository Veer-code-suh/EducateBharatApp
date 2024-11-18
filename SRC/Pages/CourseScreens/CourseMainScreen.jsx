import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, Modal, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLOR } from '../../Constants';
import { useNavigation } from '@react-navigation/native';
import { BACKEND_URL } from '@env';
import Video from 'react-native-video';  // Ensure you have this package installed
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RAZORPAY_KEY_ID , RAZORPAY_KEY_SECRET} from '@env'
import RazorpayCheckout from 'react-native-razorpay';
import { Toast } from 'react-native-toast-notifications';

const windowWidth = Dimensions.get('window').width;

const CourseMainScreen = ({ route }) => {
    const shortCourseData = route.params?.course || {};
    const navigation = useNavigation();
    const [courseIntroData, setCourseIntroData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [videoModalVisible, setVideoModalVisible] = useState(false);
    const [purchased, setPurchased] = useState(null);
    const [discount, setDiscount] = React.useState(10)
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
                    console.log('isPurchased ',data.userdata.coursePurchased.includes(shortCourseData._id))
                    setUser(data.userdata)

                    if (data.userdata.coursePurchased.includes(shortCourseData._id)) {
                        setPurchased(true)
                    }
                    else if(parseInt(shortCourseData.coursePrice, 10) == 0){
                        setPurchased(true);
                      }
                    else {
                        setPurchased(false)
                    }     
                }
            })
    }

    const fetchCourseData = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/courseintrobycourseid`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseId: shortCourseData._id }),
            });
            const data = await response.json();
            if (response.ok) {
                setCourseIntroData(data.course);
            } else {
                console.error('Failed to fetch course data:', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourseData();
    }, [shortCourseData._id]);

    const handleVideoPlay = () => setVideoModalVisible(true);
    const handleVideoClose = () => setVideoModalVisible(false);

    const openCourse = () => {
      
        navigation.navigate("CourseSubjectsScreen", { course:  courseIntroData})
    }
    const buyCourse = async ()=>{
    let razorpayKeyId = RAZORPAY_KEY_ID

        setLoading(true);
        let token = await AsyncStorage.getItem("token")


        var options = {
            description: 'Buy Course',
            image: shortCourseData.courseImage,
            currency: 'INR',
            key: razorpayKeyId,
            amount: (shortCourseData.coursePrice - (shortCourseData.coursePrice * discount) / 100)*100,
            name: shortCourseData.courseName,
            prefill: {
                email: user.email,
                contact: user.phone,
                name: user.name
            },
            theme: { color: COLOR.col1 }
        }

        RazorpayCheckout.open(options).then((data) => {
            // handle success
            // alert(`Success: ${data.razorpay_payment_id}`);
    
            fetch(BACKEND_URL + "/buyCourse", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    courseId: shortCourseData._id,
                    amount: shortCourseData.coursePrice - (shortCourseData.coursePrice * discount) / 100,
                    currency: shortCourseData.coursePriceCurrency,
                    razorpay_payment_id: `${data.razorpay_payment_id}`,
                })
            })
                .then(res => res.json())
                .then(data => {
                    setLoading(false)
                    if (data.error) {
                        Toast.show(data.error, {
                            type: "danger",
                        });
    
                    }
                    else {
                        Toast.show(data.message, {
                            type: "success",
                        });
                        setPurchased(true)
                    }
                })
                .catch(err => {
                    setLoading(false)
                    console.log(err)
                    Toast.show("Something went wrong", {
                        type: "danger",
                    });
                })
    
          })
            .catch((error) => {
              // handle failure
            //   console.log(error)
            //   alert(`Error: ${error.code} | ${error.description}`);
    
            Toast.show("Payment Failed", {
                type: "danger",
            })
            })
    
            console.log('pay ',options)
    }

    return (
        <View style={styles.container}>
            <View style={styles.topbar}>
                <Ionicons
                    name="return-up-back-outline"
                    size={20}
                    style={styles.backbtn}
                    onPress={() => navigation.goBack()}
                />
            </View>

            <ScrollView style={{ flex: 1 }}>
                {loading ? (
                    <ActivityIndicator size="large" color={COLOR.col1} />
                ) : courseIntroData ? (
                    <View style={styles.content}>
                        <Text style={styles.title}>{courseIntroData.courseName}</Text>

                        {courseIntroData.introVideo ? (
                            <TouchableOpacity onPress={handleVideoPlay} style={styles.thumbnailContainer}>
                                <Image
                                    source={{ uri: courseIntroData.courseImage }}
                                    style={styles.thumbnail}
                                />
                                <View style={{
                                    backgroundColor: 'black',
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    opacity: 0.5,
                                    borderRadius: 10
                                }}>
                                </View>
                                <Ionicons name="play-circle" size={50} color="white" style={styles.playButton} />

                            </TouchableOpacity>
                        ) : (
                            <Image
                                source={{ uri: courseIntroData.courseImage }}
                                style={styles.image}
                            />
                        )}

                        <Text style={styles.title2}>About this course</Text>

                        <Text style={styles.description}>{courseIntroData.courseDescription}</Text>


                        {/* Video Modal */}
                        {courseIntroData.introVideo && (
                            <Modal
                                visible={videoModalVisible}
                                transparent={true}
                                animationType="slide"
                                onRequestClose={handleVideoClose}
                            >
                                <View style={styles.modalContainer}>
                                    <Video
                                        source={{ uri: courseIntroData.introVideo }}
                                        style={styles.video}
                                        controls={true}
                                        fullscreen={true}
                                        resizeMode="contain"
                                    />
                                    <Ionicons
                                        name="close-circle"
                                        size={30}
                                        color="#fff"
                                        style={styles.closeButton}
                                        onPress={handleVideoClose}
                                    />
                                </View>
                            </Modal>
                        )}
                    </View>
                ) : (
                    <Text style={styles.errorText}>Failed to load course details.</Text>
                )}
            </ScrollView>

            {
                !loading && courseIntroData && purchased == false &&
                <View style={styles.bottomsection}>
                    <View style={styles.pricebar}>
                        <Text style={styles.price}>
                            {
                                courseIntroData.coursePriceCurrency == "INR" ?
                                    "₹ " : "$ "
                            }
                            {courseIntroData.coursePrice - (courseIntroData.coursePrice * discount / 100)}
                        </Text>
                        <Text style={styles.pricecut}>
                            {courseIntroData.coursePrice}
                        </Text>
                    </View>
                    <View style={styles.btngroup}>
                        <Text style={styles.demobtn} onPress={()=> openCourse()}>Show Demo</Text>
                        <Text style={styles.buybtn} onPress={()=> buyCourse()}>Buy Now</Text>
                    </View>
                </View>
            }

            {
                !loading && courseIntroData && purchased == true &&
                <View style={styles.bottomsection1}>
                    <Text style={styles.demobtn} onPress={()=> openCourse()}>Show Full Course</Text>
                </View>
            }

        </View>
    );
};

export default CourseMainScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    topbar: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        width: windowWidth,
        zIndex: 1,
    },
    backbtn: {
        color: COLOR.col4,
        marginRight: 10,
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLOR.col4,
    },
    title2: {
        fontSize: 12,
        fontWeight: '400',
        color: '#333',       // Dark gray color for readability
        marginTop: 20,       // Adds space above the title
        textAlign: 'left',   // Aligns text to the left, if not the default
        letterSpacing: 0.5,  // Adds a bit of spacing between letters for readability
    },
    description: {
        marginTop: 10,
        fontSize: 10,
        color: COLOR.col4,
        backgroundColor: COLOR.col1,
        padding: 10,
        borderRadius: 5,
        borderColor: COLOR.col4,
        borderWidth: 1,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    thumbnailContainer: {
        position: 'relative',
        marginTop: 10,
    },
    thumbnail: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    playButton: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
        opacity: 1
    },
    image: {
        width: '100%',
        height: 200,
        marginTop: 20,
        borderRadius: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: 30,
        right: 20,
    },


    bottomsection: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
      
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bottomsection1:{
        justifyContent:'center',
        alignItems:'center',
        paddingVertical: 10,

    },
    pricebar: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLOR.col4, // Main price color
        marginRight: 5,
    },
    pricecut: {
        fontSize: 16,
        color: '#888', // Dimmed color for strikethrough
        textDecorationLine: 'line-through',
    },
    btngroup: {
        flexDirection: 'row',
    },
    demobtn: {
        fontSize: 14,
        paddingVertical: 8,
        paddingHorizontal: 15,
        backgroundColor: COLOR.col4,
        color: '#fff',
        borderRadius: 5,
        marginRight: 10,
        textAlign: 'center',
    },
    buybtn: {
        fontSize: 14,
        paddingVertical: 8,
        paddingHorizontal: 15,
        backgroundColor: COLOR.col1,
        color: '#fff',
        borderRadius: 5,
        textAlign: 'center',
    },

});

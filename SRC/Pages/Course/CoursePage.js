import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React from 'react'
import courseImage from "../../Assets/Course/courseimage.png"
import { Image } from 'react-native-elements'
import { COLOR, windowWidth } from '../../Constants'
import { ScrollView } from 'react-native-gesture-handler'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { BACKEND_URL } from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useToast } from 'react-native-toast-notifications'
import Video from 'react-native-video';
import RazorpayCheckout from 'react-native-razorpay';
import {RAZORPAY_KEY_ID , RAZORPAY_KEY_SECRET} from '@env'

const CoursePage = ({ navigation, route }) => {
    const toast = useToast()
    const { course } = route.params
    const [discount, setDiscount] = React.useState(10)
    const [user, setUser] = React.useState({})

    React.useEffect(() => {
        console.log(course)
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
                    toast.show(data.error, {
                        type: "danger",
                    });

                }
                else {
                    console.log(data)
                    setUser(data.userdata)

                    if (data.userdata.coursePurchased.includes(course._id)) {
                        setPurchased(true)
                    }
                    else {
                        setPurchased(false)
                    }
                }
            })
    }

    let [purchased, setPurchased] = React.useState(null)
    let [loading, setLoading] = React.useState(false)


    let razorpayKeyId = RAZORPAY_KEY_ID
  let razorpayKeySecret = RAZORPAY_KEY_SECRET

    const buycourse = async () => {
        // courseId , token , amount
        // setPurchased(true)
        setLoading(true)
        let token = await AsyncStorage.getItem("token")


        var options = {
            description: 'Buy Course',
            image: course.courseImage,
            currency: 'INR',
            key: razorpayKeyId,
            amount: (course.coursePrice - (course.coursePrice * discount) / 100)*100,
            name: course.courseName,
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
                courseId: course._id,
                amount: course.coursePrice - (course.coursePrice * discount) / 100,
                currency: course.coursePriceCurrency,
                razorpay_payment_id: `${data.razorpay_payment_id}`,
            })
        })
            .then(res => res.json())
            .then(data => {
                setLoading(false)
                if (data.error) {
                    toast.show(data.error, {
                        type: "danger",
                    });

                }
                else {
                    toast.show(data.message, {
                        type: "success",
                    });
                    setPurchased(true)
                }
            })
            .catch(err => {
                setLoading(false)
                console.log(err)
                toast.show("Something went wrong", {
                    type: "danger",
                });
            })

      })
        .catch((error) => {
          // handle failure
        //   console.log(error)
        //   alert(`Error: ${error.code} | ${error.description}`);

        toast.show("Payment Failed", {
            type: "danger",
        })
        })

        console.log('pay ',options)
        
    }

    // const course = 
    //     {
    //         courseImage: courseImage,
    //         courseName: "JEE Mains - Physics Chemistry Maths Chapterwise Course",
    //         coursedescription: "This course is for JEE Mains aspirants. It contains chapterwise video lectures, notes, and practice questions. It is a complete course for JEE Mains.This course is for JEE Mains aspirants. It contains chapterwise video lectures, notes, and practice questions. It is a complete course for JEE Mains.",
    //         rating: 4.5,
    //         price: 1999,
    //         discount: 50,
    //     }

    return (
        <View style={styles.fullpage}>
            <View style={styles.topbar}>
                <Ionicons name="return-up-back-outline" size={30} style={styles.backbtn}
                    onPress={() => navigation.goBack()}
                />
            </View>
            <ScrollView>



                {
                    course.introVideo.length > 0 ?
                        <View style={{
                            width: windowWidth,
                            aspectRatio: 1.5,
                            backgroundColor: "black",
                            alignSelf: "center",
                            borderRadius: 10,
                            overflow: "hidden",
                        }}>
                            <Video
                                source={{ uri: course.introVideo }}
                                style={{
                                    flex: 1,
                                }}
                                controls={true}
                                resizeMode="contain"
                                paused={true}
                                onBuffer={this.onBuffer}
                                fullscreen={true}
                                // add poster here
                                posterResizeMode="cover"
                                poster={course.courseImage}
                            />
                        </View>
                        :
                        <Image source={{ uri: course.courseImage }}
                            style={{ width: windowWidth, height: 300 }} />
                }


                <Text style={styles.premiumcourse}>Premium Course</Text>
                <Text style={styles.coursename}>{course.courseName}</Text>
                <Text style={styles.coursedescription}>{course.courseDescription}</Text>


                <View style={styles.stars}>
                    {/* 4.5 stars */}
                    <FontAwesome name="star" size={20} color={COLOR.col2} style={styles.star} />
                    <FontAwesome name="star" size={20} color={COLOR.col2} style={styles.star} />
                    <FontAwesome name="star" size={20} color={COLOR.col2} style={styles.star} />
                    <FontAwesome name="star" size={20} color={COLOR.col2} style={styles.star} />
                    <FontAwesome name="star-half-full" size={20} color={COLOR.col2} style={styles.star} />
                    <Text style={styles.rating}>4.5</Text>
                </View>

                <View style={{
                    height: 100
                }}></View>
            </ScrollView>

            {
                purchased == true &&
                <View style={styles.purchasedbar}>
                    <AntDesign name="infocirlce" size={20} color={COLOR.col1} style={styles.purchasedinfo} />
                    <Text style={styles.purchasedtext}>You have already purchased this course</Text>
                    <Text style={styles.viewbtn}
                        onPress={() => navigation.navigate("coursechapters", { course: course })}
                    >View</Text>
                </View>
            }
            {
                purchased == false &&
                <View style={styles.pricebar}>
                    <Text style={styles.price}>
                        {
                            course.coursePriceCurrency == "INR" ?
                                "₹ " : "$ "
                        }
                        {course.coursePrice - (course.coursePrice * discount / 100)}
                    </Text>
                    <Text style={styles.pricecut}>
                        {course.coursePrice}
                    </Text>
                    {
                        user ?
                            <Text style={styles.buybtn}
                                onPress={() => buycourse()}
                            >Buy Now</Text>
                            :
                            <ActivityIndicator size="large" color={COLOR.col1} />
                    }
                </View>
            }
            
        </View>
    )
}

export default CoursePage

const styles = StyleSheet.create({
    fullpage: {
        flex: 1,
    },
    topbar: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        width: windowWidth,
        zIndex: 1,
        backgroundColor: "#fff",
    },
    backbtn: {
        color: "#000",
        marginRight: 10
    },
    coursename: {
        fontSize: 25,
        fontWeight: "400",
        color: COLOR.col2,
        padding: 10,
    },
    premiumcourse: {
        fontSize: 17,
        fontWeight: "400",
        color: COLOR.col2,
        padding: 10,
        backgroundColor: COLOR.col4,
        width: 170,
        textAlign: "center",
        borderRadius: 10,
        margin: 10,
        borderColor: COLOR.col2,
        borderWidth: 2,
    },
    coursedescription: {
        fontSize: 15,
        fontWeight: "300",
        color: "#000",
        padding: 10,
    },
    stars: {
        flexDirection: "row",
        backgroundColor: "#FFEDAC",
        borderColor: "#FBC914",
        borderWidth: 2,
        padding: 10,
        margin: 10,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    star: {
        marginRight: 5,
        fontSize: 25,
        color: "#FBC914",
    },
    rating: {
        fontSize: 20,
        color: "grey",
        marginLeft: 10,
    },
    pricebar: {
        flexDirection: "row",
        // justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: COLOR.col2,
        position: "absolute",
        bottom: 0,
        width: windowWidth,
        padding: 15,
        gap: 5,
    },
    price: {
        fontSize: 25,
        color: COLOR.col1,
    },
    pricecut: {
        fontSize: 20,
        color: "grey",
        textDecorationLine: "line-through",
    },
    discount: {
        fontSize: 20,
        color: "#fff",

    },
    buybtn: {
        fontSize: 20,
        color: COLOR.col2,
        backgroundColor: COLOR.col4,
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 20,
        width: windowWidth / 2,
        textAlign: "center",
        position: "absolute",
        right: 5,
    },
    purchasedbar: {
        flexDirection: "row",
        // justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: COLOR.col2,
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    purchasedinfo: {
        fontSize: 15,
        color: COLOR.col1,
        marginRight: 5,
    },
    purchasedtext: {
        fontSize: 12,
        color: COLOR.col1,
    },
    viewbtn: {
        // green border text
        // light green bg
        fontSize: 15,
        color: COLOR.col3,
        backgroundColor: COLOR.col4,
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 20,
        textAlign: "center",
        position: "absolute",
        right: 5,
    }
})
import { Dimensions, StyleSheet, Text, View, ActivityIndicator, Image, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { BACKEND_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLOR } from '../../Constants';

const MyCoursesScreen = ({ navigation }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    const getMyCourses = async () => {
        const token = await AsyncStorage.getItem('token');
        setLoading(true);
        fetch(`${BACKEND_URL}/getMyCourses`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setCourses(data.courses);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        getMyCourses();
    }, []);

    const renderCourseItem = ({ item }) => (
        <TouchableOpacity style={styles.courseCard} onPress={() => handleCourseClick(item)}>
            <Image source={{ uri: item.courseImage }} style={styles.courseImage} />
            <View style={styles.cardDetails}>
                <Text style={styles.courseTitle}>{item.courseName}</Text>
                <Text style={styles.coursePrice}>Rs. {item.coursePrice} /-</Text>

                <Text style={styles.courseDescription} numberOfLines={3} ellipsizeMode="tail">{item.courseDescription}</Text>
            </View>
        </TouchableOpacity>
    );

    const handleCourseClick = (item) => {
        navigation.navigate('CourseMainScreen', { course: item })
    }

    return (
        <View style={styles.container}>
            {/* Topbar */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.topBarTitle}>Your Courses</Text>
            </View>

            {/* Conditional Rendering */}
            {loading && (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color={COLOR.col4} />
                </View>
            )}

            {!loading && courses.length === 0 && (
                <View style={styles.noCourses}>
                    <Text style={styles.noCoursesText}>No Courses</Text>
                </View>
            )}

            {!loading && courses.length > 0 && (
                <FlatList
                    data={courses}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderCourseItem}
                    
                    contentContainerStyle={styles.coursesContainer}
                />
            )}
        </View>
    );
};

export default MyCoursesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    topBar: {
        paddingVertical:10,
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noCourses: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noCoursesText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLOR.col4,
    },
    coursesContainer: {
        padding: 10,
        gap: 10,
        paddingBottom:100
    },
    courseCard: {
        flex: 1,

        overflow: 'hidden',
        flexDirection: 'row',
        marginBottom: 5,

    },
    cardDetails: {
        flex: 1,
    },
    courseImage: {
        width: 100,
        height: 100,
        objectFit: 'contain',
        marginRight: 10,
        backgroundColor:'black'
    },
    courseTitle: {
        fontSize: 16,
        fontWeight: '400',
        color: COLOR.col2,
        textTransform: 'capitalize'
    },
    coursePrice: {
        fontSize: 12,
        fontWeight: '400',
        color: COLOR.col6,
        textTransform: 'capitalize'
    },
    courseDescription: {
        fontSize: 10,
        color: '#ccc',
    },
});

import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, FlatList, Image } from 'react-native';
import { COLOR } from '../Constants';
import { useNavigation } from '@react-navigation/native';
import { BACKEND_URL } from '@env';

const { width } = Dimensions.get('window');

const HomeJeeNeet = () => {
    const [courses, setCourses] = useState([]);
    const navigation = useNavigation();

    const getThreeCourses = () => {

        fetch(`${BACKEND_URL}/getSomeCourses`, {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ limit: 3 })
        })
            .then((res) => res.json())
            .then((data) => {
                setCourses(data.courses);
            });
    };

    useEffect(() => {
        getThreeCourses();
    }, []);

    const renderCourseItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('CourseMainScreen', { course: item })}
            style={styles.courseCard}
        >
            <Image source={{ uri: item.courseImage }} style={styles.courseCardImage} />
            <Text style={styles.t1}>{item.courseName} {parseInt(item.coursePrice, 10) == 0 && <Text style={styles.free}>{'  '}FREE{'  '}</Text>}</Text>
            
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.head}>Our Courses</Text>
                <Text
                    style={styles.more}
                    onPress={() => navigation.navigate('CourseScreen')}
                >
                    View all
                </Text>
            </View>

            <FlatList
                data={courses}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderCourseItem}
                contentContainerStyle={styles.coursesContainer}
            />
        </View>
    );
};

export default HomeJeeNeet;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        padding: 10,

    },
    head: {
        fontSize: 18,
        fontWeight: '300',
        color: COLOR.col4,
    },
    more: {
        fontSize: 12,
        color: COLOR.col6,
        fontWeight: '400',
        textDecorationLine: 'underline',
    },
    coursesContainer: {
        paddingHorizontal: 5,
    },
    courseCard: {
        width: width * 0.6, // Adjusts the width to fit horizontally
        backgroundColor: 'white',
        borderRadius: 5,
        shadowColor: '#000',
        marginRight: 10,
        overflow: 'hidden',
        alignItems:'center'
    },
    courseCardImage: {
        width: '100%',
        aspectRatio: 16 / 9,
    },
    t1: {
        color: COLOR.col4,
        padding: 10,
        fontSize: 12,
        textAlign: 'center',
    },
    free:{
        backgroundColor:COLOR.col1,
        width:50,
        textAlign:'center',
        fontSize:12,
        color:COLOR.col6,
    },
});

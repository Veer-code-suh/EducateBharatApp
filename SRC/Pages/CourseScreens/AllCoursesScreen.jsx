import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { BACKEND_URL } from '@env';
import { COLOR } from '../../Constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

const AllCoursesScreen = () => {
    const navigation = useNavigation();

    const [courses, setCourses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);  // Loading state for fetch requests

    // Fetch top 3 courses
    const getThreeCourses = () => {
        setLoading(true);  // Set loading to true whenever a fetch happens
        fetch(`${BACKEND_URL}/getSomeCourses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ limit: 3 }),
        })
            .then((res) => res.json())
            .then((data) => {
                setCourses(data.courses);
                setLoading(false);  // Set loading to false once data is fetched
            })
            .catch(() => setLoading(false));  // Handle error case and stop loading
    };

    // Fetch search results based on the query
    const handleSearch = () => {
        setLoading(true);  // Start loading before making the search request
        fetch(`${BACKEND_URL}/searchCourses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: searchQuery }),
        })
            .then((res) => res.json())
            .then((data) => {
                setCourses(data.courses);
                setLoading(false);  // Set loading to false after receiving data
            })
            .catch(() => setLoading(false));  // Handle errors by stopping the loading state
    };

    useEffect(() => {
        getThreeCourses();  // Fetch the top 3 courses when the component mounts
    }, []);

    const renderCourseItem = ({ item }) => (
        <TouchableOpacity style={styles.courseCard} onPress={() => handleCourseClick(item)}>
            <Image source={{ uri: item.courseImage }} style={styles.courseImage} />
            <View style={styles.cardDetails}>
                <Text style={styles.courseTitle}>{item.courseName}</Text>
                {parseInt(item.coursePrice, 10) == 0 ? <Text style={styles.free}>FREE</Text>
                    :
                    <Text style={styles.coursePrice}>Rs. {item.coursePrice} /-</Text>
                }

                <Text style={styles.courseDescription} numberOfLines={3} ellipsizeMode="tail">{item.courseDescription}</Text>
            </View>
        </TouchableOpacity>
    );



    const handleCourseClick = (item) => {
        navigation.navigate('CourseMainScreen', { course: item })
    }
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Courses</Text>

            {/* Search Bar */}
            <View style={styles.searchBar}>
                <TextInput
                    style={styles.searchBarInput}
                    placeholder="Search courses"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <TouchableOpacity onPress={() => handleSearch()}>
                    <AntDesign name="search1" style={styles.searchIcon} />
                </TouchableOpacity>
            </View>

            {/* Loading Indicator */}
            {loading ? (
                <ActivityIndicator size="large" color={COLOR.col1} style={styles.loader} />
            ) : (
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

export default AllCoursesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: COLOR.col4,
    },
    searchBar: {
        height: 40,
        borderColor: COLOR.col1,
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchBarInput: {
        flex: 1,
    },
    searchIcon: {
        fontSize: 20,
        color: COLOR.col1,
    },
    loader: {
        flex: 1,  // Center the loader in the screen
        justifyContent: 'center',
        alignItems: 'center',
    },
    coursesContainer: {
        paddingVertical: 10,
        gap: 10,
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
        backgroundColor: 'black'

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
    free:{
        backgroundColor:COLOR.col1,
        width:50,
        textAlign:'center',
        fontSize:12,
        color:COLOR.col6,
        marginVertical:5
    },
    courseDescription: {
        fontSize: 10,
        color: '#ccc',
    },
});

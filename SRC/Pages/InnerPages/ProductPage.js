import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import itemImage from "../../Assets/Products/jeemainchemistry.jpeg"
import { Image } from 'react-native'
import { COLOR, windowWidth } from '../../Constants'
import { ScrollView } from 'react-native-gesture-handler'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useToast } from 'react-native-toast-notifications'
import { BACKEND_URL } from "@env";
// TODO
// import Carousel from 'react-native-snap-carousel';
import { TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'


const ProductPage = ({ navigation, route }) => {
    const { product } = route.params
    const toast = useToast()

    // console.log(product)
    let [purchased, setPurchased] = React.useState(false)

    const buycourse = () => {
        // setPurchased(true)
        alert("Item Purchased Successfully")
    }

    const course =
    {
        itemImage: itemImage,
        productName: "JEE Mains - Physics Chemistry Maths Chapterwise Book",
        productdescription: "This course is for JEE Mains aspirants. It contains chapterwise video lectures, notes, and practice questions. It is a complete course for JEE Mains.This course is for JEE Mains aspirants. It contains chapterwise video lectures, notes, and practice questions. It is a complete course for JEE Mains.",
        rating: 4.5,
        price: 1999,
        discount: 50,
    }


    const [quantity, setQuantity] = React.useState(1)
    const [total, setTotal] = React.useState(product.productPrice*1)
    useEffect(() => { 
        setTotal(product.productPrice * quantity)
    }, [quantity])

    const AddToCart = async() => {
        // token , fullproduct , quantity , price
        const token = await AsyncStorage.getItem("token")
       
        console.log(token , BACKEND_URL)

        fetch(BACKEND_URL + "/addToCart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                fullproduct : product,
                quantity : quantity,
                price : product.productPrice
            })
        })
        .then(res => {
            return res.json()
        })
        .then(async (data) => {
            if(data.error){
                toast.show(data.error, { type: "danger" })
            }
            else{
                toast.show(data.message, { type: "success" })
            }
        })
        .catch(err => {
            toast.show("Something went wrong", { type: "danger" })
            console.log(err)
        })
    }
    return (
        <View style={styles.fullpage}>
            <View style={styles.topbar}>
                <Ionicons name="return-up-back-outline" size={30} style={styles.backbtn}
                    onPress={() => navigation.goBack()}
                />
            </View>
            <ScrollView>

                {/* TODO */}
                {/* <View style={styles.carousel}>
                    <Carousel
                        inactiveSlideShift={0}
                        useScrollView={true}
                        loop={true}
                        autoplay={true}
                        autoplayDelay={500}
                        autoplayInterval={2000}
                        layout={"default"}
                        data={product.productImages}
                        sliderWidth={windowWidth}
                        itemWidth={windowWidth}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={styles.carouselitem}>
                                    <Image source={{
                                        uri: item
                                    }} style={{ width: windowWidth, height: 300, resizeMode: "contain" }} />

                                </View>
                            )
                        }}
                    />
                </View> */}
                <Image source={{
                    uri: product.productImages[0]
                }} style={{ width: windowWidth, height: 300, resizeMode: "contain" }} />

                <View style={styles.row}>
                    <Text style={styles.coursename}>{product.productName}</Text>
                    <Text style={styles.price}>₹{total}</Text>
                    <Text style={styles.pricecut}>₹ {parseInt(total) + parseInt(total * 0.1)}</Text>
                </View>
                <Text style={styles.productdescription}

                    numberOfLines={10}
                >{product.productDescription}</Text>


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



            <View style={styles.pricebar}>
                <View style={styles.incredecre}>
                    <TouchableOpacity
                        onPress={() => {
                            if (quantity > 1) {
                                setQuantity(quantity - 1)
                            }
                        }}
                    >
                        <AntDesign name="minuscircleo" size={20} color={COLOR.col4} />
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{quantity}</Text>
                    <TouchableOpacity
                        onPress={() => setQuantity(quantity + 1)}
                    >
                        <AntDesign name="pluscircleo" size={20} color={COLOR.col4} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.buybtn}
                    onPress={() => AddToCart()}
                >Add To Cart</Text>
            </View>

        </View>
    )
}

export default ProductPage

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
        width: windowWidth / 1.5,
    },
    row: {
        flexDirection: "row",
        paddingHorizontal: 10,
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
    productdescription: {
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
        backgroundColor: COLOR.col3,
        position: "absolute",
        bottom: 0,
        width: windowWidth,
        padding: 15,
        gap: 5,
    },
    price: {
        fontSize: 25,
        color: COLOR.col3,
    },
    pricecut: {
        fontSize: 15,
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
    incredecre: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderColor: COLOR.col1,
        borderWidth: 2,
        paddingHorizontal: 10,
        gap: 10,
        borderRadius: 10,
        paddingVertical: 5,
    },
    quantity: {
        fontSize: 20,
        color: COLOR.col1,
    }
})

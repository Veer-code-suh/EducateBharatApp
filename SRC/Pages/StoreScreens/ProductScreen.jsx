import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { COLOR, windowWidth } from '../../Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast, useToast } from 'react-native-toast-notifications';
import { useNavigation } from '@react-navigation/native';
import { BACKEND_URL } from "@env";

const ProductScreen = ({ route }) => {
    const navigation = useNavigation();
    const { product } = route.params;
    const toast = useToast();
    const [quantity, setQuantity] = useState(1);
    const [total, setTotal] = useState(product.productPrice);

    useEffect(() => {
        setTotal(product.productPrice * quantity);
    }, [quantity]);
    const BuyNow = async () => {
        await clearCart();
        await AddToCart();
        navigation.navigate('CartScreen');
    }
    const AddToCart = async () => {
        const token = await AsyncStorage.getItem("token");
        fetch(BACKEND_URL + "/addToCart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                fullproduct: product,
                quantity: quantity,
                price: product.productPrice
            })
        })
            .then(res => res.json())
            .then(data => {
                data.error ? Toast.show(data.error, { type: "danger" }) : Toast.show(data.message);
            })
            .catch(err => {
                Toast.show("Something went wrong", { type: "danger" });
                console.log(err);
            });
    };


    const clearCart = async () => {
        let token = await AsyncStorage.getItem('token')
        fetch(BACKEND_URL + "/clearCart", {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
            })
            .catch(err => {
                setLoading(false)
                console.log(err)
            })
    };

    return (
        <View style={styles.fullpage}>
            <View style={styles.topbar}>
                <Ionicons name="return-up-back-outline" size={30} style={styles.backbtn} onPress={() => navigation.goBack()} />
            </View>
            <ScrollView>
                <Image source={{ uri: product.productImages[0] }} style={styles.productImage} />
                <View style={styles.row}>
                    <Text style={styles.productName}>{product.productName}</Text>
                    <Text style={styles.price}>₹{total}</Text>
                    <Text style={styles.discountedPrice}>₹{parseInt(total + total * 0.1)}</Text>
                </View>
                <Text style={styles.description} numberOfLines={10}>{product.productDescription}</Text>
                <View style={styles.stars}>
                    {[...Array(4)].map((_, i) => (
                        <FontAwesome key={i} name="star" size={20} color={COLOR.col2} style={styles.star} />
                    ))}
                    <FontAwesome name="star-half-full" size={20} color={COLOR.col2} style={styles.star} />
                    <Text style={styles.rating}>4.5</Text>
                </View>
                <View style={{ height: 100 }} />
            </ScrollView>

            <View style={styles.pricebar}>
                <View style={styles.quantityControls}>
                    <TouchableOpacity onPress={() => quantity > 1 && setQuantity(quantity - 1)}>
                        <AntDesign name="minuscircleo" size={20} color={COLOR.col3} />
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{quantity}</Text>
                    <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
                        <AntDesign name="pluscircleo" size={20} color={COLOR.col3} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.addToCartButton} onPress={() => AddToCart()}>Add To Cart</Text>
                <Text style={styles.addToCartButton} onPress={() => BuyNow()}>Buy Now</Text>

            </View>
        </View>
    );
};

export default ProductScreen;

const styles = StyleSheet.create({
    fullpage: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topbar: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        width: windowWidth,
    },
    backbtn: {
        color: COLOR.col3,
    },
    productImage: {
        width: windowWidth,
        height: 300,
        resizeMode: "contain",
    },
    row: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLOR.col3,
        width: '60%',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLOR.col3,
    },
    discountedPrice: {
        fontSize: 14,
        color: 'gray',
        textDecorationLine: 'line-through',
    },
    description: {
        fontSize: 10,
        color: '#333',
        paddingHorizontal: 10,
        paddingTop: 5,
    },
    stars: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    star: {
        marginRight: 2,
    },
    rating: {
        fontSize: 16,
        marginLeft: 5,
        color: COLOR.col3,
    },
    pricebar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: COLOR.col3,
        gap: 10
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLOR.col1,
        paddingVertical: 10,

        paddingHorizontal: 10,
        borderRadius: 5,
    },
    quantity: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingHorizontal: 10,
        color: COLOR.col3,
    },
    addToCartButton: {
        backgroundColor: COLOR.col1,
        color: COLOR.col2,
        fontWeight: 'bold',
        flex: 1,
        borderRadius: 5,
        overflow: 'hidden',
        padding: 5,
        textAlign: 'center',
        paddingVertical: 10
    },
});

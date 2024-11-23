import { ActivityIndicator, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'

import { COLOR } from '../../Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL, RAZORPAY_KEY_ID } from '@env'
import { Toast } from 'react-native-toast-notifications';
import RazorpayCheckout from 'react-native-razorpay';

const CartScreen = () => {
    let razorpayKeyId = RAZORPAY_KEY_ID

    const navigation = useNavigation();
    const [cartData, setCartData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [shipping, setShipping] = useState(2);
    const [totalAmount, setTotalAmount] = useState(0);
    const [tax, setTax] = useState(12);
    const [address, setAddress] = useState({
        AddressLine1: "",
        AddressLine2: "",
        City: "",
        State: "",
        Pincode: ""
    });
    const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
    const [addressLoading, setAddressLoading] = useState(false)

    const getCardData = async () => {
        let token = await AsyncStorage.getItem('token')
        setLoading(true);

        fetch(BACKEND_URL + "/getCart", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setCartData(data.userCart);
                const total = data.userCart.reduce((acc, item) => acc + (parseInt(item.fullproduct.productPrice) * item.quantity), 0)
                setTotalAmount(total)
                setShipping(3)
                setTax(12)
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        // Fetch data here (fetchCartData, fetchAddress)
        getCardData();
        getUserAddress();
    }, []);

    const deleteCartItem = async (cartItemId) => {
        let token = await AsyncStorage.getItem('token')
        console.log("cartitemId", cartItemId)
        fetch(BACKEND_URL + "/deleteCart", {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cartitemId: cartItemId
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log("data", data)
                Toast.show("Item Deleted")
                setCartData(data.userCart)
            })
            .catch(err => {
                setLoading(false)
                console.log(err)
            })
    };

    // const clearCart = () => {
    //     setCartData([]);
    //     Toast.show("Cart Cleared");
    // };
    const buyNow = async () => {
        let token = await AsyncStorage.getItem('token')

        if (address.AddressLine1 == "" || address.City == "" || address.State == "" || address.Pincode == "") {
            Toast.show("Please add an address")
            return
        }
        var options = {
            description: 'Buy Products',
            image: '',
            currency: 'INR',
            key: razorpayKeyId,
            amount: (totalAmount + (totalAmount * shipping / 100) + (totalAmount * tax / 100)) * 100,
        }

        RazorpayCheckout.open(options).then((data) => {
            fetch(BACKEND_URL + "/buyProducts", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    cartdata: cartData,
                    cartTotal: totalAmount,
                    paymentMethod: "ONLINE",
                    shipping: shipping,
                    tax: tax,
                    address: address,
                    paymentId: data.razorpay_payment_id,
                })
            })
                .then(res => res.json())
                .then(data => {
                    console.log("data", data)
                    if (data.error) {
                        Toast.show(data.error)
                        return
                    }
                    Toast.show("Order Placed")
                    setCartData(data.userCart)
                    navigation.navigate("AllOrdersScreen")
                })
                .catch(err => {
                    Toast.show("Something went wrong")
                    setLoading(false)
                    console.log(err)
                })
        }).catch((error) => {
            // handle failure
            Toast.show("Something went wrong")
            console.log(error)
        })




    }

    // ADDRESS
    const getUserAddress = async () => {
        const token = await AsyncStorage.getItem('token')
        fetch(BACKEND_URL + "/getUserAddress", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log("get address -> ", data.address)
                setAddress(data.address)
            })
            .catch(err => {
                setLoading(false)
                console.log(err)
            })
    }
    const addNewAddress = async () => {
        if (address.AddressLine1.length > 0 && address.City.length > 0 && address.Pincode.length > 0) {
            // 
            setAddressLoading(true)
            const token = await AsyncStorage.getItem('token')
            fetch(BACKEND_URL + "/addUserAddress", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    address: address
                })
            })
                .then(res => res.json())
                .then(data => {
                    setAddressLoading(false)
                    console.log("data", data)
                    setAddress(data.address)
                    Toast.show("Address Updated")
                })
                .catch(err => {
                    Toast.show("Something went wrong")
                    setAddressLoading(false)
                    console.log(err)
                })
            setIsAddressModalVisible(false)

        }
        else {
            Toast.show("Please provide all important fields!!")

        }
    }
    const openAddressModal = () => setIsAddressModalVisible(true);
    const closeAddressModal = () => setIsAddressModalVisible(false);



    const handleProductClick = (item) => {
        // console.log(item)
        navigation.navigate("ProductScreen", { product: item })

    }
    const renderCartItem = (item, index) => (
        <TouchableOpacity key={index} style={styles.cartItem} onPress={() => handleProductClick(item.fullproduct)}>
            <Image source={{ uri: item.fullproduct.productImages[0] }} style={styles.image} />

            <Text style={styles.quantity}>{item.quantity}</Text>
            <Text style={styles.name}>{item.fullproduct.productName}</Text>
            <Text style={styles.price}>Rs. {parseInt(item.price) * parseInt(item.quantity)}</Text>

            <AntDesign name="delete" size={20} color={COLOR.col2} onPress={() => deleteCartItem(item.cartitemId)} />
        </TouchableOpacity>
    );
    return (
        <View style={styles.fullPage}>
            <View style={styles.topBar}>
                <Ionicons
                    name="return-up-back-outline"
                    size={20}
                    color={COLOR.col2}
                    onPress={() => navigation.goBack()}
                />
                <Text style={styles.title}>Your Cart</Text>
                <Text style={styles.myOrders} onPress={() => navigation.navigate('AllOrdersScreen')}>My Orders</Text>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#000" />
            ) : cartData.length > 0 ? (
                <ScrollView style={styles.cartContainer}>
                    {cartData.map(renderCartItem)}
                    <View style={styles.summaryTable}>
                        <View style={styles.row}>
                            <Text style={styles.cellLeft}>Cart Total:</Text>
                            <Text style={styles.cellRight}>Rs. {totalAmount}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.cellLeft}>Shipping:</Text>
                            <Text style={styles.cellRight}>Rs. {totalAmount * shipping / 100}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.cellLeft}>Tax:</Text>
                            <Text style={styles.cellRight}>Rs. {totalAmount * tax / 100}</Text>
                        </View>
                        <View style={styles.rowTotal}>
                            <Text style={styles.cellLeftTotal}>Grand Total:</Text>
                            <Text style={styles.cellRightTotal}>Rs. {totalAmount + (totalAmount * shipping / 100) + (totalAmount * tax / 100)}</Text>
                        </View>
                    </View>

                    {
                        address.AddressLine1.length > 0 && address.City.length > 0 && address.Pincode.length > 0 ?
                            <TouchableOpacity onPress={() => openAddressModal()}>
                                <Text style={styles.addressHeading}>Delivery Address:</Text>
                                <Text style={styles.addressText}>
                                    {address.AddressLine1 && address.AddressLine1 + ','} {address.City && address.City + ','} {address.State && address.State + ','}  {address.Pincode}
                                    {'  '}
                                    <Text style={styles.editAddress}>Edit Address</Text>


                                </Text>


                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={styles.noAddress} onPress={() => openAddressModal()}>
                                <Text style={styles.noAddressText}>Please provide an address</Text>
                                <Text style={styles.noAddressButton}>Select</Text>
                            </TouchableOpacity>
                    }

                    {cartData.length > 0 && address.AddressLine1.length > 0 && address.City.length > 0 && address.Pincode.length > 0 && (
                        <TouchableOpacity style={styles.buyNowButton} onPress={buyNow}>
                            <Text style={styles.buyNowText}>Buy Now</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            ) : (
                <View style={styles.emptyCart}>
                    <Feather name="shopping-cart" size={80} color={COLOR.col2} />
                    <Text style={styles.emptyCartText}>Your cart is empty</Text>
                </View>
            )}

            <Modal
                visible={isAddressModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={closeAddressModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ScrollView>
                            <Text style={styles.modalTitle}>Edit Address</Text>

                            <Text style={styles.label}>Address Line 1<Text style={{ color: 'red' }}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Address Line 1"
                                value={address.AddressLine1}
                                onChangeText={(text) => setAddress({ ...address, AddressLine1: text })}
                            />
                            <Text style={styles.label}>Address Line 2</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Address Line 2"
                                value={address.AddressLine2}
                                onChangeText={(text) => setAddress({ ...address, AddressLine2: text })}
                            />
                            <Text style={styles.label}>City<Text style={{ color: 'red' }}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter City"
                                value={address.City}
                                onChangeText={(text) => setAddress({ ...address, City: text })}
                            />

                            <Text style={styles.label}>State</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter State"
                                value={address.State}
                                onChangeText={(text) => setAddress({ ...address, State: text })}
                            />

                            <Text style={styles.label}>Pincode<Text style={{ color: 'red' }}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Pincode"
                                keyboardType="numeric"
                                value={address.Pincode}
                                onChangeText={(text) => setAddress({ ...address, Pincode: text })}
                            />

                            <View style={styles.modalActions}>
                                <TouchableOpacity style={styles.cancelButton} onPress={closeAddressModal}>
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.saveButton} onPress={addNewAddress}>
                                    <Text style={styles.saveButtonText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default CartScreen

const styles = StyleSheet.create({
    fullPage: {
        backgroundColor: 'white',
        flex: 1,

    },
    topBar: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#fff', elevation: 3 },
    title: { flex: 1, fontSize: 14, fontWeight: 'bold', textAlign: 'center', color: COLOR.col3 },
    myOrders: { color: COLOR.col1, fontWeight: '600', fontSize: 10, borderColor: COLOR.col1, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 5 },

    // middle
    cartContainer: {
        flex: 1,
        paddingHorizontal: 10
    },
    emptyCart:{
     
        flex:1,
        justifyContent:'center',
       alignItems:'center'
    },
    emptyCartText:{
        color:COLOR.col2
    },
    cartItem: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#fff', marginBottom: 10 },
    image: { width: 30, height: 30, borderRadius: 5 },
    info: { flex: 1, paddingLeft: 10 },
    name: { fontWeight: '600', fontSize: 12, flex: 1 },
    quantity: { color: COLOR.col3 },
    price: { marginTop: 5, fontWeight: '600' },

    // price table
    // summarytable
    summaryTable: {
        width: '100%',
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 5,
        alignSelf: 'center'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    rowTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 12,
    },
    cellLeft: {
        fontSize: 12,
        fontWeight: '400',
        color: COLOR.col2,
    },
    cellRight: {
        fontSize: 14,
        fontWeight: '500',
        color: COLOR.col3,
    },
    cellLeftTotal: {
        fontSize: 16,
        fontWeight: '400',
        color: COLOR.col3,
    },
    cellRightTotal: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLOR.col3,
    },
    addressHeading: { fontSize: 16, marginTop: 20, fontWeight: '600' },
    addressText: { fontSize: 14, color: 'grey', marginTop: 5 },
    editAddress: { color: 'blue', fontSize: 14, marginTop: 5 },


    // NO ADDRESS
    noAddress: {
        backgroundColor: '#f9f9f9', // Light gray background
        padding: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 5,

        borderWidth: 1,
        flexDirection: 'row',
        gap: 10,
        borderColor: COLOR.col1, // Border to make it stand out
        borderStyle: 'dashed'
    },
    noAddressText: {
        fontSize: 10,
        fontWeight: '400',
        color: COLOR.col1, // Neutral color for text
        textAlign: 'center',
    },
    noAddressButton: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: COLOR.col1, // Blue button
        paddingVertical: 4,
        paddingHorizontal: 20,
        borderRadius: 20,
        textAlign: 'center',
    },
    addressHeading: { fontSize: 12, marginTop: 20, fontWeight: '500', color: COLOR.col3 },
    addressText: { fontSize: 14, color: 'grey', marginTop: 5 },
    editAddress: { color: COLOR.col3, fontSize: 10, marginTop: 5, textDecorationLine: 'underline' },

    // bottom
    buyNowButton: { backgroundColor: COLOR.col3, padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 20 },
    buyNowText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },


    // MODAL

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '400',
        marginBottom: 20,
        color: COLOR.col3,

    },
    label: {
        fontSize: 10,
        fontWeight: '400',
        color: '#333',
        marginBottom: 5,
    },
    input: {

        fontSize: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    cancelButton: {
        padding: 10,
        backgroundColor: '#ccc',
        borderRadius: 5,
        flex: 1,
        marginRight: 8,
    },
    saveButton: {
        padding: 10,
        backgroundColor: COLOR.col3,
        borderRadius: 5,
        flex: 1,
        marginLeft: 8,
    },
    cancelButtonText: {
        color: '#333',
        textAlign: 'center',
    },
    saveButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
})
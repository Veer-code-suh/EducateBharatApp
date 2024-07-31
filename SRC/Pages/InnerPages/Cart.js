import { StyleSheet, Text, View, ActivityIndicator, Image, Modal, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BACKEND_URL } from '@env'
import { COLOR } from '../../Constants'
import { ScrollView } from 'react-native-gesture-handler'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useToast } from 'react-native-toast-notifications'
import Feather from 'react-native-vector-icons/Feather'
import RazorpayCheckout from 'react-native-razorpay';
import {RAZORPAY_KEY_ID , RAZORPAY_KEY_SECRET} from '@env'


const Cart = ({navigation}) => {
    const toast = useToast()
    const [cartdata, setCartdata] = useState([])
    const [loading, setLoading] = useState(false)
    const [shipping, setShipping] = useState(2)
    const [totalAmount, setTotalAmount] = useState(0)
    const [tax, setTax] = useState(12)
    const [address, setAddress] = useState({
        AddressLine1: "",
        AddressLine2: "",
        City: "",
        State: "",
        Pincode: ""
    })


    const getCartData = async () => {
        let token = await AsyncStorage.getItem('token')
        setLoading(true)
        fetch(BACKEND_URL + "/getCart", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setLoading(false)
                console.log("data", data.userCart[0])


                // {"cartitemId": "c51ec7f1-a639-4bb2-a80f-4f215787eb72", "fullproduct": {"__v": 4, "_id": "6483235d1ac20f6bb1b6f3f9", "createdAt": "2023-06-09T13:04:29.510Z", "productCategory": "", "productDescription": "You can use the Permissions tab to manage access permissions and object ownership. In Amazon S3, buckets and objects are private by default. You must explicitly grant permissions for your buckets and the objects in them.", "productImages": ["https://educatebharatbackendbucket.s3.ap-south-1.amazonaws.com/WhatsApp%20Image%202023-06-21%20at%201.00.47%20PM.jpeg"], "productName": "product 3", "productPrice": "1000", "productRating": "4.5", "productReviews": [], "productStock": "INSTOCK", "updatedAt": "2023-06-21T09:57:25.315Z"}, "price": "1000", "quantity": 2}
                setCartdata(data.userCart)
                const total = data.userCart.reduce((acc, item) => acc + (parseInt(item.fullproduct.productPrice) * item.quantity), 0)
                setTotalAmount(total)
                setShipping(3)
                setTax(12)
            })
            .catch(err => {
                setLoading(false)
                console.log(err)
            })
    }

    const deleteCartItem = async (cartitemId) => {
        let token = await AsyncStorage.getItem('token')
        console.log("cartitemId", cartitemId)
        fetch(BACKEND_URL + "/deleteCart", {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cartitemId: cartitemId
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log("data", data)
                toast.show("Item Deleted")
                setCartdata(data.userCart)
            })
            .catch(err => {
                setLoading(false)
                console.log(err)
            })
    }

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
                console.log("data", data)
                setAddress(data.address)
            })
            .catch(err => {
                setLoading(false)
                console.log(err)
            })
    }
    React.useEffect(() => {
        getCartData()
        getUserAddress()
    }, [])

    let razorpayKeyId = RAZORPAY_KEY_ID
    let razorpayKeySecret = RAZORPAY_KEY_SECRET
    const buyNow = async () => {
        if(address.AddressLine1 == "" || address.City == "" || address.State == "" || address.Pincode == ""){
            toast.show("Please add an address")
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
                    cartdata: cartdata,
                    cartTotal: totalAmount,
                    paymentMethod: "COD",
                    shipping: shipping,
                    tax: tax,
                    address: address,
                    paymentId: data.razorpay_payment_id,
                })
            })
                .then(res => res.json())
                .then(data => {
                    console.log("data", data)
                    if(data.error){
                        toast.show(data.error)
                        return
                    }
                    toast.show("Order Placed")
                    setCartdata(data.userCart)                                                                                                        
                    navigation.navigate("allorders")
                })
                .catch(err => {
                    toast.show("Something went wrong")
                    setLoading(false)
                    console.log(err)
                })
        }).catch((error) => {
            // handle failure
            toast.show("Something went wrong")
            console.log(error)
        })
        const token = await AsyncStorage.getItem('token')

        
        
    }


    // address popup
    const [isVisible, setIsVisible] = useState(false);
    const togglePopup = () => {
        setIsVisible(!isVisible);
    };

    const [addressLoading, setAddressLoading] = useState(false)
    const updateAddress = async () => {
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
                toast.show("Address Updated")
                togglePopup()
            })
            .catch(err => {
                toast.show("Something went wrong")
                setAddressLoading(false)
                console.log(err)
                togglePopup()
            })
    }
    return (
        <View style={{
            flex: 1,
            backgroundColor: COLOR.col4
        }}>
            {
                loading == true &&
                <ActivityIndicator size="large" color={COLOR.col3} />
            }

            {
                cartdata.length > 0 ?
                    <ScrollView style={{
                        flex: 1,

                    }} >
                        {
                            cartdata.map((item, index) => {
                                return (
                                    <View key={index} style={styles.cartitem}>




                                        <View style={styles.left}>
                                            <Text style={styles.quantity}>{item.quantity} X </Text>
                                            <Image
                                                source={{
                                                    uri: item.fullproduct.productImages[0]
                                                }}
                                                style={styles.image}
                                            />
                                            <Text style={styles.name}>{item.fullproduct.productName}</Text>
                                        </View>

                                        <View style={styles.right}>
                                            <Text style={styles.price}>Rs. {parseInt(item.price) * parseInt(item.quantity)}</Text>
                                            <AntDesign name="delete" size={24} color={COLOR.col3}
                                                onPress={() => deleteCartItem(item.cartitemId)}
                                            />
                                        </View>
                                    </View>
                                )
                            })

                        }

                        <View
                            style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                backgroundColor: COLOR.col1,
                                color: COLOR.col4,
                                elevation: 10,
                                textAlign: 'right',
                                margin: 20,
                                padding: 10,
                                borderRadius: 10,
                                display: 'flex',
                            }}

                        >
                            <View style={
                                styles.leftright
                            }>
                                <Text style={styles.lefttext}>Cart Total:</Text>
                                <Text style={styles.righttext}>Rs. {totalAmount}</Text>
                            </View>
                            <View style={
                                styles.leftright
                            }>
                                <Text style={styles.lefttext}>Shipping Charges :</Text>
                                <Text style={styles.righttext}>Rs. {totalAmount * shipping / 100}</Text>
                            </View>

                            <View style={
                                styles.leftright
                            }>
                                <Text style={styles.lefttext}>Tax :</Text>
                                <Text style={styles.righttext}>Rs. {totalAmount * tax / 100}</Text>
                            </View>

                            <View style={
                                styles.leftright1
                            }>
                                <Text style={styles.lefttext1}>Grand Total :</Text>
                                <Text style={styles.righttext1}>Rs. {
                                    totalAmount + (totalAmount * shipping / 100) + (totalAmount * tax / 100)
                                }</Text>
                            </View>

                            <View style={
                                {
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginVertical: 10,
                                }
                            }>
                                <Text style={styles.name}>Delivery Address </Text>
                                {
                                    address?.AddressLine1 == "" &&
                                        address?.AddressLine2 == "" &&
                                        address?.City == "" &&
                                        address?.State == "" &&
                                        address?.Pincode == ""
                                        ?
                                        <Text style={{
                                            fontSize: 12,
                                            fontWeight: '400',
                                            color: 'red',
                                        }}
                                            onPress={() => togglePopup()}
                                        >Click to add an address +</Text>
                                        :
                                        <View style={styles.addressout}>
                                            <Text style={styles.address}>{address?.AddressLine1 &&
                                                address?.AddressLine1
                                            }
                                                {
                                                    address?.AddressLine2 &&
                                                    ", " + address?.AddressLine2
                                                }
                                                {
                                                    address?.City &&
                                                    ", " + address?.City
                                                }
                                                {
                                                    address?.State &&
                                                    ", " + address?.State
                                                }
                                                {
                                                    address?.Pincode &&
                                                    ", " + address?.Pincode
                                                }
                                            </Text>

                                            <AntDesign name="edit" size={15} color={COLOR.col1} style={{
                                                position: 'absolute', right: -5, top: -5,
                                                backgroundColor: COLOR.col3,
                                                borderRadius: 10,
                                                padding: 3,
                                            }}
                                                onPress={() => togglePopup()}
                                            />
                                        </View>
                                }
                            </View>

                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    backgroundColor: COLOR.col3,
                                    color: COLOR.col4,
                                    elevation: 10,
                                    borderRadius: 10,
                                    textAlign: 'center',
                                    padding: 10,
                                }}
                                onPress={() => {
                                    buyNow()
                                }}
                            >Buy Now</Text>
                        </View>
                    </ScrollView>
                    :
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Feather name="shopping-cart" size={100} color={COLOR.col3} />
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: '400',
                                color: COLOR.col3,
                                marginTop: 20,
                            }}
                        >Your cart is empty</Text>
                    </View>
            }


            <Modal
                visible={isVisible}
                animationType="slide"
                transparent={true}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                }}>
                    <View style={{
                        backgroundColor: '#FFFFFF',
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        padding: 16,
                        height: '60%'
                    }}>
                        {/* Content of your popup */}
                        {/* . .. */}

                        <TouchableOpacity onPress={togglePopup}
                            style={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                            }}
                        >
                            <AntDesign name="close" size={24} color={COLOR.col3} />
                        </TouchableOpacity>

                        <ScrollView>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Address Line 1</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Address Line 1"
                                    value={address.AddressLine1}
                                    placeholderTextColor={COLOR.col4}
                                    onChangeText={(text) =>
                                        setAddress({
                                            ...address,
                                            AddressLine1: text
                                        })
                                    }
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Address Line 2</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Address Line 2 (Optional)"
                                    placeholderTextColor={COLOR.col4}
                                    value={address.AddressLine2}
                                    onChangeText={(text) =>
                                        setAddress({
                                            ...address,
                                            AddressLine2: text
                                        })
                                    }
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>City</Text>
                                <TextInput
                                    placeholderTextColor={COLOR.col4}
                                    style={styles.input}
                                    placeholder="City"
                                    value={address.City}
                                    onChangeText={(text) =>
                                        setAddress({
                                            ...address,
                                            City: text
                                        })
                                    }
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>State</Text>
                                <TextInput
                                    placeholderTextColor={COLOR.col4}
                                    style={styles.input}
                                    placeholder="State"
                                    value={address.State}
                                    onChangeText={(text) =>
                                        setAddress({
                                            ...address,
                                            State: text
                                        })
                                    }
                                />
                            </View>


                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Pincode</Text>
                                <TextInput
                                    placeholderTextColor={COLOR.col4}
                                    style={styles.input}
                                    placeholder="Pincode"
                                    value={address.Pincode}
                                    keyboardType='numeric'
                                    onChangeText={(text) =>
                                        setAddress({
                                            ...address,
                                            Pincode: text
                                        })
                                    }
                                />
                            </View>

                            {
                                addressLoading ?
                                    <ActivityIndicator size="large" color={COLOR.col3} />
                                    :
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: COLOR.col3,
                                            padding: 10,
                                            borderRadius: 10,
                                            marginTop: 10,
                                        }}
                                        onPress={() => {
                                            if (address.AddressLine1 == "" ||
                                                address.City == "" ||
                                                address.State == "" ||
                                                address.Pincode == "") {
                                                alert("Please fill all the fields")
                                            }
                                            else {
                                                updateAddress()
                                            }
                                        }}
                                    >
                                        <Text style={{
                                            fontSize: 18,
                                            fontWeight: 'bold',
                                            color: COLOR.col4,
                                            textAlign: 'center',
                                        }}>Save</Text>
                                    </TouchableOpacity>
                            }
                        </ScrollView>

                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default Cart

const styles = StyleSheet.create({
    cartitem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        margin: 5,
        backgroundColor: COLOR.col1,
        borderRadius: 10,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '70%',
    },
    quantity: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLOR.col3,
    },
    image: {
        width: 20,
        height: 20,
        backgroundColor: COLOR.col3,
        marginHorizontal: 10,
        objectFit: 'contain'
    },
    name: {
        fontSize: 14,
        fontWeight: '400',
        color: COLOR.col3,
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLOR.col3,
    },
    leftright: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    lefttext: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLOR.col4,
    },
    righttext: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLOR.col4,
    },
    leftright1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,

    },
    lefttext1: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLOR.col3,
    },
    righttext1: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLOR.col3,
    },
    lefttext2: {
        fontSize: 13,
    },
    addressout: {
        width: '100%',
        flexDirection: 'row',
       
    },
    address: {
        fontSize: 12,
        backgroundColor: COLOR.col4,
        padding: 5,
        borderRadius: 10, color: COLOR.col3,
        padding: 10,
    },
    inputContainer: {
        marginVertical: 5,
    },
    label: {
        fontSize: 12,
        fontWeight: '400',
        color: COLOR.col3,
    },
    input: {
        fontSize: 16,
        fontWeight: '400',
        color: COLOR.col3,
        borderBottomWidth: 1,
        borderBottomColor: COLOR.col3,

    }
})
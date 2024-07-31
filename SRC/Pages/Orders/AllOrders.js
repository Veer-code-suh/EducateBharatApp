import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BACKEND_URL } from '@env'
import { COLOR } from '../../Constants'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { ScrollView } from 'react-native'

const AllOrders = ({ navigation }) => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false)

    // {"__v": 0, "_id": "647dacd967aed83698235f9a", "carttotal": "1200", "createdAt": "2023-06-05T09:37:29.799Z", "deliveryBoy": {"name": "", "phone": ""}, "isDelivered": false, "isPaid": false, "orderItems": [[Object]], "paidAt": null, "paymentId": "0", "paymentMethod": "COD", "shippingAddress": {"AddressLine1": "B-2", "AddressLine2": "Sahib Parisar", "City": "Jabalpur", "Pincode": "482001", "State": "MP"}, "shippingCost": "3", "tax": "12", "updatedAt": "2023-06-05T09:37:29.799Z", "userId": "647d3ba65dee0aa680afbdac"}, "userCart": [{"cartitemId": "93b3de81-a847-466b-a7fd-0bd1717429c8", "fullproduct": [Object], "price": "1200", "quantity": 3}

    const getOrders = async () => {
        setLoading(true)
        let token = await AsyncStorage.getItem('token')
        fetch(`${BACKEND_URL}/getOrders`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },

        })
            .then(res => res.json())
            .then(data => {
                // console.log(data.orders[0])
                // {"orders": ["647dacd967aed83698235f9a"]}
                setLoading(false)
                setOrders(data.orders)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
    }
    React.useEffect(() => {
        getOrders()
    }, [])

    const convertDate = (date) => {
        let d = new Date(date)
        return d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear()
    }
    return (
        <View>
            {
                loading == false && orders.length == 0 &&
                <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <AntDesign name="heart" size={100} color={COLOR.col4} />
                    <Text style={{ fontSize: 20, fontWeight: '400', color: COLOR.col4 }}>No Orders Yet</Text>
                </View>
            }
            {
                loading == true &&
                <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <ActivityIndicator size="large" color={COLOR.col3} />

                </View>
            }
            {
                loading == false && orders.length > 0 &&
                <ScrollView
                    style={{ height: '100%' }}
                >
                    {
                        orders.sort(
                            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                        ).map((order, index) => {
                            return (
                                <TouchableOpacity key={index} onPress={() => navigation.navigate("orderpage", { orderId: order.orderid })}>
                                    <View key={index} style={{
                                        padding: 10, borderWidth: 1, borderColor: COLOR.col4, margin: 10,
                                        borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                                        backgroundColor: COLOR.col4
                                    }}>
                                        <Text
                                            style={{
                                                fontSize: 12, fontWeight: '400', color: COLOR.col1, marginRight: 10,
                                                backgroundColor: COLOR.col3,
                                                borderRadius: 50,
                                                // width: 30,
                                                textAlign: 'center',
                                                height: 30,
                                                textAlignVertical: 'center',
                                                paddingHorizontal: 10
                                            }}
                                        >{
                                            convertDate(order.createdAt)
                                        }</Text>
                                        <Text style={{ fontSize: 13, fontWeight: '400', color: COLOR.col3 }}>{order.orderid
                                        }</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </ScrollView>
            }

        </View>
    )
}

export default AllOrders

const styles = StyleSheet.create({})
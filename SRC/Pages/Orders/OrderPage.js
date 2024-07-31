import { StyleSheet, Text, View, ScrollView , ActivityIndicator} from 'react-native'
import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BACKEND_URL } from '@env'
import { COLOR } from '../../Constants'
import { useToast } from 'react-native-toast-notifications'


const OrderPage = ({ navigation, route }) => {
    const toast = useToast();
    const { orderId } = route.params;
    console.log(orderId);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const getOrderByOrderId = async () => {
        const token = await AsyncStorage.getItem('token');
        setLoading(true);

        fetch(BACKEND_URL + '/getOrderById', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ orderId: orderId })
        })
            .then(res => res.json())
            .then(data => {
                setLoading(false);
                if (data.error) {
                    toast.show(data.error, { type: "danger" })
                    return;
                }
                else {
                    setOrder(data.order);
                    // console.log(data.order);
                }
            })
            .catch(err => {
                setLoading(false);
                toast.show("Something went wrong", { type: "danger" })
            })
    };

    React.useEffect(() => {
        getOrderByOrderId();
    }, []);


    const cancelOrder = async () => {
        const token = await AsyncStorage.getItem('token');

        fetch(BACKEND_URL + '/cancelOrder', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ orderId: orderId })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    toast.show(data.error, { type: "danger" })
                    return;
                }
                else {
                    toast.show(data.message, { type: "success" })
                    setOrder(data.order);
                }
            })
    }
    return (
        <View style={{
            flex: 1,
            backgroundColor: COLOR.col1
        }}>
            {
                order &&
                <ScrollView>
                    <View style={{
                        height: 50,
                    }}></View>
                    <Text
                        style={styles.orderitemshead}
                    >Order Details</Text>

                    {/* {"__v": 0, "_id": "647dacd967aed83698235f9a", "carttotal": "1200", "createdAt": "2023-06-05T09:37:29.799Z", 
            "deliveryBoy": {"name": "", "phone": ""}, "isDelivered": false, "isPaid": false, 
            "orderItems": [{"cartitemId": "93b3de81-a847-466b-a7fd-0bd1717429c8", "fullproduct": [Object], "price": "1200", "quantity": 3}][{"cartitemId": "93b3de81-a847-466b-a7fd-0bd1717429c8", "fullproduct": {"__v": 0, "_id": "647d6b785dee0aa680afbf35", "createdAt": "2023-06-05T04:58:32.539Z", "productCategory": "", "productDescription": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", "productImages": [Array], "productName": "product 1", "productPrice": "1200", "productRating": "4.5", "productReviews": [Array], "productStock": "INSTOCK", "updatedAt": "2023-06-05T04:58:32.539Z"}, "price": "1200", "quantity": 3}], 
            "paidAt": null, "paymentId": "0", "paymentMethod": "COD", 
            "shippingAddress": {"AddressLine1": "B-2", "AddressLine2": "Sahib Parisar", "City": "Jabalpur", "Pincode": "482001", "State": "MP"}, "shippingCost": "3", "tax": "12", "updatedAt": "2023-06-05T09:37:29.799Z", "userId": "647d3ba65dee0aa680afbdac"} */}


                    <View style={styles.leftright}>
                        <Text style={styles.t1}>Order Id:</Text>
                        <Text style={styles.t2}>{order._id}</Text>
                    </View>
                    <View style={styles.leftright}>
                        <Text style={styles.t1}>Order Date:</Text>
                        <Text style={styles.t2}>{order.createdAt}</Text>
                    </View>
                    <View style={styles.leftright}>
                        <Text style={styles.t1}>Order Status: </Text>
                        <Text style={styles.t2}>{
                            order.isCancelled ? "Cancelled" :
                            order.isDelivered
                        }</Text>
                    </View>
                    {/* deliveryBoy */}
                    <View style={styles.leftright}>
                        <Text style={styles.t1}>Delivery Boy Name: </Text>
                        <Text style={styles.t2}>{
                            order.deliveryBoy.name ? order.deliveryBoy.name : "Not Assigned"
                        }</Text>
                    </View>
                    <View style={styles.leftright}>
                        <Text style={styles.t1}>Delivery Boy Phone: </Text>
                        <Text style={styles.t2}>{
                            order.deliveryBoy.phone ? order.deliveryBoy.phone : "Not Assigned"
                        }</Text>
                    </View>
                    <View style={styles.leftright}>
                        <Text style={styles.t1}>Payment Method: </Text>
                        <Text style={styles.t2}>{order.paymentMethod}</Text>
                    </View>

                    <View style={styles.leftright}>
                        <Text style={styles.t1}>Payment Status: </Text>
                        <Text style={styles.t2}>{order.isPaid ? "Paid" : "Not Paid"}</Text>
                    </View>
                    <View style={styles.leftright}>
                        <Text style={styles.t1}>Payment Id: </Text>
                        <Text style={styles.t2}>{order.paymentId}</Text>
                    </View>
                    <View style={styles.leftright}>
                        <Text style={styles.t1}>Shipping Address: </Text>
                        <Text style={styles.t2}>{order.shippingAddress.AddressLine1}, {order.shippingAddress.AddressLine2}, {order.shippingAddress.City}, {order.shippingAddress.Pincode}, {order.shippingAddress.State}</Text>
                    </View>
                    <View style={styles.leftright}>
                        <Text style={styles.t1}>Shipping Cost: </Text>
                        <Text style={styles.t2}>{order.shippingCost}%</Text>
                    </View>
                    <View style={styles.leftright}>
                        <Text style={styles.t1}>Tax: </Text>
                        <Text style={styles.t2}>{order.tax}%</Text>
                    </View>
                    <View style={styles.leftright}>
                        <Text style={styles.t1}>Cart Total: </Text>
                        <Text style={styles.t2}>Rs {order.carttotal}</Text>
                    </View>



                    <View style={styles.orderitems}>
                        {/* seperate */}
                        <Text style={styles.orderitemshead}>Order Items: </Text>
                        {
                            order.orderItems && order.orderItems.map((item, index) => {
                                return (
                                    <View key={index} style={styles.orderitem}>
                                        <View style={styles.leftright}>
                                            <Text style={styles.t1}>Product Name: </Text>
                                            <Text style={styles.t2}>{item.fullproduct.productName}</Text>
                                        </View>
                                        <View style={styles.leftright}>
                                            <Text style={styles.t1}>Product Price: </Text>
                                            <Text style={styles.t2}>Rs {item.price}</Text>
                                        </View>

                                        <View style={styles.leftright}>
                                            <Text style={styles.t1}>Product Quantity: </Text>
                                            <Text style={styles.t2}>{item.quantity}</Text>
                                        </View>
                                    </View>
                                )
                            }
                            )
                        }
                    </View>

                    {
                        order.isCancelled ?
                            <Text style={styles.cancelled}
                                onPress={() => {}}
                            >Cancelled !</Text>
                            :
                            <Text style={styles.cancel}
                                onPress={() => cancelOrder(order._id)}
                            >Cancel Order</Text>
                    }


                </ScrollView>
            }
            {
                loading && 
                <ActivityIndicator size="large" color={COLOR.col3} />
            }
        </View>
    )
}

export default OrderPage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.col1, // Set the background color to white
    },
    leftright: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 8,
        paddingHorizontal: 16,
    },
    t1: {
        fontWeight: 'bold',
        color: COLOR.col4, // Set the text color to light main color
    },
    t2: {
        color: COLOR.col3, // Set the text color to main color
    },
    orderitems: {
        marginVertical: 16,
        // paddingHorizontal: 16,
    },
    orderitemshead: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 8,
        color: COLOR.col3, // Set the text color to main color
        paddingHorizontal: 16,
    },
    orderitem: {
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: COLOR.col4, // Set the border color to light main color
    },
    cancel: {
        alignSelf: 'center',
        marginVertical: 16,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: COLOR.col4, // Set the background color to light main color
        color: COLOR.col3, // Set the text color to white
    },
    cancelled: {
        alignSelf: 'center',
        marginVertical: 16,
        paddingVertical: 8,
        paddingHorizontal: 16,
        color: 'red'
    }
});

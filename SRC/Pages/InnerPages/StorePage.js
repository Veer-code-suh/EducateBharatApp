import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React from 'react'
import img1 from "../../Assets/Products/jeemainchemistry.jpeg"
import img2 from "../../Assets/Products/jeemainmaths.jpeg"
import img3 from "../../Assets/Products/jeemainphysics.jpeg"
import { ScrollView, TextInput, TouchableOpacity } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { COLOR } from '../../Constants'
import { Image } from 'react-native'
import { useEffect } from 'react'
import { useToast } from 'react-native-toast-notifications'
import { BACKEND_URL } from "@env";


const CarouselCardItem = ({ item, index, navigation }) => {



  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("productpage", { product: item })}
      key={index}

    >
      <View style={styles.container} >
        <Image
          source={{
            uri: item.productImages[0]
          }}
          style={styles.image}
        />
        <Text style={styles.name}>{item.productName}</Text>

        
        <View style={styles.details}>
          <Text style={styles.price}>Rs. {item.productPrice}</Text>
          <Text style={styles.pricecut}>{parseInt(item.productPrice) + parseInt(item.productPrice * 0.1)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const StorePage = ({ navigation }) => {

  const toast = useToast()
  const [loading, setLoading] = React.useState(false)


  const [products, setProducts] = React.useState([])

  const getAllProducts = () => {
    setLoading(true)
    fetch(BACKEND_URL + "/getAllProducts", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false)
        // console.log("StorePage products ", data)
        // setProducts(data.products)
        if (data.error) {
          toast.show(data.error, { type: "danger" })
        }
        else {
          setProducts(data.products)
        }
      })
      .catch(err => {
        setLoading(false)
        console.log("err", err)
        toast.show("Something went wrong", { type: "danger" })
      })

  }
  useEffect(() => {
    getAllProducts()
  }, [])


  const [search, setSearch] = React.useState('')
  return (

    <View
      style={{
        flex: 1,
        backgroundColor: COLOR.col4
      }}
    >
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
        width: '95%',
        alignSelf: 'center',
        backgroundColor: COLOR.col1,
        marginVertical: 10,
        borderRadius: 10,
        position: 'absolute',
        zIndex: 1,
        top: 10
      }}>
        <TextInput placeholder='Search Any Book ' placeholderTextColor={'grey'} style={{
          width: '80%',
          padding: 0,
        }}
          value={search}
          onChangeText={(text) => setSearch(text)}
        />
        <AntDesign name='search1' size={20} color={COLOR.col3} />
      </View>



      {
        loading ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size='large' color={COLOR.col3} />
          </View>
          :
          <ScrollView>
            <View style={{
              height: 70,
            }}></View>
            {
              products
                .filter((item) => {
                  if (search == "") {
                    return item
                  }
                  else if (item.productName.toLowerCase().includes(search.toLowerCase())) {
                    return item
                  }
                }).length > 0 ?
                products
                  .filter((item) => {
                    if (search == "") {
                      return item
                    }
                    else if (item.productName.toLowerCase().includes(search.toLowerCase())) {
                      return item
                    }
                  })
                  .map((item, index) => {
                    return (
                      <CarouselCardItem item={item} key={index} index={index} navigation={navigation} />

                    )
                  })

                : <Text style={{

                  fontSize: 15,
                  alignSelf: 'center',
                  marginTop: 20,
                  color: 'grey'
                }}>No Products match with this keyword</Text>
            }
            <View style={{
              height: 100,
            }}></View>

          </ScrollView>
      }
    </View>
  )
}

export default StorePage

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: 'white'
    margin: 5,
    // borderColor: 'lightgrey',
    // borderWidth: 1,
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 2
  },
  image: {

    backgroundColor: 'white',
    // borderRadius: 10,
    borderRadius: 10,
    resizeMode: 'contain',
    width: 250,
    height: 300,
  },
  details: {
    flexDirection: "row",
    // justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 5,
    gap: 5
  },
  name: {
    fontSize: 16,
    color: '#111111',
    width: "100%",
    marginVertical: 2,
    paddingHorizontal: 5,
    fontWeight: "400"
  },
  price: {
    color: COLOR.col3,
    fontSize: 20
  },
  pricecut: {
    color: 'grey',
    fontSize: 17,
    textDecorationLine: "line-through",
  },
})
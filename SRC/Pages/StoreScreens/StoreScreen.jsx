import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { BACKEND_URL } from '@env';
import { COLOR } from '../../Constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather'

const StoreScreen = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);  // Loading state for fetch requests
  const navigation = useNavigation();
  // Fetch top 3 products
  const getThreeProducts = () => {
    setLoading(true);  // Set loading to true whenever a fetch happens
    fetch(`${BACKEND_URL}/getSomeProducts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ limit: 3 }),
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setLoading(false);  // Set loading to false once data is fetched
      })
      .catch(() => setLoading(false));  // Handle error case and stop loading
  };

  // Fetch search results based on the query
  const handleSearch = () => {
    setLoading(true);  // Start loading before making the search request
    fetch(`${BACKEND_URL}/searchStoreProducts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: searchQuery }),
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setLoading(false);  // Set loading to false after receiving data
      })
      .catch(() => setLoading(false));  // Handle errors by stopping the loading state
  };

  useEffect(() => {
    getThreeProducts();  // Fetch the top 3 products when the component mounts
  }, []);

  const renderProductItem = ({ item }) => (
    <TouchableOpacity style={styles.productCard} onPress={() => handleProductClick(item)}>
      <Image source={{ uri: item.productImages[0] }} style={styles.productImage} />
      <View style={styles.cardDetails}>
        <Text style={styles.productTitle}>{item.productName}</Text>
        <Text style={styles.productPrice}>Rs. {item.productPrice} /-</Text>
        <Text style={styles.productDescription} numberOfLines={3}  // Limits text to 3 lines
          ellipsizeMode="tail">{item.productDescription}</Text>

      </View>

    </TouchableOpacity>
  );


  const handleProductClick = (item) => {
    // console.log(item)
    navigation.navigate("ProductScreen", { product: item })

  }
  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.header}>Store</Text>
        <Feather name="shopping-cart" size={20} color={COLOR.col4}
          onPress={() => navigation.navigate("CartScreen")}
        />
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchBarInput}
          placeholder="Search products"
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
          data={products}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderProductItem}
          contentContainerStyle={styles.productsContainer}
        />
      )}
    </View>
  );
};

export default StoreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  headerSection:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
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
  productsContainer: {
    paddingVertical: 10,
    gap: 20,
  },
  productCard: {
    flex: 1,
    backgroundColor: 'white',
    overflow: 'hidden',
    flexDirection: 'row'
  },
  cardDetails: {
    flex: 1,

  },
  productImage: {
    width: 100,
    height: 100,
    objectFit: 'contain',
    marginRight: 10,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: COLOR.col4,
    textTransform: 'capitalize'
  },
  productPrice: {
    fontSize: 12,
    fontWeight: '400',
    color: COLOR.col6,
    textTransform: 'capitalize'
  },
  productDescription: {
    fontSize: 12,
    color: '#ccc',
  },
});

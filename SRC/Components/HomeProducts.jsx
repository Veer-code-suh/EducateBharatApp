import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { BACKEND_URL } from '@env';
import { Toast } from 'react-native-toast-notifications';
import { COLOR } from '../Constants';
import { useNavigation } from '@react-navigation/native';

const HomeProducts = () => {

  const navigation = useNavigation();
  const [products, setProducts] = useState([]);

  const getThreeProducts = () => {
    fetch(`${BACKEND_URL}/getSomeProducts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ limit: 3 }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          Toast.show(data.error, { type: 'danger' });
        } else {
          setProducts(data.products);
        }
      });
  };

  useEffect(() => {
    getThreeProducts();
  }, []);

  const handlePressItem = (item) => {
    console.log(item)
    navigation.navigate('ProductSreen', { product: item });
  };

  return (
    <View style={styles.containerOut}>
      <View style={styles.row}>
        <Text style={styles.head}>Our Store</Text>
        <Text
          style={styles.more}
          onPress={() => navigation.navigate('StoreScreen')}
        >
          View all
        </Text>
      </View>

      {/* Horizontal FlatList to display product images */}
      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePressItem(item)}>
            <Image
              source={{ uri: item.productImages[0] }}
              style={styles.image}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default HomeProducts;

const styles = StyleSheet.create({
 
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
  image: {
    width: 120,
    aspectRatio: '1',
    marginRight: 10,
    borderRadius: 8,
  },
});

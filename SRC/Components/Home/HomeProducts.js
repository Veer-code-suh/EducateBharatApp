import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from "react-native";
import { BACKEND_URL } from "@env";
import { useToast } from 'react-native-toast-notifications';
import CarouselComponent from '../CarouselComponent';
import { COLOR } from '../../Constants';
import CarouselComponentProducts from './CarouselComponentProducts';






const HomeProducts = ({ navigation }) => {
  const toast = useToast();
  const [products, setProducts] = useState([]);

  const getThreeProducts = () => {
    fetch(`${BACKEND_URL}/getSomeProducts`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ limit: 3 }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.show(data.error, { type: "danger" });
        } else {

          // console.log('HomeProducts.js products ',data.products)
          setProducts(data.products);
        }
      });
  };

  useEffect(() => {
    getThreeProducts();
  }, []);

  const handlePressItem = (item) => {
    navigation.navigate("productpage", { product: item });
  };

  return (
    <View style={styles.containerOut}>
      <View style={styles.head}>
        <Text style={styles.headText}>Our Store</Text>
        <Text
          style={styles.link}
          onPress={() => navigation.navigate("StorePage")}
        >
          View all
        </Text>
      </View>

      <CarouselComponentProducts data={products} onPressItem={handlePressItem} />
    </View>
  );
};

export default HomeProducts;

const styles = StyleSheet.create({
  containerOut: {
    marginVertical: 20,
  },
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: '95%',
    alignSelf: "center",
  },
  headText: {
    color: COLOR.col3,
    fontSize: 18,
  },
  link: {
    color: "grey",
    textDecorationLine: "underline",
  },
});

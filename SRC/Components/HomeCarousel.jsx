import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { BACKEND_URL } from "@env";
import CarouselComponent from './CarouselComponent';
import FullScreenLoader from './FullScreenLoader';
import { Toast } from 'react-native-toast-notifications';

const HomeCarousel = () => {
  const [allBanner, setAllBanner] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllBanner = async () => {
    setLoading(true);
    fetch(`${BACKEND_URL}/getbanners`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.error) {
          Toast.error(data.error);
        } else {
          setAllBanner(data.banners);
        }
      })
      .catch((err) => {
        setLoading(false);
        Toast.error("Something went wrong");
      });
  };

  useEffect(() => {
    getAllBanner();
  }, []);

  const handlePressItem = (item) => {
    // Handle item press if needed
  };

  return (
    <View>

      {loading ? (
        <FullScreenLoader />
      ) : (
        <CarouselComponent data={allBanner} onPressItem={handlePressItem} />
      )}
    </View>
  );
};

export default HomeCarousel;

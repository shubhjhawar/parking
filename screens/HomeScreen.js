import React, { useState, useEffect } from 'react';
import LoadingScreen from './LoadingScreen.js';
import { SafeAreaView, Text, View } from 'react-native';
import tw from "tailwind-react-native-classnames"
import Home from '../components/Home.js';
import * as Location from "expo-location";

const HomeScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currLocation, setCurrLocation] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    if (currLocation === null) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [currLocation]);

  const updateLocation = (location) => {
    const la = location.coords.latitude;
    const lb = location.coords.longitude;
    setCurrLocation(location);
    setLatitude(la);
    setLongitude(lb);
  };

  useEffect(() => {
    const fetchCurrentLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission to access location was denied');
          return;
        }

        const initialLocation = await Location.getCurrentPositionAsync({});
        updateLocation(initialLocation);

        Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 5, // Minimum distance (in meters) to trigger an update
          },
          (location) => {
            console.log("location updated")
            updateLocation(location);
          }
        );

      } catch (error) {
        console.error('Error fetching current location', error);
      }
    };

    fetchCurrentLocation();
  }, []);

  // console.log(latitude, longitude);

  return (
    <View style={tw`flex-1 h-full items-center justify-center`}>
      {!isLoading ? (
        <Home latitude={latitude} longitude={longitude} />
      ) : (
        <LoadingScreen />
      )}
    </View>
  );
};

export default HomeScreen;

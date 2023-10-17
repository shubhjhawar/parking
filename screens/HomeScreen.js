import React, { useState, useEffect } from 'react';
import LoadingScreen from './LoadingScreen.js';
import { SafeAreaView, Text, View } from 'react-native';
import tw from "tailwind-react-native-classnames"
import Home from '../components/Home.js';
import * as Location from "expo-location";

const HomeScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currLocation, setCurrLocation] = useState(null);

  useEffect(() => {
    if (currLocation === null) { // Check if currLocation is null
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [currLocation]);

  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)

  useEffect(() => {
      const fetchCurrentLocation = async () => {
        try {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.error('Permission to access location was denied');
            return;
          }
  
          const location = await Location.getCurrentPositionAsync({});
          setCurrLocation(location);
          let la = location.coords.latitude;
          let lb = location.coords.longitude;
          setLatitude(la);
          setLongitude(lb);
  
        } catch (error) {
          console.error('Error fetching current location', error);
        }
      };
  
      fetchCurrentLocation();
    }, [latitude, longitude]);
  
    // console.log(currLocation.coords.latitude)
    // console.log(currLocation.coords.longitude)
    console.log(latitude);
    console.log(longitude);

  return (
    <View style={tw`flex-1 h-full items-center justify-center`}>
      {!isLoading ? (
        // Content to show when loading is complete
        <Home latitude={latitude} longitude={longitude} />
      ) : (
        // Loading screen while waiting
        <LoadingScreen />
      )}
    </View>
  );
};

export default HomeScreen;

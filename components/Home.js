import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import NewMap from './NewMap.js';
import tw from 'tailwind-react-native-classnames';
import { parkings } from '../parking/index.js';
import { GOOGLE_MAPS_APIKEY } from "@env";
import moment from "moment";
import { ff } from '../parking/functions.js';
import GyroComponent from './GyroComponent.js';
import { Accelerometer } from 'expo-sensors';

// Function to calculate the Haversine distance between two points
const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

// Function to find the closest parking spot
const findClosestParking = (currentLat, currentLon, parkingSpots) => {
  let closestParking = null;
  let minDistance = Number.MAX_VALUE;

  for (const parkingSpot of parkingSpots) {
    const distance = calculateHaversineDistance(
      currentLat, currentLon,
      parseFloat(parkingSpot.latitude), parseFloat(parkingSpot.longitude)
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestParking = parkingSpot;
    }
  }

  return closestParking;
};

const Home = ({ latitude, longitude }) => {
  const [parkingSpots, setParkingSpots] = useState({});
  const [closestParking, setClosestParking] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const [time, setTime] = useState(null);
  const [distance, setDistance] = useState(null);

  const [index, setIndex] = useState(0);

  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);

  const subscribe = () => {
    setSubscription(Accelerometer.addListener(setData));
  };

  const unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    subscribe();
    return () => unsubscribe();
  }, []);

  const handleButtonPress = () => {    
    const closestParkingSpots = ff(latitude, longitude, parkings, 5);
    setParkingSpots(closestParkingSpots);

    setClosestParking(closestParkingSpots[index]);
    setIndex((prev) => prev+1);

    if(index == 3)
    {
      setIndex(0);
    }
  };

  const handleTripButton = () => {
    setIsNavigating((prev) => !prev);
  }

  useEffect(() => {
    if(latitude && longitude && closestParking)
    {
      const origin = `${latitude},${longitude}`; // Use the latitude and longitude of your origin
      const destination = `${closestParking.latitude},${closestParking.longitude}`; // Use the coordinates of your destination (parking)

      const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${GOOGLE_MAPS_APIKEY}`;
  
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          // Handle the distance and duration data from the response
          setTime(data.rows[0].elements[0].duration.text);
          setDistance(data.rows[0].elements[0].distance.text)

        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }, [latitude, longitude, closestParking, time, distance])
  
  console.log(time,  distance);


  return (
    <View style={tw`flex-1 h-full w-full items-center justify-center`}>
      <NewMap latitude={latitude} longitude={longitude} parking={closestParking} isNavigating={isNavigating} />
      <View style={tw`flex items-center justify-around w-full p-2 bg-gray-200 pb-10 rounded-2xl shadow-2xl border`}>

        {closestParking && (
          <View style={tw`flex flex-row p-2 w-full justify-between`}>
            <Text style={tw`text-lg text-black font-semibold `}>{time}</Text>
            <Text style={tw`text-lg text-black font-semibold `}>{distance}</Text>
          </View>
        )}
        
       <View style={tw`flex flex-row`}>
        {/* <GyroComponent style={tw`p-10 mb-10`} /> */}
        <TouchableOpacity disabled={isNavigating} onPress={handleButtonPress} style={tw`${isNavigating && "opacity-20"} m-auto w-1/2 flex bg-blue-500 p-4 mr-1 rounded-lg`}>
            {index == 0 ? (
              <Text style={tw`z-10 text-white text-center text-lg font-semibold`}>Find My Parking</Text>
            ): (
              <Text style={tw`z-10 text-white text-center text-lg font-semibold`}>Another Parking</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity disabled={!closestParking} onPress={handleTripButton} style={tw`${!closestParking && "opacity-20"} m-auto w-1/2 flex bg-red-500 p-4 ml-1 rounded-lg`}>
            {isNavigating ? (
            <Text style={tw`z-10 text-white text-center text-lg font-semibold`}>Cancel</Text>
            ) : (
            <Text style={tw`z-10 text-white text-center text-lg font-semibold`}>Let's GO!</Text>
            )}
          </TouchableOpacity>
       </View>

       {/* <View>
       <Text style={styles.text}>x: {x}</Text>
      <Text style={styles.text}>y: {y}</Text>
      <Text style={styles.text}>z: {z}</Text>
      <TouchableOpacity onPress={subscription ? unsubscribe : subscribe}>
          <Text>{subscription ? 'On' : 'Off'}</Text>
        </TouchableOpacity>
       </View> */}

      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});

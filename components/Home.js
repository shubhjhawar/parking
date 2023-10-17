import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import NewMap from './NewMap.js';
import tw from 'tailwind-react-native-classnames';
import { parkings } from '../parking/index.js';

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
  const [closestParking, setClosestParking] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);


  const handleButtonPress = () => {
    const closest = findClosestParking(latitude, longitude, parkings);
    setClosestParking(closest);
    console.log("button pressed");
    console.log(closest);
  };

  const handleTripButton = () => {
    setIsNavigating((prev) => !prev);
  }

  return (
    <View style={tw`flex-1 h-full w-full items-center justify-center`}>
      <NewMap latitude={latitude} longitude={longitude} parking={closestParking} isNavigating={isNavigating} />
      <View style={tw`flex flex-row items-center justify-around w-full p-2 bg-gray-300 my-2 pb-10`}>
        <TouchableOpacity onPress={handleButtonPress} style={tw`m-auto w-1/2 flex bg-blue-500 p-4 mr-1 rounded-lg`}>
          <Text style={tw`z-10 text-white text-center text-lg font-semibold`}>Find My Parking</Text>
        </TouchableOpacity>

        <TouchableOpacity disabled={!closestParking} onPress={handleTripButton} style={tw`${!closestParking && "opacity-20"} m-auto w-1/2 flex bg-red-500 p-4 ml-1 rounded-lg`}>
          {isNavigating ? (
          <Text style={tw`z-10 text-white text-center text-lg font-semibold`}>Cancel</Text>
          ) : (
          <Text style={tw`z-10 text-white text-center text-lg font-semibold`}>Let's GO!</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});

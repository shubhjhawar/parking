import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import tw from 'tailwind-react-native-classnames';

const NewMap = ({ latitude, longitude }) => {
  if (latitude === null || longitude === null) {
    // Handle the case where latitude and longitude are not available yet.
    // You can return a loading screen or error message here.
    return (
      <View style={tw`flex-1 items-center justify-center`}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <MapView
      style={tw`flex-1 w-full h-full`}
      mapType='mutedStandard'
      initialRegion={{
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
    >
      <Marker
        coordinate={{
          latitude: latitude,
          longitude: longitude,
        }}
        title="My Location"
      />

      <TouchableOpacity style={tw`flex items-center justify-center bg-blue-500 absolute bottom-0 p-4 m-2 mr-10 rounded-lg`}>
        <Text style={tw`flex items-center justify-center`}>Find Parkingnjnkjnkj</Text>
      </TouchableOpacity>
    </MapView>
  );
};

export default NewMap;

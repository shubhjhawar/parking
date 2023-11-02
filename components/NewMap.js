import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import tw from 'tailwind-react-native-classnames';
import { GOOGLE_MAPS_APIKEY } from "@env";
import Icon from 'react-native-vector-icons/FontAwesome';

function calculateInitialBearing(lat1, lon1, lat2, lon2) {
  const dLon = lon2 - lon1;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  const initialBearing = Math.atan2(y, x);
  
  // Convert the result from radians to degrees
  return (initialBearing * 180) / Math.PI;
}

const NewMap = ({ latitude, longitude, parking, isNavigating }) => {
  const mapRef = useRef(null);
  const [isTrip, setIsTrip] = useState(false);
  const [mapType, setMapType] = useState(true);

  useEffect(() => {
    if (mapRef.current && parking) {
      // Fit to markers when parking marker is available
      mapRef.current.fitToSuppliedMarkers(['origin', 'destination'], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      });
    }
  }, [parking]);

  useEffect(() => {
    if (mapRef.current) {
      if (isNavigating) {
        mapRef.current.animateToRegion({
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.001, 
          longitudeDelta: 0.001,
        });

        setIsTrip(true);

      } else {
        // Reset the heading and zoom when not navigating
        mapRef.current.animateToRegion(
          {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          },
          1000
          );

        setIsTrip(false);
          }
        }
      }, [isNavigating]);
      

  useEffect(() => {
    if (isTrip && parking) {
      // After a delay, animate the camera with the desired heading and zoom
      const initialBearing = calculateInitialBearing(
        latitude,
        longitude,
        parking.latitude,
        parking.longitude
      );

      setTimeout(() => {
        mapRef.current.animateCamera({
          heading: initialBearing,
          center: {
            latitude: latitude,
            longitude: longitude,
          },
          pitch: 55,
          zoom: 15,
          duration: 3000,
        });
      }, 500); // Delay for 1000 milliseconds (1 second) before animating
    }
  }, [isTrip, parking, latitude, longitude]);
  
  const handleMapStyle = () => {
    setMapType((prev) => !prev);
  }

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
      ref={mapRef}
      style={tw`flex-1 w-full h-full`}
      mapType={mapType ? 'mutedStandard' : 'satellite'}
      initialRegion={{
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.005, // Dynamically set latitudeDelta
        longitudeDelta: 0.005, // Dynamically set longitudeDelta
      }}
    >
      <Marker
        coordinate={{
          latitude: latitude,
          longitude: longitude,
        }}
        title="My Location"
        identifier='origin'
      >
        <View style={tw`w-7 h-7 bg-white rounded-full items-center justify-center shadow-2xl`}>
          <View style={tw`w-5 h-5 bg-blue-400 rounded-full items-center justify-center`}></View>
        </View>
      </Marker>

      {parking && (
        <Marker
          coordinate={{
            latitude: parking.latitude,
            longitude: parking.longitude,
          }}
          // image = {require('../assets/mark.png')}
          title="My parking"
          identifier='destination'
        >
          <Image
            source= {require('../assets/mark.png')}
            alt="parking"
            style={{width:30, height:40}}
          />
        </Marker>
      )}

      {parking && (
        <MapViewDirections
          origin={{
            latitude: latitude,
            longitude: longitude,
          }}
          destination={{
            latitude: parseFloat(parking.latitude),
            longitude: parseFloat(parking.longitude),
          }}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={3}
          strokeColor={mapType ? "black" : "white"}
        />
      )}

      <TouchableOpacity onPress={handleMapStyle} style={tw`p-3 shadow-lg rounded-full bg-white absolute bottom-10 left-0 m-2`}>
        {mapType ? <Icon name="rocket" size={30} color="#ef6f2f" /> : <Icon name="map" size={30} color="#ef6f2f" />}
      </TouchableOpacity>

    </MapView>
  );
};

export default NewMap;

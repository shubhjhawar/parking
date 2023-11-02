import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Gyroscope } from 'expo-sensors';
import ArrowComponent from './ArrowComponent';

const GyroComponent = () => {
  const [filteredX, setFilteredX] = useState(0);
  const [subscription, setSubscription] = useState(null);

  const alpha = 0.1; // Filter coefficient (adjust as needed)

  const _subscribe = () => {
    setSubscription(
      Gyroscope.addListener(gyroscopeData => {
        // Apply the low-pass filter to smooth out the gyroscope data
        const filteredValue = alpha * gyroscopeData.x + (1 - alpha) * filteredX;
        setFilteredX(filteredValue);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  // Calculate the rotation angle based on the filtered gyroscope data
  const rotationAngle = -filteredX * 45; // Adjust the multiplier based on the sensitivity you want
  console.log(rotationAngle)

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24 }}>Rotation Angle: {rotationAngle} degrees</Text>
        <ArrowComponent rotationAngle={rotationAngle}/>
    </View>
  );
};

export default GyroComponent;

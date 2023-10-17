import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react';
import NewMap from './NewMap.js';
import * as Location from "expo-location";
import tw from "tailwind-react-native-classnames";


const Home = ({latitude, longitude}) => {
    
  return (
    <View style={tw`flex-1 h-full w-full items-center justify-center`}>
      <NewMap latitude={latitude} longitude={longitude}/>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({})
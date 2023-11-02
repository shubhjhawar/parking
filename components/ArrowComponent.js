import React from 'react';
import { View, StyleSheet } from 'react-native';

const ArrowComponent = ({ rotationAngle }) => {
  return (
    <View style={[styles.arrowContainer, { transform: [{ rotate: `${rotationAngle}deg` }] }]}>
      <View style={styles.arrow}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  arrowContainer: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: 15,
    borderBottomWidth: 30,
    borderLeftWidth: 15,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'red', // You can change the arrow color here
    borderLeftColor: 'transparent',
  },
});

export default ArrowComponent;

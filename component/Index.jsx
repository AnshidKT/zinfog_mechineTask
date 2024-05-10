import React, {useEffect, useRef} from 'react';
import {Image, StyleSheet, View, Animated} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import zinfog from '../imgs/zinfog.png';

const Index = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    const timeout = setTimeout(() => {}, 3000);
    return () => clearTimeout(timeout);
  }, [fadeAnim]);

  return (
    <Animated.View style={{...styles.container, opacity: fadeAnim}}>
      <Image source={zinfog} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Index;

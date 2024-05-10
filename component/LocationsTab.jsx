import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';

import bin from '../imgs/bin.png';

const LocationsTab = ({navigation}) => {
  const [savedLocations, setSavedLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSavedLocations = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const locations = await AsyncStorage.multiGet(keys);
      const parsedLocations = locations.map(([key, value]) =>
        JSON.parse(value),
      );
      setSavedLocations(parsedLocations);
      setLoading(false);
    } catch (error) {
      console.error('Error loading saved locations:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadSavedLocations();
    }, []),
  );

  const handleLocationPress = (latitude, longitude) => {
    navigation.navigate('Map', {latitude, longitude});
  };

  const handleDeleteLocation = async title => {
    try {
      await AsyncStorage.removeItem(title);
      const updatedLocations = savedLocations.filter(
        location => location.title !== title,
      );
      setSavedLocations(updatedLocations);
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>Loading...</Text>
        </View>
      ) : savedLocations.length === 0 ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No saved locations found</Text>
        </View>
      ) : (
        <View>
          <Text style={styles.header}>Saved Locations</Text>
          <FlatList
            data={savedLocations}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.locationItem}
                onPress={() =>
                  handleLocationPress(item.latitude, item.longitude)
                }>
                <View>
                  <Text>{item.title}</Text>
                  <Text>Time: {item.time}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteLocation(item.title)}>
                  <Image style={{width: 20, height: 20}} source={bin} />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  locationItem: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default LocationsTab;

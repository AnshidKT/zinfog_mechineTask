import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import map_image from '../imgs/mapImage.jpg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MapTab = ({navigation}) => {
  const [locationDetails, setLocationDetails] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [savedLocations, setSavedLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsMapReady(true);
  }, []);

  useEffect(() => {
    const fetchLocationDetails = async () => {
      const latitude = 10.6677032;
      const longitude = 75.988872;
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        );
        const data = await response.json();
        setLocationDetails(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching location details:', error);
      }
    };

    fetchLocationDetails();
  }, []);

  const handleLocationPress = event => {
    const {coordinate} = event.nativeEvent;
    setSelectedLocation(coordinate);
    setModalVisible(true);
  };

  const handleAddLocationPress = () => {
    setModalVisible(true);
  };

  const handleSaveLocation = async () => {
    const newLocation = {
      title,
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      time: new Date().toLocaleString(),
    };
    setSavedLocations([...savedLocations, newLocation]);
    setModalVisible(false);
    try {
      await AsyncStorage.setItem(
        newLocation.title,
        JSON.stringify(newLocation),
      );
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  return (
    <>
      {loading ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>Loading...</Text>
        </View>
      ) : (
        <View style={styles.container}>
          <Image source={map_image} style={styles.mapImage} />
          <View style={styles.mapDetailsContainer}>
            <Text>
              Location : {locationDetails ? locationDetails.display_name : ''}
            </Text>
            <Text>Latitude: {locationDetails ? locationDetails.lat : ''}</Text>
            <Text>Longitude: {locationDetails ? locationDetails.lon : ''}</Text>
          </View>
          <View
            style={{
              width: '100%',
              marginTop: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {isMapReady && (
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: 10.6677032,
                  longitude: 75.988872,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                onPress={handleLocationPress}>
                {selectedLocation && <Marker coordinate={selectedLocation} />}
              </MapView>
            )}
          </View>

          <View
            style={{
              width: '100%',
              marginTop: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={handleAddLocationPress}
              style={{width: 100, height: 30, backgroundColor: '#00B6FB'}}>
              <Text style={{textAlign: 'center', color: 'white', marginTop: 6}}>
                Add Location
              </Text>
            </TouchableOpacity>
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TextInput
                  style={styles.input}
                  placeholder="Title"
                  value={title}
                  onChangeText={setTitle}
                />
                <Button title="Save Location" onPress={handleSaveLocation} />
              </View>
            </View>
          </Modal>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapImage: {
    width: '100%',
    height: '40%',
  },
  mapDetailsContainer: {
    padding: 20,
  },
  map: {
    width: '90%',
    height: 200,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
});

export default MapTab;

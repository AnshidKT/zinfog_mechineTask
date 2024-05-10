import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MapTab from './component/MapTab';
import LocationsTab from './component/LocationsTab';
import Index from './component/Index';
import {Image, Text, View} from 'react-native';

const Tab = createBottomTabNavigator();

const App = () => {
  const [showTabs, setShowTabs] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTabs(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <NavigationContainer>
      {showTabs ? (
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarLabel: ({focused}) => {
              return (
                <Text
                  style={{
                    fontSize: focused ? 13 : 13,
                    color: focused ? '#FF375F' : '#748c94',
                  }}>
                  {route.name}
                </Text>
              );
            },
          })}>
          <Tab.Screen
            name="Map"
            component={MapTab}
            options={{
              tabBarIcon: ({focused}) => (
                <View>
                  <Image
                    source={require('./imgs/map.png')}
                    resizeMode="contain"
                    style={{
                      width: 35,
                      height: 35,
                      tintColor: focused ? '#FF375F' : '#748c94',
                    }}
                  />
                </View>
              ),
            }}
          />

          <Tab.Screen
            name="Locations"
            component={LocationsTab}
            options={{
              tabBarIcon: ({focused}) => (
                <View>
                  <Image
                    source={require('./imgs/location.png')}
                    resizeMode="contain"
                    style={{
                      width: 30,
                      height: 30,
                      tintColor: focused ? '#FF375F' : '#748c94',
                    }}
                  />
                </View>
              ),
            }}
          />
        </Tab.Navigator>
      ) : (
        <Index />
      )}
    </NavigationContainer>
  );
};

export default App;

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Platform,
  useColorScheme,
  PermissionsAndroid,
  View,
} from 'react-native';

import {NativeModules} from 'react-native';
const {NearbyModule} = NativeModules;
console.log(NearbyModule);
NearbyModule.createNearbyEvent('aya', 'tunisie');
const App = () => {
  const [discoveredEndpoints, setDiscoveredEndpoints] = useState([]);
  const startDiscovering = async () => {
    NearbyModule.startDiscovering( currentTimes => {
    const [currentTimeFound, currentTimeAcceptConnection] = currentTimes.split(",");
    console.log("Current Time Found: ", currentTimeFound);
    console.log("Current Time Accept Connection: ", currentTimeAcceptConnection);
    })
  };
  const startAdvertising = async () => {
    NearbyModule.startAdvertising();
  };
  const showDiscovered = () => {

    NearbyModule.getDiscoveredEndpoints(endpoints => {
      console.log('discoveredEndpoints: ', endpoints);
      setDiscoveredEndpoints(endpoints);
    });
  };
  const stopAdvertising = () => {
    NearbyModule.stopAdvertising();
  }
  const stopDiscovering= () => {
    NearbyModule.stopDiscovering();
  }

  const connectEndpoint = endpoint => {
    NearbyModule.connectToEndpoint(endpoint);
  };

  if (Platform.OS === 'android' && Platform.Version >= 23) {
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES
    ).then(result => {
      if (result) {
        console.log('Permission is OK'+ Platform.Version);
      } else {
        PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION]
        ).then(result => {
          if (result) {
            console.log('User accepted');
          } else {
            console.log('User refused');
          }
        });
      }
    });
  }

  return (
    <View style={styles.container}>
      <Text>App</Text>
      <Button
        title="Click to start discovering!"
        color="#841584"
        onPress={startDiscovering}
      />
      <Button
        title="Click to start advertising!"
        color="#841584"
        onPress={startAdvertising}
      />
      <Button
        title="Show discovered Devices!"
        color="#841584"
        onPress={showDiscovered}
      />
      {discoveredEndpoints.map((endpoint, index) => (
        <View key={index}>
          <Text>{endpoint}</Text>
          <Button title="Connect" onPress={() => connectEndpoint(endpoint)} />
        </View>
      ))}
      <Button
        title="Stop discovering!"
        color="#841584"
        onPress={stopDiscovering}
       />
      <Button
        title="Stop Advertising!"
        color="#841584"
        onPress={stopAdvertising}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;

import React, {useEffect, useState} from "react";
import MapView, {Marker} from "react-native-maps";
import {StyleSheet, View} from "react-native";
import * as Location from "expo-location";

import Parse from "parse/react-native.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

Parse.setAsyncStorage(AsyncStorage);
Parse.initialize(process.env.EXPO_PUBLIC_PARSE_APPLICATION_ID, process.env.EXPO_PUBLIC_PARSE_JAVASCRIPT_KEY);
Parse.serverURL = "https://parseapi.back4app.com/";

const initialRegion = {
  latitude: 37.0000,
  longitude: -100.0000,
  latitudeDelta: 64,
  longitudeDelta: 64,
};

export default function App() {

  const [places, setPlaces] = useState([]);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const Place = Parse.Object.extend("Place");
    const placeQuery = new Parse.Query(Place);
    placeQuery.find()
      .then((places) => {
        places = places.map((place) => {
          return {
            title: place.get("name"),
            description: place.get("description"),
            coordinate: {
              latitude: place.get("location").latitude,
              longitude: place.get("location").longitude,
            },
          };
        });
        setPlaces(places);
      })
      .catch((error) => {
        console.error("Error retrieving places: ", error);
      });
    (async () => {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied.");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log(location);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        initialRegion={initialRegion}
        style={styles.map}
      >
        {places.map((place, index) => (
          <Marker
            key={index}
            title={place.title}
            description={place.description}
            coordinate={place.coordinate}
          />
        ))}
        {location && (
          <Marker
            title="You are here"
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            pinColor="blue"
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
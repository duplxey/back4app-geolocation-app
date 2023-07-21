import React, {useEffect, useState} from "react";
import MapView, {Marker} from "react-native-maps";
import {StyleSheet, View} from "react-native";

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
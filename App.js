import React, {useEffect, useState} from "react";
import {Button, StyleSheet, View} from "react-native";
import MapView, {Marker} from "react-native-maps";
import * as Location from "expo-location";

import Parse from "parse/react-native.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

Parse.setAsyncStorage(AsyncStorage);
Parse.initialize(
  process.env.EXPO_PUBLIC_PARSE_APPLICATION_ID,
  process.env.EXPO_PUBLIC_PARSE_JAVASCRIPT_KEY,
);
Parse.serverURL = "https://parseapi.back4app.com/";

const initialRegion = {
  latitude: 30.0000,
  longitude: -100.0000,
  latitudeDelta: 64,
  longitudeDelta: 64,
};
const maxDistance = 3000;

export default function App() {

  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    // request permission to access user location
    // https://docs.expo.dev/versions/latest/sdk/location/
    (async () => {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied.");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();

    // fetch `Place` objects from the database
    const placesQuery = new Parse.Query("Place");
    placesQuery.find().then((places) => {
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
    });
  }, []);

  const sortPlacesByProximity = async () => {
    let parseQuery = new Parse.Query("Place");
    let locationGeoPoint = new Parse.GeoPoint(location.coords.latitude, location.coords.longitude);
    parseQuery.near("location", locationGeoPoint);

    let results = await parseQuery.find();
    for (let result of results) {
      console.log(result.get("name"));
    }
  };

  const findPlacesWithinDistance = async () => {
    let parseQuery = new Parse.Query("Place");
    let locationGeoPoint = new Parse.GeoPoint(location.coords.latitude, location.coords.longitude);
    parseQuery.withinKilometers("location", locationGeoPoint, maxDistance);

    let results = await parseQuery.find();
    for (let result of results) {
      console.log(result.get("name"));
    }
  }

  const moveUserToRandomLocation = () => {
    setLocation({
      coords: {
        latitude: Math.random() * (-78.848974 - -103.520833) + 31.3845,
        longitude: Math.random() * (-78.848974 - -123.885444) + -123.885444,
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title="Sort places by proximity"
          color="#239658"
          onPress={sortPlacesByProximity}
        />
        <Button
          title={`Find places within ${maxDistance} km`}
          color="#239658"
          onPress={findPlacesWithinDistance}
        />
        <Button
          title="Move user to random location"
          color="#061124"
          onPress={moveUserToRandomLocation}
        />
      </View>
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
            description={`${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`}
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
    zIndex: 10,
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    zIndex: 25,
    width: "100%",
    position: "absolute",
    bottom: 0,
    marginVertical: 4,
    display: "flex",
    gap: 4,
  },
});
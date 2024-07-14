import React from "react";
import { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Image,
  ImageBackground,
  Platform,
} from "react-native";
import MapView, {
  Marker,
  Callout,
  Heatmap,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";

import { UserContext } from "../contexts/Contexts";
import { getCollections } from "../api/apiFunctions.js";
import {
  parseGeoTagLatitude,
  parseGeoTagLongitude,
} from "../utils/parseGeoTag";

const backgroundLeaf = require("../assets/backgroundtest.jpg");

const plantIconsArr = require("../assets/plantIcons/plantIcons.js");
const flowerIconsArr = require("../assets/flowerIcons/flowerIcons.js");

export default function CollectedMap({ navigation }) {
  const { user, setUser } = useContext(UserContext);

  const [isLocating, setIsLocating] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [plantIcons, setPlantIcons] = useState(plantIconsArr);
  const [flowerIcons, setFlowerIcons] = useState(flowerIconsArr);
  const [plantsArr, setPlantsArr] = useState([]);

  useEffect(() => {
    console.log("USE EFFECT in COLLECTED MAP");
    setIsLoading(true);
    getCollections().then((plants) => {
      setPlantsArr(plants);
    });

    (async () => {
      setIsLocating(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync();
      setLocation(location);
      setIsLocating(false);
    })();

    setIsLoading(false);
  }, []);

  if (isLoading || isLocating) {
    return (
      <ImageBackground
        source={backgroundLeaf}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.activityIndicatorBackground}>
          <ActivityIndicator size="large" color="#006400" />
          <Text>Loading map...</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.mapView}
        showsUserLocation={true}
        followsUserLocation={true}
        region={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.02,
        }}
      >
        {plantsArr.map((plant, index) => {
          const isUserPlant = plant.username === user.username;
          return (
            <Marker
              key={index}
              coordinate={{
                longitude: parseGeoTagLongitude(plant),
                latitude: parseGeoTagLatitude(plant),
              }}
            >
              <Image
                source={
                  isUserPlant
                    ? flowerIcons[Math.floor(Math.random() * flowerIcons.length)]
                    : plantIcons[Math.floor(Math.random() * plantIcons.length)]
                }
                style={{ width: 50, height: 50 }}
                resizeMode="center"
                resizeMethod="resize"
              />
              <Callout
                tooltip={true}
                onPress={() => {
                  navigation.navigate("Single Plant", {
                    plant: plant,
                  });
                }}
              >
                <View style={styles.calloutContainer}>
                  <View style={styles.calloutTemplate}>
                    <WebView
                      style={styles.calloutImage}
                      source={{ uri: plant.image }}
                    />
                    <View style={styles.textContainer1}>
                      <Text style={styles.text1}>{plant.speciesName}</Text>
                      {isUserPlant && (
                        <Text style={styles.userPlantIndicator}>
                          Your Plant
                        </Text>
                      )}
                    </View>
                    <View style={styles.textContainer2}>
                      <Text style={styles.text2}>{plant.plantId}</Text>
                    </View>
                  </View>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  activityIndicatorBackground: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  mapContainer: {
    flex: 1,
  },
  mapView: {
    flex: 1,
  },
  calloutContainer: {
    width: 200,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  calloutTemplate: {
    flexDirection: "column",
    alignItems: "center",
  },
  calloutImage: {
    width: 150,
    height: 150,
  },
  textContainer1: {
    marginVertical: 5,
    alignItems: "center",
  },
  text1: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userPlantIndicator: {
    fontSize: 14,
    fontWeight: "bold",
    color: "green",
  },
  textContainer2: {
    marginVertical: 5,
    alignItems: "center",
  },
  text2: {
    fontSize: 14,
    color: "gray",
  },
});

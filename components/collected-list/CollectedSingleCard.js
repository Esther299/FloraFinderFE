import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

import { formatDate } from "../../utils/formatDate";
import {
  parseGeoTagLatitude,
  parseGeoTagLongitude,
} from "../../utils/parseGeoTag";

const plantIconsArr = require("../../assets/plantIcons/plantIcons.js");
const backgroundLeaf = require("../../assets/backgroundtest.jpg");

export default function CollectedSingleCard({ route }) {
  const { plant } = route.params;

  const [plantIcons, setplantIcons] = useState(plantIconsArr);
  const [initialLatitude, setInitialLatitude] = useState();
  const [initialLongitude, setInitialLongitude] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("USE EFFECT INITIAL LOCATION");
    const latitude = parseGeoTagLatitude(plant);
    setInitialLatitude(latitude);
    const longitude = parseGeoTagLongitude(plant);
    setInitialLongitude(longitude);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <ImageBackground
        source={backgroundLeaf}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.activityIndicatorBackground}>
          <ActivityIndicator size="large" color="#006400" />
          <Text style={styles.loadingText}>Loading plant...</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={backgroundLeaf}
      style={styles.imageBackground}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.page_container}>
        <ScrollView style={styles.scroll_view}>
          <View style={styles.card_container}>
            <View style={styles.card_template}>
              <Image style={styles.card_image} source={{ uri: plant.image }} />
              <View style={styles.text_container_1}>
                <Text style={styles.text_1}>{plant.speciesName}</Text>
              </View>
              <View style={styles.text_container_2}>
                <Text
                  style={
                    plant.matchScore > 0.5
                      ? styles.text_score_good
                      : styles.text_score_bad
                  }
                >
                  {(plant.matchScore * 100).toFixed(2)}%
                </Text>
                <Text style={styles.text_2}>
                  Member of the {plant.speciesFamily} Family
                </Text>
                <Text style={styles.text_2}>
                  Collected on {formatDate(plant.dateCollected)}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.map_container}>
            <View style={styles.map_template}>
              <MapView
                style={styles.map_view}
                // provider={PROVIDER_GOOGLE}
                pitchEnabled={false}
                rotateEnabled={false}
                scrollEnabled={false}
                zoomEnabled={false}
                region={{
                  latitude: initialLatitude,
                  longitude: initialLongitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.02,
                }}
              >
                <Marker
                  coordinate={{
                    longitude: parseGeoTagLongitude(plant),
                    latitude: parseGeoTagLatitude(plant),
                  }}
                >
                  <Image
                    source={
                      plantIcons[Math.floor(Math.random() * plantIcons.length)]
                    }
                    style={{ width: 50, height: 50 }}
                    resizeMode="center"
                    resizeMethod="resize"
                  />
                </Marker>
              </MapView>
            </View>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  activityIndicatorBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "white",
    fontSize: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  page_container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  scroll_view: {
    marginHorizontal: 10,
  },
  card_container: {
    flex: 1,
    marginTop: 5,
    marginBottom: 5,
  },
  card_template: {
    width: "100%",
    height: "100%",
    boxShadow: "10px 10px 17px -12px rgba(0,0,0,0.75)",
  },
  card_image: {
    width: "100%",
    aspectRatio: 75 / 100,
    borderRadius: 10,
  },
  text_container_1: {
    position: "absolute",
    width: "100%",
    height: "12%",
    padding: 4,
    backgroundColor: "rgba(0,0,0, 0.3)",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  text_container_2: {
    flexDirection: "column",
    position: "absolute",
    width: "100%",
    height: "20%",
    bottom: 0,
    padding: 4,
    backgroundColor: "rgba(0,0,0, 0.3)",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: "flex-end",
  },
  text_1: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  text_2: {
    fontSize: 16,
    color: "white",
    flex: 1 / 2,
  },
  text_score_good: {
    fontSize: 32,
    fontWeight: "bold",
    color: "green",
    flex: 1,
  },
  text_score_bad: {
    fontSize: 32,
    fontWeight: "bold",
    color: "red",
    flex: 1,
  },
  map_container: {
    flex: 1,
    marginBottom: 5,
  },
  map_template: {
    width: "100%",
    height: "100%",
    boxShadow: "10px 10px 17px -12px rgba(0,0,0,0.75)",
    borderRadius: 10,
    overflow: "hidden",
  },
  map_view: {
    width: "100%",
    height: 128,
    borderRadius: 10,
  },
  imageBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
});

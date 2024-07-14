import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
  Platform,
} from "react-native";

import { Emitter } from "react-native-particles";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faHome,
  faCamera,
  faBookmark,
  faLeaf,
} from "@fortawesome/free-solid-svg-icons";

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/Contexts";

import { postNewPlantToCollection } from "../api/apiFunctions";
import * as Location from "expo-location";

import { formatName } from "../utils/formatName";

const branchSticker = require("../assets/familyIcons/cactus_256.png");
const cactusSticker = require("../assets/familyIcons/cactus_256.png");
const treeSticker = require("../assets/familyIcons/cactus_256.png");
const backgroundLeaf = require("../assets/backgroundtest.jpg");

export default function PlantResult({ route, navigation }) {
  const { plant } = route.params;
  const { user, setUser } = useContext(UserContext);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [isSaved, setIsSaved] = useState(false);
  // const [isSaving, setIsSaving] = useState(false);
  // const [isPosting, setIsPosting] = useState(false);

  const winWidth = Dimensions.get("window").width;
  const winHeight = Dimensions.get("window").height;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({
        accuracy: 6,
      });
      setLocation(location);
    })();
  }, []);

  const handleSavePlantToCollection = () => {
    setIsSaved(false);
    if (location) {
      const username = user.username;
      const newCollection = {
        speciesID: Number(plant.gbif.id),
        speciesName: formatName(plant.species.commonNames[0]),
        geoTag: JSON.stringify({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }),
        matchScore: plant.score,
        image: plant.images[0].url.m,
        speciesFamily: formatName(
          plant.species.family.scientificNameWithoutAuthor
        ),
      };
      postNewPlantToCollection(username, newCollection)
        .then((response) => {
          console.log(response.speciesName, "RESPONSE in PLANTRESULT");
          setIsSaved(true);
        })
        .catch((error) => {
          console.log(error, "ERROR in PLANTRESULT");
        });
    }
  };

  return (
    <ScrollView
      style={styles.scroll_view_container}
      contentContainerStyle={styles.scrollViewContent}
    >
      <ImageBackground
        source={backgroundLeaf}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <View style={styles.heading_container}>
          <Text style={styles.heading_1}>{user.username}, you've found a</Text>
          <Text style={styles.heading_2}>
            {formatName(plant.species.commonNames[0])}!
          </Text>
        </View>
        <View style={styles.result_card}>
          <View style={styles.scientifc_container}>
            <View style={styles.label_container}>
              <Text style={styles.label}>Scientific Name: </Text>
            </View>
            <View style={styles.value_container}>
              <Text style={styles.value}>
                {formatName(plant.species.scientificNameWithoutAuthor)}
              </Text>
            </View>
          </View>

          <View style={styles.family_container}>
            <View style={styles.label_container}>
              <Text style={styles.label}>Plant Family: </Text>
            </View>
            <View style={styles.value_container}>
              <Text style={styles.value}>
                {formatName(plant.species.family.scientificNameWithoutAuthor)}
              </Text>
            </View>
          </View>

          <View style={styles.score_container}>
            <View style={styles.label_container}>
              <Text style={styles.label}>Match Score: </Text>
            </View>
            <View style={styles.value_container}>
              <Text
                style={
                  plant.score > 0.5
                    ? styles.text_score_good
                    : styles.text_score_bad
                }
              >
                {(plant.score * 100).toFixed(2)}%
              </Text>
            </View>
          </View>
          <View style={styles.image_container}>
            <Emitter
              style={styles.emitter}
              numberOfParticles={300}
              emissionRate={5}
              interval={10}
              speed={150}
              particleLife={5000}
              direction={-90}
              spread={360}
              infiniteLoop={true}
              fromPosition={{ x: winWidth / 2 - 70, y: 80 }}
            >
              <FontAwesomeIcon icon={faLeaf} color={"#185C1E"} />
            </Emitter>
            <Image
              style={styles.image}
              source={{ uri: plant.images[0].url.m }}
            />
            {plant.species.family.scientificNameWithoutAuthor ===
            "Cactaceae" ? (
              <Image style={styles.sticker} source={cactusSticker} />
            ) : null}
          </View>
        </View>
        {isSaved ? (
          <TouchableOpacity style={styles.button}>
            <Text style={styles.button_text}>
              {" "}
              Saved! <FontAwesomeIcon icon={faBookmark} color={"white"} />
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={handleSavePlantToCollection}
          >
            <Text style={styles.button_text}>
              {" "}
              Save To Collection{" "}
              <FontAwesomeIcon icon={faBookmark} color={"white"} />
            </Text>
          </TouchableOpacity>
        )}
        <Pressable
          style={styles.button}
          title="Go Back"
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.button_text}>
            Find Another Plant{" "}
            <FontAwesomeIcon icon={faCamera} color={"white"} />
          </Text>
        </Pressable>
        <Pressable
          style={styles.button}
          title="Home Page"
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.button_text}>
            Back To Home <FontAwesomeIcon icon={faHome} color={"white"} />
          </Text>
        </Pressable>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  scroll_view_container: {
    flex: 1,
  },
  scrollViewContent: {
    alignItems: "center",
    paddingBottom: 20,
  },
  heading_container: {
    marginTop: 20,
    alignItems: "center",
  },
  heading_1: {
    marginTop: 20,
    fontWeight: "bold",
    color: "#006400",
    textAlign: "center",
    fontFamily: "Inter_900Black",
    fontSize: 25,
  },
  heading_2: {
    marginBottom: 10,
    fontWeight: "bold",
    color: "#006400",
    textAlign: "center",
    fontFamily: "Inter_900Black",
    fontSize: 40,
  },
  result_card: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    margin: 8,
    width: "90%",
  },
  scientifc_container: {
    flexDirection: "row",
    marginBottom: 10,
  },
  family_container: {
    flexDirection: "row",
    marginBottom: 10,
  },
  score_container: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label_container: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: "#006400",
  },
  value_container: {
    flex: 1,
  },
  value: {
    flexWrap: "wrap",
    textAlign: "right",
    fontSize: 15,
    alignSelf: "flex-end",
  },
  button_container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "transparent",
    margin: 64,
  },
  image_container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: "20",
  },
  emitter: {
    zIndex: 0,
  },
  image: {
    borderRadius: 90,
    width: 175,
    height: 175,
    paddingVertical: 12,
    zIndex: 1,
  },
  sticker: {
    position: "absolute",
    width: 100,
    height: 100,
    transform: [{ rotate: "335deg" }],
    right: 1,
    zIndex: 2,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#006400",
    margin: 10,
  },
  button_text: {
    color: "white",
  },
  text_score_good: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#006400",
    alignSelf: "flex-end",
  },
  text_score_bad: {
    fontSize: 22,
    fontWeight: "bold",
    color: "red",
    alignSelf: "flex-end",
  },
});

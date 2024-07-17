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
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <ImageBackground
        source={backgroundLeaf}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <View style={styles.headingContainer}>
          <Text style={styles.heading1}>{user.username}, you've found a</Text>
          <Text style={styles.heading2}>
            {formatName(plant.species.commonNames[0])}!
          </Text>
        </View>

        <View style={styles.resultCard}>
          <View style={styles.sectionContainer}>
            <Text style={styles.label}>Scientific Name:</Text>
            <Text style={styles.value}>
              {formatName(plant.species.scientificNameWithoutAuthor)}
            </Text>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.label}>Plant Family:</Text>
            <Text style={styles.value}>
              {formatName(plant.species.family.scientificNameWithoutAuthor)}
            </Text>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.label}>Match Score:</Text>
            <View style={[styles.scoreContainer, plant.score > 0.5 ? styles.scoreGood : styles.scoreBad]}>
              <Text style={styles.scoreText}>
                {(plant.score * 100).toFixed(2)}%
              </Text>
              </View>
          </View>

          <View style={styles.imageContainer}>
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
            <Text style={styles.buttonText}>
              Saved! <FontAwesomeIcon icon={faBookmark} color={"white"} />
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={handleSavePlantToCollection}
          >
            <Text style={styles.buttonText}>
              Save To Collection{" "}
              <FontAwesomeIcon icon={faBookmark} color={"white"} />
            </Text>
          </TouchableOpacity>
        )}

        <Pressable
          style={styles.button}
          title="Find Another Plant"
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>
            Find Another Plant{" "}
            <FontAwesomeIcon icon={faCamera} color={"white"} />
          </Text>
        </Pressable>

        <Pressable
          style={styles.button}
          title="Back To Home"
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.buttonText}>
            Back To Home <FontAwesomeIcon icon={faHome} color={"white"} />
          </Text>
        </Pressable>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  headingContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  heading1: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  heading2: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#32CD32",
    textAlign: "center",
  },
  resultCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  sectionContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    flex: 2,
    fontSize: 16,
    fontWeight: "bold",
    color: "#006400",
  },
  value: {
    flex: 2,
    fontSize: 16,
    color: "black",
  },
  scoreContainer: {
    backgroundColor: "lightgray",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 16,
    marginRight: 85,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  scoreGood: {
    backgroundColor: "#32CD32",
  },
  scoreBad: {
    backgroundColor: "#FF0000",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  emitter: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  sticker: {
    width: 50,
    height: 50,
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  button: {
    backgroundColor: "#006400",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "90%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

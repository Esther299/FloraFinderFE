import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  ImageBackground,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/Contexts";
import RNPickerSelect from "react-native-picker-select";
import CollectedListCard from "./CollectedListCard";

import { getCollectedPlantsList } from "../../api/apiFunctions";
const backgroundLeaf = require("../../assets/backgroundtest.jpg");

export default function CollectedList({ navigation }) {
  const { user, setUser } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(true);
  const [plants, setPlants] = useState([]);
  const [speciesFamilies, setSpeciesFamilies] = useState([]);
  const [selectedSpeciesFamily, setSelectedSpeciesFamily] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const username = user.username;

  // Fetch all species families on component mount
  useEffect(() => {
    const fetchAllSpeciesFamilies = async () => {
      try {
        const fetchedPlants = await getCollectedPlantsList(username, {});
        const uniqueSpeciesFamilies = [
          ...new Set(fetchedPlants.map((plant) => plant.speciesFamily)),
        ];
        setSpeciesFamilies(uniqueSpeciesFamilies);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.error(err);
      }
    };
    fetchAllSpeciesFamilies();
  }, [username]);

  // Fetch plants based on filter criteria
  useEffect(() => {
    console.log("USE EFFECT LOG");
    setIsLoading(true);
    const fetchPlants = async () => {
      try {
        const fetchedPlants = await getCollectedPlantsList(username, {
          speciesFamily: selectedSpeciesFamily,
          sortBy,
          orderBy,
        });
        setPlants(fetchedPlants);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.error(err);
      }
    };
    fetchPlants();
  }, [username, selectedSpeciesFamily, sortBy, orderBy]);

  const handleReset = () => {
    setSelectedSpeciesFamily("");
    setSortBy("");
    setOrderBy("");
  };

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
          <Text style={styles.loadingText}>Loading plants...</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <ImageBackground
        source={backgroundLeaf}
        style={styles.background}
        resizeMode="repeat"
      >
        <View style={styles.overlay}></View>
        <View style={styles.container}>
          <View style={styles.queryContainer}>
            <View style={styles.queryRow}>
              <View style={styles.queryButtonContainer}>
                <RNPickerSelect
                  onValueChange={(value) => setSelectedSpeciesFamily(value)}
                  items={speciesFamilies.map((family) => ({
                    label: family,
                    value: family,
                  }))}
                  placeholder={{ label: "Family", value: null }}
                  style={pickerSelectStyles}
                />
              </View>
              <View style={styles.queryButtonContainer}>
                <RNPickerSelect
                  onValueChange={(value) => setSortBy(value)}
                  items={[
                    { label: "Date", value: "dateCollected" },
                    { label: "Score", value: "matchScore" },
                    { label: "Name", value: "speciesName" },
                  ]}
                  placeholder={{ label: "Sort", value: null }}
                  style={pickerSelectStyles}
                />
              </View>
            </View>

            <View style={styles.queryButtonContainer}>
              <Pressable
                style={styles.iconButton}
                onPress={() => setOrderBy(orderBy === "ASC" ? "DESC" : "ASC")}
              >
                <Ionicons
                  name={orderBy === "DESC" ? "arrow-down" : "arrow-up"}
                  size={24}
                  color="white"
                />
              </Pressable>
            </View>
            <View style={styles.queryButtonContainer}>
              <Pressable style={styles.resetButton} onPress={handleReset}>
                <Text style={styles.buttonText}>Reset</Text>
              </Pressable>
            </View>
          </View>
          {plants.map((plant, index) => (
            <Pressable
              key={index}
              title="CollectedSingleCard"
              style={styles.card}
              onPress={() => {
                navigation.navigate("Single Plant", {
                  plant: plant,
                });
              }}
            >
              <CollectedListCard plant={plant} />
            </Pressable>
          ))}
        </View>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
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
  container: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  queryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  queryRow: {
    flexDirection: "row",
    flex: 3,
  },
  queryButtonContainer: {
    flex: 1,
    margin: 5,
  },
  iconButton: {
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#006400",
    borderRadius: 5,
  },
  resetButton: {
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#8B0000",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  card: {
    marginBottom: 10,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    width: 150,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30,
    backgroundColor: "white",
  },
  inputAndroid: {
    fontSize: 16,
    width: 150,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "gray",
    borderRadius: 8,
    color: "black",
    paddingRight: 30,
    backgroundColor: "white",
  },
});
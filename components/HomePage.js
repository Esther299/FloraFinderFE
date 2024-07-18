import React from "react";
import {
  StyleSheet,
  Pressable,
  Text,
  View,
  ImageBackground,
  Image,
  Platform,
} from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faLeaf, faBars, faMapMarker, faCamera, faCircleDot, faUser } from '@fortawesome/free-solid-svg-icons';
const logo = require("../assets/FloraFinderLogo.png");

const backgroundLeaf = require("../assets/backgroundtest.jpg");

export default function HomePage({ navigation }) {
  return (
    <ImageBackground
      source={backgroundLeaf}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}></View>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />
        </View>
        <Text style={styles.heading}>
          Home <FontAwesomeIcon icon={faHome} color={"#006400"} size={35} />
        </Text>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("League Table")}
        >
          <Text style={styles.buttonText}>
            League Table <FontAwesomeIcon icon={faBars} color={"white"} />
          </Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("Collected Plants")}
        >
          <Text style={styles.buttonText}>
            Collected List <FontAwesomeIcon icon={faLeaf} color={"white"} />
          </Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("Collected Map")}
        >
          <Text style={styles.buttonText}>
            Collected Map <FontAwesomeIcon icon={faMapMarker} color={"white"} />
          </Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("Collect Now")}
        >
          <Text style={styles.buttonText}>
            Collect Now <FontAwesomeIcon icon={faCamera} color={"white"} />
          </Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={styles.buttonText}>
            My Profile <FontAwesomeIcon icon={faUser} color={"white"} />
          </Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  heading: {
    fontSize: 24,
    color: "white",
    marginBottom: 20,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
  },
  button: {
    backgroundColor: "#006400",
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    paddingHorizontal: Platform.OS === "ios" ? 20 : 18,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
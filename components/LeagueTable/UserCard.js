import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ImageBackground,
} from "react-native";

const backgroundLeaf = require("../../assets/backgroundtest.jpg");

const UserCard = ({ route }) => {
  const { user } = route.params;
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ImageBackground
      source={backgroundLeaf}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user.avatar }}
              style={styles.avatar}
              resizeMode="contain"
            />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.username}>@{user.username}</Text>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.score}>{user.total_score} points</Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

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
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  loadingContainer: {
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 200,
    height: 250,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#006400",
  },
  infoContainer: {
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#006400",
    marginBottom: 5,
  },
  username: {
    fontSize: 18,
    color: "gray",
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
  },
  score: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#006400",
  },
});

export default UserCard;

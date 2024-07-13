import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ImageBackground,
} from "react-native";
import { getUserByUsername, getUsers } from "../../api/apiFunctions";

const backgroundLeaf = require("../../assets/backgroundtest.jpg");

const UserCard = ({ route }) => {
  const { username } = route.params;
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState(0);

  useEffect(() => {
    Promise.all([getUserByUsername(username), getUsers()])
      .then(([fetchedUser, allUsers]) => {
        setUser(fetchedUser);
        const userWithScore = allUsers.find((u) => u.username === username);
        if (userWithScore) {
          setScore(userWithScore.total_score);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
      });
  }, [username]);

  if (isLoading) {
    return (
      <ImageBackground
        source={backgroundLeaf}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#006400" />
          <Text>Loading...</Text>
        </View>
      </ImageBackground>
    );
  }

  if (!user) {
    return (
      <ImageBackground
        source={backgroundLeaf}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.container}>
          <Text style={styles.noDataText}>This user data is not available</Text>
        </View>
      </ImageBackground>
    );
  }

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
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.username}>@{user.username}</Text>
            <Text style={styles.email}>{user.email}</Text>
            <Text style={styles.score}>Total Score: {score}</Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    marginRight: 12,
  },
  avatar: {
    width: "100%",
    height: "200%",
    resizeMode: "cover",
    position: "absolute",
    top: 0,
    left: 0,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
    color: "#666",
    marginBottom: 1,
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginBottom: 1,
  },
  score: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 18,
    color: "#006400",
  },
});

export default UserCard;

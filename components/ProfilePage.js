import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Alert,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import { getUserByUsername, deleteUser } from "../api/apiFunctions";
import { ErrContext, UserContext } from "../contexts/Contexts";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUserXmark, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
const backgroundLeaf = require("../assets/backgroundtest.jpg");

export default function ProfilePage() {
  const { user, setUser } = useContext(UserContext);
  const { err, setErr } = useContext(ErrContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getUserByUsername(user.username)
      .then((fetchedUser) => {
        setUser(fetchedUser);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching profile", error);
        Alert.alert(
          err.status,
          err.msg,
          "Failed to load profile. Please try again."
        );
        setIsLoading(false);
      });
  }, [user.username]);
  
  const handleDeleteUser = () => {
    Alert.alert(
      "Delete Account",
      `Are you sure you want to delete your account, ${user.username}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            deleteUser(user.username)
              .then(() => {
                setUser({});
              })
              .catch((error) => {
                console.error("Error deleting user:", error);
                Alert.alert(
                  err.status,
                  err.msg,
                  "Failed to delete user. Please try again."
                );
              });
          },
        },
      ]
    );
  };
  const handleLogout = () => {
    setUser({});
  };

  if (isLoading) {
    return (
      <ImageBackground
        source={backgroundLeaf}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.activity_indicator_background}>
          <ActivityIndicator size="large" color="#006400" />
          <Text>Loading...</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <ImageBackground
        source={backgroundLeaf}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <Text style={styles.heading}>My Profile</Text>
        {user ? (
          <View style={styles.profileCard}>
            {user.avatar ? (
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: user.avatar }}
                  style={styles.avatar}
                  resizeMode="contain"
                />
                <Text style={styles.avatarLabel}>Avatar</Text>
              </View>
            ) : (
              <Text>No avatar available!</Text>
            )}
            <View style={styles.userInfo}>
              <Text style={styles.label}>Username:</Text>
              <Text style={styles.value}>{user.username}</Text>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{user.email}</Text>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{user.name}</Text>
              <Text style={styles.label}>Total Score:</Text>
              <Text style={styles.value}>{user.total_score}</Text>
            </View>
            <Pressable style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
              <FontAwesomeIcon icon={faSignOutAlt} color={"white"} size={25} />
            </Pressable>
            <Pressable style={styles.deleteButton} onPress={handleDeleteUser}>
              <Text style={styles.deleteButtonText}>Delete Account</Text>
              <FontAwesomeIcon icon={faUserXmark} color={"white"} size={25} />
            </Pressable>
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  activity_indicator_background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#fff",
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  profileCard: {
    width: "100%",
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
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 200,
    borderRadius: 50,
    marginBottom: 10,
  },
  avatarLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  noAvatarText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
  },
  userInfo: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#006400",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    marginRight: 10,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8B0000",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    marginRight: 10,
  },
});

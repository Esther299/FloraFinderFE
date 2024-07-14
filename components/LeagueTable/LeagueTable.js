import React, { useEffect, useState } from "react";
import { getUsers } from "../../api/apiFunctions";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import User from "./User";

const screenWidth = Dimensions.get("window").width;
const backgroundLeaf = require("../../assets/backgroundtest.jpg");

export default function LeagueTable() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    getUsers()
      .then((fetchedUsers) => {
        console.log("Fetched Users:", fetchedUsers);
        if (fetchedUsers) {
          setUsers(fetchedUsers);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setIsLoading(false);
      });
  }, []);

  const tableHead = ["Avatar", "Username", "Score", "Rank"];

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
          <Text>Loading table...</Text>
        </View>
      </ImageBackground>
    );
  }

  if (users.length === 0) {
    return (
      <ImageBackground
        source={backgroundLeaf}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.container}>
          <Text style={styles.noDataText}>No data available</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <ImageBackground
        source={backgroundLeaf}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.container}>
          <Text style={styles.heading}>League Table</Text>
          <View style={styles.tableContainer}>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                {tableHead.map((header, index) => (
                  <View
                    key={index}
                    style={[styles.headerCell, styles[`column${header}`]]}
                  >
                    <Text style={styles.headerText}>{header}</Text>
                  </View>
                ))}
              </View>
              {users.map((user, index) => (
                <Pressable
                  key={index}
                  title="UserCard"
                  style={styles.card}
                  onPress={() => {
                    navigation.navigate("User", { user });
                  }}
                >
                  <User user={user} index={index} />
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#fff",
  },
  noDataText: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  scrollView: {
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginVertical: 10,
  },
  tableContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
  },
  table: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#006400",
  },
  headerCell: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  columnAvatar: {
    flex: 1,
  },
  columnUsername: {
    flex: 1,
  },
  columnScore: {
    flex: 1,
  },
  columnRank: {
    flex: 1,
  },
});

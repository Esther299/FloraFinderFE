import React, { useEffect, useState, useContext } from "react";
import { getUsers } from "../../api/apiFunctions";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  ImageBackground,
  Pressable,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import User from "./User";
import { ErrContext } from "../../contexts/Contexts";

const screenWidth = Dimensions.get("window").width;
const backgroundLeaf = require("../../assets/backgroundtest.jpg");

export default function LeagueTable() {
  const { err, setErr } = useContext(ErrContext);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    setIsLoading(true)
    getUsers(setErr)
      .then((fetchedUsers) => {
        if (fetchedUsers) {
          setUsers(fetchedUsers);
        }
        setIsLoading(false);
      })
      .catch(() => {
         Alert.alert(
           `${(err.status, err.msg)}`,
           "Error fetching users. Please try again."
         );
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
        <View style={styles.activityIndicatorBackground}>
          <ActivityIndicator size="large" color="#006400" />
          <Text style={styles.loadingText}>Loading table...</Text>
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
    
      <ImageBackground
        source={backgroundLeaf}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.container}>
          <Text style={styles.heading}>League Table</Text>
          <View style={styles.tableContainer}>
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
              <ScrollView style={styles.scrollView}>
                {users.map((user, index) => (
                  <Pressable
                    key={index}
                    title="User Card"
                    style={styles.card}
                    onPress={() => {
                      navigation.navigate("User Card", { user });
                    }}
                  >
                    <User user={user} index={index} />
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
      </ImageBackground>
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
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#006400",
  },
  headerCell: {
    paddingTop: 20,
    paddingBottom: 20,
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
    flex: 2.2,
  },
  columnUsername: {
    flex: 2.2,
  },
  columnScore: {
    flex: 1.8,
  },
  columnRank: {
    flex: 1.8,
  },
});

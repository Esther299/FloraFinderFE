import * as React from "react";
import { StyleSheet, View, Text, Image, Platform } from "react-native";

export default function User({ user, index }) {
  return (
    <>
      <View style={[styles.cell, styles.columnAvatar]}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: user.avatar,
            }}
            style={styles.avatar}
            resizeMode="contain"
          />
        </View>
      </View>
      <View style={[styles.cell, styles.columnUsername]}>
        <Text style={styles.cellText}>{user.username}</Text>
      </View>
      <View style={[styles.cell, styles.columnScore]}>
        <Text style={styles.cellText}>{user.total_score}</Text>
      </View>
      <View style={[styles.cell, styles.columnRank]}>
        <Text style={styles.cellText}>{index + 1}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  columnAvatar: {
    flex: 3,
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
  },
  avatar: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  columnUsername: {
    flex: 2,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  columnScore: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  columnRank: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    fontSize: 16,
    color: "#333",
  },
});
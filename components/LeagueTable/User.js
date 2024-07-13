import * as React from "react";
import { StyleSheet, View, Text, Image } from "react-native";

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
    padding: 10,
    borderRightWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
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
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 100,
    borderRadius: 20,
  },
  cellText: {
    textAlign: "center",
    color: "#333",
  },
});
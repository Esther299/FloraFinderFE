import * as React from 'react';
import {
  StyleSheet,
  Pressable,
  View,
  Text,
  Image,
  ImageBackground,
} from "react-native";

const backgroundLeaf = require('../assets/backgroundtest.jpg');
const logo = require('../assets/FloraFinderLogo.png');

export default function LoginRegister({ navigation }) {
    return (
        <ImageBackground 
            source={backgroundLeaf}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.overlay}></View>
            <View style={styles.logoContainer}>
                <Image source={logo} style={styles.logo} />
            </View>
            <View style={styles.container}>
                <Pressable
                    style={styles.button}
                    title="Login"
                    onPress={() => {
                        navigation.navigate('Login');
                    }}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </Pressable>
                <Pressable
                    style={styles.button}
                    title="Register"
                    onPress={() => {
                        navigation.navigate('Register');
                    }}
                >
                    <Text style={styles.buttonText}>Register</Text>
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 50,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  container: {
    alignItems: "center",
  },
  button: {
    backgroundColor: "#006400",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginBottom: 20,
    width: 200,
    alignItems: "center",
  },
  buttonAndroid: {
    elevation: 3,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  buttonIOS: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
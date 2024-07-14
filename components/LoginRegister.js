import * as React from 'react';
import {
  StyleSheet,
  Pressable,
  View,
  Text,
  Image,
  ImageBackground,
  Platform,
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
    container: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center', 
    },
    logoContainer: {
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#006400',
        width: '50%',
        marginTop: 12,
    },
    buttonText: {
        color: 'white',
    },
    background: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    logo: {
        width: 250,
        height: 350,
        resizeMode: 'contain',
    },
});

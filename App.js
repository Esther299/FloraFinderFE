import { StyleSheet, Text, View } from "react-native";
import * as React from "react";
import UserProvider from "./contexts/Contexts";
import { NavigationContainer } from "@react-navigation/native";
import { TabNavigator } from "./components/navigators/TabNavigator";
import { useFonts, Inter_900Black } from '@expo-google-fonts/inter';

export default function App() {
    let [fontsLoaded] = useFonts({
        Inter_900Black,
      });
    
      if (!fontsLoaded) {
        return null;
      }
    return (
        <UserProvider>
            <NavigationContainer>
                <TabNavigator />
            </NavigationContainer>
        </UserProvider>
    );
}

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#ccffcc",
//         alignItems: "center",
//         justifyContent: "center",
//     },
// });

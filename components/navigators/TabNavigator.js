import * as React from "react";
import { useContext } from "react";
import { StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHome, faCamera, faLeaf } from "@fortawesome/free-solid-svg-icons";

import LoginRegister from "../LoginRegister";
import Login from "../Login";
import Register from "../Register";
import CollectedList from "../collected-list/CollectedList";
import CollectedSingleCard from "../collected-list/CollectedSingleCard";
import CollectedMap from "../CollectedMap";
import CollectNow from "../CollectNow";
import LeagueTable from "../LeagueTable/LeagueTable";
import HomePage from "../HomePage";
import PlantResult from "../PlantResult";
import ProfilePage from "../ProfilePage";
import UserCard from "../LeagueTable/UserCard";

import { UserContext } from "../../contexts/Contexts";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export function TabNavigator() {
  const { user } = useContext(UserContext);

  if (user.username) {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "green",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarIconStyle: styles.tabBarIcon,
        }}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeStack}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: () => <FontAwesomeIcon icon={faHome} color={"green"} />,
          }}
        />
        <Tab.Screen
          name="CollectTab"
          component={CollectNowStack}
          options={{
            tabBarLabel: "Collect Now",
            tabBarIcon: () => (
              <FontAwesomeIcon icon={faCamera} color={"green"} />
            ),
          }}
        />
        <Tab.Screen
          name="CollectedListTab"
          component={CollectedListStack}
          options={{
            tabBarLabel: "Collection",
            tabBarIcon: () => <FontAwesomeIcon icon={faLeaf} color={"green"} />,
          }}
        />
      </Tab.Navigator>
    );
  } else {
    return (
      <Stack.Navigator initialRouteName="Flora Finder">
        <Stack.Screen name="Flora Finder" component={LoginRegister} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
      </Stack.Navigator>
    );
  }
}

const HomeStack = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen name="Home" component={HomePage} />
    <Stack.Screen name="Collected Plants" component={CollectedList} />
    <Stack.Screen name="Collected Map" component={CollectedMap} />
    <Stack.Screen name="Collect Now" component={CollectNow} />
    <Stack.Screen name="League Table" component={LeagueTable} />
    <Stack.Screen name="Found Plant" component={PlantResult} />
    <Stack.Screen name="Single Plant" component={CollectedSingleCard} />
    <Stack.Screen name="User" component={UserCard} />
    <Stack.Screen name="Profile" component={ProfilePage} />
  </Stack.Navigator>
);

const CollectNowStack = () => (
  <Stack.Navigator initialRouteName="Collect Now">
    <Stack.Screen name="Home" component={HomePage} />
    <Stack.Screen name="Collected Plants" component={CollectedList} />
    <Stack.Screen name="Collected Map" component={CollectedMap} />
    <Stack.Screen name="Collect Now" component={CollectNow} />
    <Stack.Screen name="League Table" component={LeagueTable} />
    <Stack.Screen name="Found Plant" component={PlantResult} />
    <Stack.Screen name="Single Plant" component={CollectedSingleCard} />
    <Stack.Screen name="User" component={UserCard} />
    <Stack.Screen name="Profile" component={ProfilePage} />
  </Stack.Navigator>
);

const CollectedListStack = () => (
  <Stack.Navigator initialRouteName="Collected Plants">
    <Stack.Screen name="Home" component={HomePage} />
    <Stack.Screen name="Collected Plants" component={CollectedList} />
    <Stack.Screen name="Collected Map" component={CollectedMap} />
    <Stack.Screen name="Collect Now" component={CollectNow} />
    <Stack.Screen name="League Table" component={LeagueTable} />
    <Stack.Screen name="Found Plant" component={PlantResult} />
    <Stack.Screen name="Single Plant" component={CollectedSingleCard} />
    <Stack.Screen name="User" component={UserCard} />
    <Stack.Screen name="Profile" component={ProfilePage} />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingBottom: 5,
    paddingTop: 5,
    height: 60,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  tabBarIcon: {
    marginBottom: -3,
  },
  stackNavigator: {
    headerStyle: {
      backgroundColor: "#006400",
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold",
    },
  },
  stackScreen: {
    headerShown: false,
  },
});
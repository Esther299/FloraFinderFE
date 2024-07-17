import * as React from "react";
import {
  TextInput,
  StyleSheet,
  Pressable,
  Text,
  View,
  ImageBackground,
  Alert,
  Image,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useContext, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { ErrContext, UserContext } from "../contexts/Contexts";
import { postLogin } from "../api/apiFunctions";
const backgroundLeaf = require("../assets/backgroundtest.jpg");
const logo = require("../assets/FloraFinderLogo.png");

export default function Login() {
  const { user, setUser } = useContext(UserContext);
  const { err, setErr } = useContext(ErrContext);
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    const { username, password } = data;
    console.log(username);
    console.log(password);
    handleLogin(username, password);
  };

  const handleLogin = (username, password) => {
    setIsLoading(true)
    const credentials = { username, password };
    postLogin(credentials, setErr)
      .then((user) => {
        setUser(user);
        setIsLoading(false);
        Alert.alert("You are logged in!", `Welcome back, ${user.username}`);
      })
      .catch(() => {
        setIsLoading(false);
        if (err.status === 404) {
          Alert.alert(`${err.msg}`, "Try again");
        } else {
          Alert.alert(
            `${(err.status, err.msg)}`,
            "Sorry, something went wrong"
          );
        }
      });
  };

  if (isLoading) {
    return (
      <ImageBackground
        source={backgroundLeaf}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.activityIndicatorBackground}>
          <ActivityIndicator size="large" color="#006400" />
          <Text style={styles.loadingText}>Logging in...</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContainer}
      showsVerticalScrollIndicator={false}
    >
      <ImageBackground
        source={backgroundLeaf}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}></View>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image source={logo} style={styles.logo} />
          </View>
          <Text style={styles.heading}>Login</Text>

          <Text style={styles.labelContainerText}>Username:</Text>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Enter username here"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.textInput}
              />
            )}
          />
          {errors.username && (
            <Text style={styles.alertText}>{errors.username.message}</Text>
          )}

          <Text style={styles.labelContainerText}>Password:</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                secureTextEntry={true}
                placeholder="Enter password here"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.textInput}
              />
            )}
          />
          <Pressable
            style={styles.button}
            title="Login"
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  scrollViewContainer: {
    flexGrow: 1,
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  heading: {
    fontSize: 24,
    color: "white",
    marginBottom: 20,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
  },
  labelContainerText: {
    color: "white",
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  textInput: {
    width: "100%",
    padding: Platform.OS === "ios" ? 15 : 10,
    backgroundColor: "white",
    borderRadius: 5,
    marginBottom: 10,
    fontSize: Platform.OS === "ios" ? 16 : 14,
  },
  alertText: {
    color: "red",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: "green",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

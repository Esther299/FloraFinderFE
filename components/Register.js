import * as React from "react";
import {
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
  Text,
  View,
  Alert,
  Image,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useContext, useState } from "react";
import { ErrContext } from "../contexts/Contexts";
import { postNewUser } from "../api/apiFunctions";

const backgroundLeaf = require("../assets/backgroundtest.jpg");
const logo = require("../assets/FloraFinderLogoEsther.png");

const validationSchema = yup.object().shape({
  emailAddress: yup
    .string()
    .email("Invalid email address")
    .required("Email Address is required"),
  password: yup
    .string()
    .min(5, "Password must be at least 5 characters")
    .max(20, "Password must be no more than 20 characters")
    .matches(/\w/, "Password must contain only letters, digits, or underscores")
    .required("Password is required"),
  username: yup
    .string()
    .max(20, "Username must be no more than 20 characters")
    .required("Username is required"),
  firstName: yup
    .string()
    .max(100, "First Name must be no more than 100 characters")
    .required("First Name is required"),
  lastName: yup
    .string()
    .max(100, "Last Name must be no more than 100 characters")
    .required("Last Name is required"),
});

export default function Register({ navigation }) {
  const { err, setErr } = useContext(ErrContext);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      emailAddress: "",
      password: "",
      username: "",
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = (data) => {
    setIsLoading(true);
    const newUser = {
      username: data.username,
      name: `${data.firstName} ${data.lastName}`,
      email: data.emailAddress,
      password: data.password,
    };
    console.log(newUser, "posted user");
    postNewUser(newUser, setErr)
      .then(() => {
        setIsLoading(false);
        Alert.alert("Registration complete!", "Please login to your account.", [
          {
            text: "Login",
            onPress: () => navigation.navigate("Login"),
            style: "default",
          },
        ]);
      })
      .catch(() => {
        setIsLoading(false);
        Alert.alert(
          `${(err.status, err.msg)}`,
          "Registration failed. Please try again."
        );
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
          <Text style={styles.loadingText}>Registering...</Text>
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
        style={styles.backgroundImage}
        resizeMode="stretch"
      >
        <View style={styles.overlay}></View>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image source={logo} style={styles.logo} />
          </View>
          <Text style={styles.heading}>Register</Text>

          {[
            { name: "emailAddress", label: "Enter your email address:" },
            { name: "password", label: "Create a password:", secure: true },
            { name: "username", label: "Enter a username:" },
            { name: "firstName", label: "Enter your first name:" },
            { name: "lastName", label: "Enter your last name:" },
          ].map(({ name, label, secure }) => (
            <View key={name} style={styles.inputContainer}>
              <Text style={styles.labelContainerText}>{label}</Text>
              <Controller
                control={control}
                name={name}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <TextInput
                      secureTextEntry={secure}
                      placeholder={label}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      style={styles.textInput}
                    />
                    {errors[name] && (
                      <Text style={styles.errorText}>
                        {errors[name].message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>
          ))}

          <Pressable
            style={styles.button}
            title="Submit"
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.buttonText}>Create An Account</Text>
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
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    width: "100%",
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: "contain",
  },
  heading: {
    fontSize: 24,
    color: "white",
    marginBottom: 20,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    textAlign: "center",
  },
  labelContainerText: {
    textAlign: "center",
    color: "white",
  },
  inputContainer: {
    width: "100%",
    maxWidth: 300,
    marginBottom: 20,
  },
  textInput: {
    width: "100%",
    padding: Platform.OS === "ios" ? 15 : 10,
    backgroundColor: "white",
    borderRadius: 5,
    marginTop: 10,
    fontSize: Platform.OS === "ios" ? 16 : 14,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 20,
    width: "100%",
    textAlign: "left",
  },
  button: {
    margin: 20,
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

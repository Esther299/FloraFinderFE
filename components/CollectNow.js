import * as React from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
  ImageBackground,
} from "react-native";
import { createRef, useState } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { postPhotoToPlantNet } from "../api/apiFunctions";
import * as ImagePicker from "expo-image-picker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCamera,
  faTh,
  faMagnifyingGlassPlus,
  faMagnifyingGlassMinus,
} from "@fortawesome/free-solid-svg-icons";
const ref = createRef();

const backgroundLeaf = require("../assets/backgroundtest.jpg");

export default function CollectNow({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [imageUri, setImageUri] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingPreview, setIsSettingPreview] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0);

  if (!permission) {
    return <View />;
  }
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          Flora Finder wants to use your camera?
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleTakePicture = async () => {
    setIsSettingPreview(true);
    try {
      await ref.current.takePictureAsync().then((photo) => {
        setImageUri(photo.uri);
        setIsSettingPreview(false);
      });
    } catch (error) {
       Alert.alert(
         "Error",
         "There was an error taking the picture. Please try again.",
         [
           {
             text: "OK",
             style: "default",
           },
         ]
       );
       setIsSettingPreview(false);
    }
  };
  const handlePostPicture = async () => {
    setIsLoading(true);
    const firstMatch = await postPhotoToPlantNet(imageUri)
      .then((firstMatch) => {
        if (firstMatch.species.commonNames[0] !== undefined) {
          navigation.navigate("Found Plant", { plant: firstMatch });
          setImageUri("");
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.log(error, "error in HANDLEPOST");
        setIsLoading(false);
        Alert.alert("Unable to ID image", "Please try again", [
          {
            text: "OK",
            style: "default",
          },
        ]);
      });
  };
  const handleZoomIn = () => {
    if (zoomLevel < 1) {
      setZoomLevel(zoomLevel + 0.1);
    }
  };
  const handleZoomOut = () => {
    if (zoomLevel > 0) {
      setZoomLevel(zoomLevel - 0.1);
    }
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
          <ActivityIndicator
            style={styles.loadPage}
            size="large"
            color="#006400"
          />
          <Text>Analysing plant data...</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <CameraView
      ref={ref}
      style={styles.camera}
      zoom={zoomLevel}
      focusMode={"off"}
    >
      <View style={styles.hudContainer}>
        <View style={styles.previewContainer}>
          {imageUri ? (
            <Image style={styles.previewImage} source={{ uri: imageUri }} />
          ) : null}
        </View>
        <View style={styles.zoomButtonContainer}>
          <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
            <FontAwesomeIcon icon={faMagnifyingGlassPlus} color={"white"} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
            <FontAwesomeIcon icon={faMagnifyingGlassMinus} color={"white"} />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
        
          <TouchableOpacity
            style={styles.galleryButton}
            onPress={pickImageAsync}
          >
            <FontAwesomeIcon icon={faTh} color={"white"} />
          </TouchableOpacity>
        
          {isSettingPreview ? (
            <View style={styles.activityIndicatorPreview}>
              <ActivityIndicator size="large" color="#006400" />
            </View>
          ) : (
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={handleTakePicture}
            >
              <Text style={styles.buttonText}>
                <FontAwesomeIcon
                  style={styles.iconButtonStyle}
                  icon={faCamera}
                  color={"white"}
                />
              </Text>
            </TouchableOpacity>
          )}
          {imageUri && !isSettingPreview ? (
            <TouchableOpacity
              style={styles.idButton}
              onPress={handlePostPicture}
            >
              <Text style={styles.buttonText}>ID Plant</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </CameraView>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  activityIndicatorBackground: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadPage: {
    marginBottom: 10,
  },
  camera: {
    flex: 1,
  },
  hudContainer: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
  },
  previewContainer: {
    alignItems: "center",
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    resizeMode: "cover",
  },
  zoomButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  zoomButton: {
    backgroundColor: "#006400",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  galleryButton: {
    backgroundColor: "#006400",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "20%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginLeft: 40,
  },
  cameraButton: {
    backgroundColor: "#006400",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "20%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginRight: 40,
  },
  idButton: {
    backgroundColor: "#006400",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "30%",
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
  activityIndicatorPreview: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconButtonStyle: {
    marginRight: 5,
  },
});

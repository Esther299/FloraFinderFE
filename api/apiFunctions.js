import axios from "axios";
const FormData = require("form-data");
import handleApiError from "./apiErrorHandling.js";

const plantNetApi = axios.create({
  baseURL: "https://my-api.plantnet.org",
});
const { API_KEY } = require("../.plant_net.js");

const floraFinderApi = axios.create({
  baseURL: "http://16.170.228.135:3000/api",
});

export const postPhotoToPlantNet = (imageUri) => {
  let form = new FormData();
  const imageToAppend = {
    uri: imageUri,
    type: "image/jpeg",
    name: "image.jpg",
  };
  form.append("images", imageToAppend);
  return plantNetApi
    .post(
      `/v2/identify/all?api-key=${API_KEY}&include-related-images=true`,
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    )
    .then((response) => {
      return response.data.results[0];
    })
    .catch((error) => {
      throw new Error(`plant API error: ${error}`);
    });
};

export const postNewUser = (newUser, setErr) => {
  console.log("postNewUser API");
  return floraFinderApi
    .post(`/users`, newUser)
    .then((response) => {
      return response.data.user;
    })
    .catch((error) => {
      handleApiError(error, setErr, "postNewUser");
    });
};

export const postNewPlantToCollection = (username, newCollection, setErr) => {
  console.log("postNewPlant API");
  return floraFinderApi
    .post(`/users/${username}/collections`, newCollection)
    .then((response) => {
      return response.data.collection;
    })
    .catch((error) => {
      handleApiError(error, setErr, "postNewPlantToCollection");
    });
};

export const getUserByUsername = (username, setErr) => {
  console.log("getUser API");
  return floraFinderApi
    .get(`/users/${username}`)
    .then((response) => {
      return response.data.user;
    })
    .catch((error) => {
      handleApiError(error, setErr, "getUserByUsername");
    });
};

export const getCollectedPlantsList = (username, options, setErr) => {
  console.log("getPlantList API");
  const { speciesFamily, sortBy, orderBy } = options;

  let url = `/users/${username}/collections`;

  const queryParams = [];
  if (speciesFamily) queryParams.push(`speciesFamily=${speciesFamily}`);
  if (sortBy) queryParams.push(`sortBy=${sortBy}`);
  if (orderBy) queryParams.push(`orderBy=${orderBy}`);

  if (queryParams.length > 0) {
    url += `?${queryParams.join("&")}`;
  }
  console.log(url);
  return floraFinderApi
    .get(url)
    .then((response) => response.data.collections)
    .catch((error) => {
      handleApiError(error, setErr, "getCollectedPlantsList");
    });
};

export const getUsers = (setErr) => {
  console.log("getUsers API");
  return floraFinderApi
    .get("/users")
    .then((response) => {
      return response.data.users;
    })
    .catch((error) => {
      handleApiError(error, setErr, "getUsers");
    });
};

export const postLogin = (credentials, setErr) => {
  console.log("postLogin API");
  return floraFinderApi
    .post(`/users/login`, credentials)
    .then((response) => {
      return response.data.user;
    })
    .catch((error) => {
      handleApiError(error, setErr, "postLogin");
    });
};

export const deleteUser = (username, setErr) => {
  console.log("deleteUser API");
  return floraFinderApi
    .delete(`/users/${username}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      handleApiError(error, setErr, "deleteUser");
    });
};

export const getCollections = (setErr) => {
  return floraFinderApi
    .get("/collections")
    .then((response) => {
      return response.data.collections;
    })
    .catch((error) => {
      handleApiError(error, setErr, "getCollections");
    });
};

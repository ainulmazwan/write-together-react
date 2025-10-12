import { API_URL } from "./constants";
import axios from "axios";

export async function signup(name, email, password) {
  const response = await axios.post(API_URL + "users/signup", {
    name,
    email,
    password,
  });
  return response.data;
}

export async function login(email, password) {
  const response = await axios.post(API_URL + "users/login", {
    email,
    password,
  });
  return response.data;
}

export async function getUserById(id) {
  const response = await axios.get(API_URL + "users/" + id);
  return response.data;
}

export async function addToFavourites(userId, storyId, token) {
  const response = await axios.post(
    API_URL + "users/" + userId + "/favourites/" + storyId,
    {},
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
}

export async function removeFromFavourites(userId, storyId, token) {
  const response = await axios.delete(
    API_URL + "users/" + userId + "/favourites/" + storyId,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
}

// get favourited stories
export async function getFavouritedStories(userId, token) {
  const response = await axios.get(
    API_URL + "users/" + userId + "/favourites",
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
}

// ADMIN ONLY
// get ALL users (admin only)
export async function getUsers(token) {
  const response = await axios.get(API_URL + "users", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}

// update user
export async function updateUser(id, updates, token) {
  const response = await axios.put(API_URL + "users/" + id, updates, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}

// delete user
export async function deleteUser(id, token) {
  const response = await axios.delete(API_URL + "users/" + id, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}

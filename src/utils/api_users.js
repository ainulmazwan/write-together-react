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

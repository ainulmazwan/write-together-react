import { API_URL } from "./constants";
import axios from "axios";

export async function getGenres() {
  const response = await axios.get(API_URL + "genres");
  return response.data;
}

export async function addGenre(name) {
  const response = await axios.post(API_URL + "genres", {
    name,
  });
  return response.data;
}

export async function editGenre(id, name) {
  const response = await axios.put(API_URL + "genres/" + id, {
    name,
  });
  return response.data;
}

export async function deleteGenre(id) {
  const response = await axios.delete(API_URL + "genres/" + id);
  return response.data;
}

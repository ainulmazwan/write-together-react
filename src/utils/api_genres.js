import { API_URL } from "./constants";
import axios from "axios";

export async function getGenres() {
  const response = await axios.get(API_URL + "genres");
  return response.data;
}

export async function addGenre(name, token) {
  const response = await axios.post(
    API_URL + "genres",
    {
      name,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
}

export async function editGenre(id, name, token) {
  const response = await axios.put(
    API_URL + "genres/" + id,
    {
      name,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
}

export async function deleteGenre(id, token) {
  const response = await axios.delete(API_URL + "genres/" + id, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}

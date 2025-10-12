import { API_URL } from "./constants";
import axios from "axios";

export async function addStory(
  title,
  description,
  genre,
  author,
  publishDate,
  votingWindow,
  deadline,
  chapterContent,
  token
) {
  const response = await axios.post(
    API_URL + "stories",
    {
      title,
      description,
      genre,
      author,
      publishDate,
      votingWindow,
      deadline,
      chapterContent,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
}

export async function getStoryById(id) {
  const response = await axios.get(API_URL + "stories/" + id);
  return response.data;
}

export async function getStoriesByAuthor(id, token) {
  const response = await axios.get(API_URL + "stories/author/" + id, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}

// get ALL stories
export async function getStories(genre, status, search, sortBy) {
  let queryParams = {};

  // check if queries exist
  if (genre !== "all") {
    queryParams.genre = genre;
  }
  if (status !== "all") {
    queryParams.status = status;
  }
  if (search !== "") {
    queryParams.search = search;
  }

  const queryString = new URLSearchParams(queryParams).toString();

  let full_API_URL = API_URL + "stories";

  if (queryString) {
    full_API_URL += "?" + queryString;
  }

  const response = await axios.get(full_API_URL);
  return response.data;
}

// advance round
export async function advanceRound(storyId) {
  const response = await axios.put(API_URL + "stories/advance/" + storyId);
  return response.data;
}

// update story
export async function updateStory(id, updates, token) {
  const response = await axios.put(API_URL + "stories/" + id, updates, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}

// delete story
export async function deleteStory(id, token) {
  const response = await axios.delete(API_URL + "stories/" + id, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}

// end story
export async function endStory(id, token) {
  const response = await axios.put(
    API_URL + "stories/" + id + "/end",
    {}, // no body needed
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
}

// resume story
export async function resumeStory(id, token) {
  const response = await axios.put(
    API_URL + "stories/" + id + "/resume",
    {},
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
}

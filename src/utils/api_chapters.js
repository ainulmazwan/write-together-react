import { API_URL } from "./constants";
import axios from "axios";

export async function getChapter(id) {
  const response = await axios.get(API_URL + "chapters/" + id);
  return response.data;
}

export async function getChaptersByAuthor(authorId, token) {
  const response = await axios.get(API_URL + "chapters/author/" + authorId, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}

export async function getSubmissionsForCurrentRound(storyId) {
  const response = await axios.get(API_URL + "chapters/story/" + storyId);
  return response.data;
}

export async function addChapter(storyId, content, authorId, token) {
  const response = await axios.post(
    API_URL + "chapters",
    {
      storyId,
      content,
      authorId,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
}

export async function updateChapter(chapterId, updates, token) {
  const response = await axios.put(API_URL + "chapters/" + chapterId, updates, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}

export async function deleteChapter(chapterId, token) {
  console.log(token);
  const response = await axios.delete(API_URL + "chapters/" + chapterId, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}

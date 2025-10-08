import { API_URL } from "./constants";
import axios from "axios";

export async function getChapter(id) {
  const response = await axios.get(API_URL + "chapters/" + id);
  return response.data;
}

export async function getChaptersByAuthor(authorId) {
  const response = await axios.get(API_URL + "chapters/author/" + authorId);
  return response.data;
}

export async function getSubmissionsForCurrentRound(storyId) {
  const response = await axios.get(API_URL + "chapters/story/" + storyId);
  return response.data;
}

export async function addChapter(storyId, content, authorId) {
  const response = await axios.post(API_URL + "chapters", {
    storyId,
    content,
    authorId,
  });
  return response.data;
}

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
  chapterContent
) {
  const response = await axios.post(API_URL + "stories/add", {
    title,
    description,
    genre,
    author,
    publishDate,
    votingWindow,
    deadline,
    chapterContent,
  });
  return response.data;
}

export async function getStoryById(id) {
  const response = await axios.get(API_URL + "stories/" + id);
  return response.data;
}

export async function getStoriesByAuthor(id) {
  const response = await axios.get(API_URL + "stories/author/" + id);
  return response.data;
}

// get ALL stories
export async function getStories(genre, sortBy) {
  const response = await axios.get(API_URL + "stories");
  return response.data;
}

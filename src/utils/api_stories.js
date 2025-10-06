import { API_URL } from "./constants";
import axios from "axios";

export async function addStory(title, description, genre, author, publishDate, votingWindow, deadline, chapterContent) {
  const response = await axios.post(API_URL + "stories/add", {
    title,
    description,
    genre,
    author,
    publishDate,
    votingWindow,
    deadline,
    chapterContent
  });
  return response.data;
}
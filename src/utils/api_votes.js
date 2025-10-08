import { API_URL } from "./constants";
import axios from "axios";

export async function getVote(userId, storyId) {
  const response = await axios.get(
    API_URL + "votes/user/" + userId + "/story/" + storyId
  );
  return response.data;
}

export async function getVotesForSubmission(submissionId) {
  const response = await axios.get(API_URL + "votes/chapter/" + submissionId);
  return response.data;
}

export async function addVote(userId, chapterId, storyId) {
  const response = await axios.post(API_URL + "votes", {
    userId,
    chapterId,
    storyId,
  });
  return response.data;
}

export async function removeVote(userId, chapterId) {
  const response = await axios.delete(API_URL + "votes", {
    data: { userId, chapterId }, // axios requires data:{} for delete (FOR SOME UNGODLY REASON)
  });
  return response.data;
}

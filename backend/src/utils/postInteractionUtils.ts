// postInteractionUtils.ts (shared logic for likes, comments, delete)
import axios from 'axios';

const API_BASE_URL = 'http://your-api-url/api/posts';

export const deletePost = async (postId: string) => {
  return axios.delete(`${API_BASE_URL}/${postId}`);
};

export const toggleLikePost = async (postId: string) => {
  return axios.patch(`${API_BASE_URL}/${postId}/like`);
};

export const addCommentToPost = async (postId: string, comment: string) => {
  return axios.post(`${API_BASE_URL}/${postId}/comments`, { comment });
};

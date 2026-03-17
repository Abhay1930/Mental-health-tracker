import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {

    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const moodApi = {

  getMoods: () => api.get('/mood'),

  getMood: (id) => api.get(`/mood/${id}`),

  createMood: (moodData) => api.post('/mood', moodData),

  updateMood: (id, moodData) => api.put(`/mood/${id}`, moodData),

  getPrediction: () => api.get('/mood/predict/tomorrow'),
  getFuturePrediction: () => api.get('/mood/predict/future'),

  deleteMood: (id) => api.delete(`/mood/${id}`)
};

export const resourcesApi = {

  getResources: () => api.get('/resources'),

  getResourcesByCategory: (category) => api.get(`/resources/category/${category}`),

  getResource: (id) => api.get(`/resources/${id}`)
};

export const exercisesApi = {

  getExercises: () => api.get('/exercises'),

  getExercisesByCategory: (category) => api.get(`/exercises/category/${category}`),

  getExercise: (id) => api.get(`/exercises/${id}`)
};

export const journalApi = {

  getJournals: () => api.get('/journal'),

  getJournal: (id) => api.get(`/journal/${id}`),

  createJournal: (journalData) => api.post('/journal', journalData),

  updateJournal: (id, journalData) => api.put(`/journal/${id}`, journalData),

  deleteJournal: (id) => api.delete(`/journal/${id}`),

  getJournalsByTag: (tag) => api.get(`/journal/tag/${tag}`)
};

export const goalsApi = {

  getGoals: () => api.get('/goals'),

  getGoal: (id) => api.get(`/goals/${id}`),

  createGoal: (goalData) => api.post('/goals', goalData),

  updateGoal: (id, goalData) => api.put(`/goals/${id}`, goalData),

  deleteGoal: (id) => api.delete(`/goals/${id}`),

  updateStep: (id, stepData) => api.put(`/goals/${id}/step`, stepData),

  getGoalsByCategory: (category) => api.get(`/goals/category/${category}`)
};

export const postsApi = {

  getPosts: () => api.get('/posts'),

  getPost: (id) => api.get(`/posts/${id}`),

  createPost: (postData) => api.post('/posts', postData),

  updatePost: (id, postData) => api.put(`/posts/${id}`, postData),

  deletePost: (id) => api.delete(`/posts/${id}`),

  likePost: (id) => api.put(`/posts/like/${id}`),

  addComment: (id, commentData) => api.post(`/posts/comment/${id}`, commentData),

  deleteComment: (id, commentId) => api.delete(`/posts/comment/${id}/${commentId}`),

  reportPost: (id) => api.put(`/posts/report/${id}`),

  reportComment: (id, commentId) => api.put(`/posts/report-comment/${id}/${commentId}`),

  getPostsByTag: (tag) => api.get(`/posts/tag/${tag}`),

  getPostsByUser: (userId) => api.get(`/posts/user/${userId}`),

  getReportedPosts: () => api.get('/posts/reported'),

  moderatePost: (id, moderationData) => api.put(`/posts/moderate/${id}`, moderationData)
};

export default api;

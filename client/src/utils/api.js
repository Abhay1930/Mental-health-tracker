import axios from 'axios';

// Using Vite's proxy configuration
const API_URL = '/api';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add auth token to requests
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

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Mood tracking API calls
export const moodApi = {
  // Get all mood entries for the current user
  getMoods: () => api.get('/mood'),

  // Get a specific mood entry
  getMood: (id) => api.get(`/mood/${id}`),

  // Create a new mood entry
  createMood: (moodData) => api.post('/mood', moodData),

  // Update a mood entry
  updateMood: (id, moodData) => api.put(`/mood/${id}`, moodData),

  // Delete a mood entry
  deleteMood: (id) => api.delete(`/mood/${id}`)
};

// Resources API calls
export const resourcesApi = {
  // Get all resources
  getResources: () => api.get('/resources'),

  // Get resources by category
  getResourcesByCategory: (category) => api.get(`/resources/category/${category}`),

  // Get a specific resource
  getResource: (id) => api.get(`/resources/${id}`)
};

// Exercises API calls
export const exercisesApi = {
  // Get all exercises
  getExercises: () => api.get('/exercises'),

  // Get exercises by category
  getExercisesByCategory: (category) => api.get(`/exercises/category/${category}`),

  // Get a specific exercise
  getExercise: (id) => api.get(`/exercises/${id}`)
};

// Journal API calls
export const journalApi = {
  // Get all journal entries for the current user
  getJournals: () => api.get('/journal'),

  // Get a specific journal entry
  getJournal: (id) => api.get(`/journal/${id}`),

  // Create a new journal entry
  createJournal: (journalData) => api.post('/journal', journalData),

  // Update a journal entry
  updateJournal: (id, journalData) => api.put(`/journal/${id}`, journalData),

  // Delete a journal entry
  deleteJournal: (id) => api.delete(`/journal/${id}`),

  // Get journal entries by tag
  getJournalsByTag: (tag) => api.get(`/journal/tag/${tag}`)
};

// Goals API calls
export const goalsApi = {
  // Get all goals for the current user
  getGoals: () => api.get('/goals'),

  // Get a specific goal
  getGoal: (id) => api.get(`/goals/${id}`),

  // Create a new goal
  createGoal: (goalData) => api.post('/goals', goalData),

  // Update a goal
  updateGoal: (id, goalData) => api.put(`/goals/${id}`, goalData),

  // Delete a goal
  deleteGoal: (id) => api.delete(`/goals/${id}`),

  // Update a step in a goal
  updateStep: (id, stepData) => api.put(`/goals/${id}/step`, stepData),

  // Get goals by category
  getGoalsByCategory: (category) => api.get(`/goals/category/${category}`)
};

// Community Posts API calls
export const postsApi = {
  // Get all posts
  getPosts: () => api.get('/posts'),

  // Get a specific post
  getPost: (id) => api.get(`/posts/${id}`),

  // Create a new post
  createPost: (postData) => api.post('/posts', postData),

  // Update a post
  updatePost: (id, postData) => api.put(`/posts/${id}`, postData),

  // Delete a post
  deletePost: (id) => api.delete(`/posts/${id}`),

  // Like or unlike a post
  likePost: (id) => api.put(`/posts/like/${id}`),

  // Add a comment to a post
  addComment: (id, commentData) => api.post(`/posts/comment/${id}`, commentData),

  // Delete a comment from a post
  deleteComment: (id, commentId) => api.delete(`/posts/comment/${id}/${commentId}`),

  // Report a post
  reportPost: (id) => api.put(`/posts/report/${id}`),

  // Report a comment
  reportComment: (id, commentId) => api.put(`/posts/report-comment/${id}/${commentId}`),

  // Get posts by tag
  getPostsByTag: (tag) => api.get(`/posts/tag/${tag}`),

  // Get posts by user
  getPostsByUser: (userId) => api.get(`/posts/user/${userId}`),

  // Get reported posts (admin only)
  getReportedPosts: () => api.get('/posts/reported'),

  // Moderate a post (admin only)
  moderatePost: (id, moderationData) => api.put(`/posts/moderate/${id}`, moderationData)
};

export default api;

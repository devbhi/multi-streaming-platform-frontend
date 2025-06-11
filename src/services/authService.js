import axios from 'axios';

const API_BASE_URL = 'https://multi-streaming-platform-backend.vercel.app';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  // Register a new user
  async register(email, password) {
    try {
      const response = await api.post('/signup', {
        email,
        password,
      });
      return {
        success: true,
        data: response.data,
        user: {
          email,
          name: email.split('@')[0],
          id: response.data.userId,
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.message || 'Registration failed',
      };
    }
  },

  // Login user
  async login(email, password) {
    try {
      const response = await api.post('/login', {
        email,
        password,
      });
      return {
        success: true,
        data: response.data,
        user: {
          email,
          name: email.split('@')[0],
          id: response.data.userId,
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.message || 'Login failed',
      };
    }
  },

  // Get YouTube key for user
  async getYouTubeKey(userId) {
    try {
      const response = await api.get('/keys/youtube', {
        params: { userId },
      });
      return {
        success: true,
        youtubeKey: response.data.youtubeKey,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.message || 'Failed to fetch YouTube key',
      };
    }
  },

  // Save YouTube key for user
  async saveYouTubeKey(userId, youtubeKey) {
    try {
      const response = await api.post('/keys/youtube', {
        userId,
        youtubeKey,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.message || 'Failed to save YouTube key',
      };
    }
  },

  // Get Facebook key for user
  async getFacebookKey(userId) {
    try {
      const response = await api.get('/keys/facebook', {
        params: { userId },
      });
      return {
        success: true,
        facebookKey: response.data.facebookKey,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.message || 'Failed to fetch Facebook key',
      };
    }
  },

  // Save Facebook key for user
  async saveFacebookKey(userId, facebookKey) {
    try {
      const response = await api.post('/keys/facebook', {
        userId,
        facebookKey,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.message || 'Failed to save Facebook key',
      };
    }
  },

  // Get Twitch key for user
  async getTwitchKey(userId) {
    try {
      const response = await api.get('/keys/twitch', {
        params: { userId },
      });
      return {
        success: true,
        twitchKey: response.data.twitchKey,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.message || 'Failed to fetch Twitch key',
      };
    }
  },

  // Save Twitch key for user
  async saveTwitchKey(userId, twitchKey) {
    try {
      const response = await api.post('/keys/twitch', {
        userId,
        twitchKey,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.message || 'Failed to save Twitch key',
      };
    }
  },
};

export default authService;

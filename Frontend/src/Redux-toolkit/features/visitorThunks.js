import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;


export const trackPageVisit = createAsyncThunk(
  'visitors/trackPageVisit',
  async (_, { rejectWithValue }) => {
    try {
   
      const response = await axios.post(`${API_URL}/visitors/track`);
      return response.data;
    } catch (error) {
      console.error('Track visit error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to track visit');
    }
  }
);  

export const getVisitorStats = createAsyncThunk(
  'visitors/getVisitorStats',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('counselorToken');
      const response = await axios.get(`${API_URL}/visitors/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get stats');
    }
  }
);

export const getTodayVisitors = createAsyncThunk(
  'visitors/getTodayVisitors',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('counselorToken');
      const response = await axios.get(`${API_URL}/visitors/today`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get today visitors');
    }
  }
);

// Visitor Slice
const visitorSlice = createSlice({
  name: 'visitors',
  initialState: {
    totalAllTime: 0,
    todayUnique: 0,
    todayDevices: [],
    weeklyData: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Track Page Visit
      .addCase(trackPageVisit.pending, (state) => {
        state.loading = true;
      })
      .addCase(trackPageVisit.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(trackPageVisit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Visitor Stats
      .addCase(getVisitorStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(getVisitorStats.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.totalAllTime = action.payload.totalAllTime || 0;
          state.todayUnique = action.payload.todayUnique || 0;
          state.todayDevices = action.payload.todayDevices || [];
          state.weeklyData = action.payload.weeklyData || [];
        }
      })
      .addCase(getVisitorStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Today Visitors
      .addCase(getTodayVisitors.fulfilled, (state, action) => {
        if (action.payload) {
          state.todayUnique = action.payload.count || 0;
        }
      });
  }
});

export default visitorSlice.reducer;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

// Define video upload entry
interface VideoUploadEntry {
  id: string;
  space?:string;
  file:  string;
  tutorId: string;
  sessionId: string;
  message: string;
  progress: number;
  status: string;
  videoURL?:string;
  error?: string;
  moduleIndex:number |  null;
  lessonIndex:number |  null; 
}

interface UploadState {
  uploads: VideoUploadEntry[];
}

const initialState: UploadState = {
  uploads: [],
};

export const uploadSlice = createSlice({
  name: 'multiUpload',
  initialState,
  reducers: {
    // Add a single upload entry
    addVideoUpload: (state, action: PayloadAction<VideoUploadEntry>) => {
      if (!Array.isArray(state.uploads)) {
        state.uploads = [];
      }
      state.uploads.push(action.payload);
    },

    // Update progress for a specific upload
    updateUploadProgress: (state, action: PayloadAction<{
      id: string;
      progress: number;
      status?: string;
      message: string;
      videoURL:string;
      moduleIndex?:number;
      lessonIndex?:number;
    }>) => {
      const { id, progress, status, message, videoURL} = action.payload;
      const uploadIndex = state.uploads.findIndex(upload => upload.id === id);
      
      if (uploadIndex !== -1) {
        state.uploads[uploadIndex] = {
          ...state.uploads[uploadIndex],
          progress,
          status: status || (progress === 100 ? 'completed' : 'uploading'),
          message,
          videoURL,
          moduleIndex: action.payload.moduleIndex ?? null,
          lessonIndex: action.payload.lessonIndex ?? null,
        };
      }
    },

    // Remove a single upload by its ID
    removeVideoUpload: (state, action: PayloadAction<string>) => {
      state.uploads = state.uploads.filter(upload => upload.id !== action.payload);
    },

    // Clear all uploads
    resetAllUploads: (state) => {
      state.uploads = [];
    },
  }
});

export const { 
  addVideoUpload, 
  updateUploadProgress, 
  removeVideoUpload, 
  resetAllUploads,
} = uploadSlice.actions;

export default uploadSlice.reducer;
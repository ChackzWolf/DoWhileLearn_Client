
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import SocketService from '../services/socketService';

const socketSlice = createSlice({
    name: 'socket',
    initialState: { instance: null as SocketService | null },
    reducers: {
      setSocketService: (state, action: PayloadAction<SocketService | null>) => {
        state.instance = action.payload;
      },
    },
  });
  
  export const { setSocketService } = socketSlice.actions;
  export default socketSlice.reducer;
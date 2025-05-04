import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from '../../types/message';

interface ChatState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<Message[]>) => {
      const uniqueMessages = Array.from(
        new Map(action.payload.map((msg) => [msg.id, msg])).values()
      );
      state.messages = uniqueMessages;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      if (!state.messages.some((msg) => msg.id === action.payload.id)) {
        state.messages.push(action.payload);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { addMessage, setMessages, setLoading, setError } = chatSlice.actions;
export default chatSlice.reducer;
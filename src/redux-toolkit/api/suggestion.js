import { createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '@services/api/user/user.service';

const getUserSuggestions = createAsyncThunk('user/getSuggestions', async (name, { dispatch }) => {
  try {
    const response = await userService.getUserSuggestions();
    console.log(1111111, response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
})

export { getUserSuggestions };

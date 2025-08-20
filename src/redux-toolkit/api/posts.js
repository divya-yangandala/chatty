import { createAsyncThunk } from '@reduxjs/toolkit';
import { postService } from '@services/api/post/post.service';
import { Utils } from '@services/utils/utils.service';

// This will just be used for the first set of post where page is loaded first time

const getPosts = createAsyncThunk('post/getPosts', async (name, { dispatch }) => {
  try {
    const response = await postService.getAllPosts(1);
    return response.data;
  } catch (error) {
    Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
  }
});

export { getPosts };

import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  posts: [],
};

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    addPost: (state, action) => {
      state.posts.unshift(action.payload);
    },
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    likePost: (state, action) => {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) {
        post.likes += 1;
      }
    },
    addComment: (state, action) => {
      const { postId, comment } = action.payload;
      const post = state.posts.find(p => p.id === postId);
      if (post) {
        post.comments.push(comment);
        post.commentsCount += 1;
      }
    }
  },
});

export const { addPost, setPosts, likePost, addComment } = communitySlice.actions;
export default communitySlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const blogsSlice = createSlice({
  name: "blogsSlice",
  initialState: {},
  reducers: {
     addBlog: (state, action) => {
      return {
        ...state,
        blogs: [...state.blogs||[],action.payload]
      }
    },
    resetBlogs: () => {
      return {};
    },
  },
});
export const {
  resetBlogs,
  addBlog,
} = blogsSlice.actions;
export const { reducer } = blogsSlice;

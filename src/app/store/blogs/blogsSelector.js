import { createSelector } from '@reduxjs/toolkit';

export const selectBlogs = (state) => state.blogsSlice || {};
export const blogsSelector = () => createSelector(selectBlogs, (blogsState) => blogsState);

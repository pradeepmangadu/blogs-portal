import { combineReducers } from '@reduxjs/toolkit';
import { reducer as blogsSlice } from './blogs/blogsSlice';

export default function createReducer() {
    return combineReducers({
        blogsSlice: blogsSlice
    });
}

import {  put, takeLatest } from 'redux-saga/effects';
import {  resetBlogs } from './blogsSlice';

export function* executeBlogs(bundle) {
    yield put(resetBlogs(bundle));
}

export default function* BlogsSaga() {
    yield takeLatest(resetBlogs.type, executeBlogs);
}

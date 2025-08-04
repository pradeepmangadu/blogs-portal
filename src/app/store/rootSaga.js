import {  all } from 'redux-saga/effects';
import blogsSaga from './blogs/blogsSaga';

function* rootSaga() {
    yield all([blogsSaga()]);
}

export default rootSaga;
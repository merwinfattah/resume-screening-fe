import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {uploadReducer} from './reducers/uploadReducer';

const rootReducer = combineReducers({
  upload: uploadReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(
    {
      serializableCheck: false,
    }
  ),
});

export default store;
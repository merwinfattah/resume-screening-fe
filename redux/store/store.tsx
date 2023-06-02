import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {uploadReducer} from './reducers/uploadReducer';
import loginReducer from './reducers/loginReducer';
import authReducer from './reducers/authReducer';

const rootReducer = combineReducers({
  upload: uploadReducer,
  login: loginReducer,
  auth: authReducer,
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
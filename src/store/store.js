import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import characterReducer from './character/characterSlice';
import questReducer from './quest/questSlice';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web
import persistReducer from 'redux-persist/es/persistReducer';
import persistStore from 'redux-persist/es/persistStore';


const persistConfig = {
  key: 'root',
  storage,
  // whitelist: ['user'], 
};

const rootReducer = combineReducers({
  user: userReducer, // Add the user reducer here
  character: characterReducer,
  quests: questReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializability check for redux-persist
    }),
});

export const persistor = persistStore(store);
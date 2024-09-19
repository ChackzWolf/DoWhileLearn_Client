import {configureStore , combineReducers} from '@reduxjs/toolkit'
import userAuthReducer from '../authSlice/authSlice'
import registerData from '../registerData/registerData';
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import createCourseData from '../tutorSlice/CourseSlice/createCourseData';
import editCourseData from '../tutorSlice/CourseSlice/editCourseData';


const persistConfig = {
    key: "root",
    version: 1,
    storage,
    expire: 60 * 1000, // 1 minute
    // expire: 24 * 60 * 60 * 1000,
  }


const rootReducer = combineReducers({
    userAuth:userAuthReducer,
    registerData:registerData,
    createCourseData: createCourseData,
    editCourseData: editCourseData
})

const persistedReducer = persistReducer(persistConfig, rootReducer);



// Create the store with middleware for Redux Persist
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
  
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
export default store;



import {configureStore , combineReducers} from '@reduxjs/toolkit'
import userAuthReducer from '../userSlice/authSlice'
import registerData from '../registerData/registerData';
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

const persistConfig = {
    key: "root",
    version: 1,
    storage,
    expire: 60 * 1000, // 1 minute
    // expire: 24 * 60 * 60 * 1000,
  }


const rootReducer = combineReducers({
    userAuth:userAuthReducer,
    registerData:registerData
})

const PersistReducer = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof rootReducer>;


const appStore = configureStore({
    reducer: PersistReducer,
  });
  

export default appStore  



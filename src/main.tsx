// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './redux/store/store.ts'; 
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
      <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <GoogleOAuthProvider clientId="335970622446-fmad2vt6p80hhmjqgu8evh9tcs9letnl.apps.googleusercontent.com">
          <App />
    </GoogleOAuthProvider>
    </PersistGate>
    </Provider>

  // {/* </StrictMode> */}
)

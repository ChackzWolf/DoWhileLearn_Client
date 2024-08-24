import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import appStore from './redux/store/store.ts'; // Adjust the path to where your store is defined
import { persistor } from './redux/store/store.ts'; // Import the persistor

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider store={appStore}>
    <PersistGate loading={null} persistor={persistor}></PersistGate>
    <App />
    </Provider>
    </PersistGate>
  </StrictMode>,
)

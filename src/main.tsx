import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('New service worker activated. Refreshing page...');
    window.location.reload();
  });
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

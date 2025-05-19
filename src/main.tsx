import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { MicrobiologyReportProvider } from './contexts/MicrobiologyReportContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MicrobiologyReportProvider>
      <App />
    </MicrobiologyReportProvider>
  </StrictMode>
);
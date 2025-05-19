import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CreateReportPage from './pages/CreateReportPage';
import ReportHistoryPage from './pages/ReportHistoryPage';
import ViewReportPage from './pages/ViewReportPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create-report" element={<CreateReportPage />} />
            <Route path="/report-history" element={<ReportHistoryPage />} />
            <Route path="/report/:id" element={<ViewReportPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </AnimatePresence>
    </Router>
  );
}

export default App;
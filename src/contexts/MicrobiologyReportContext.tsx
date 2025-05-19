import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Report } from '../types';

interface MicrobiologyReportContextProps {
  reports: Report[];
  addReport: (report: Report) => void;
  getReportById: (id: string) => Report | undefined;
  deleteReport: (id: string) => void;
}

const MicrobiologyReportContext = createContext<MicrobiologyReportContextProps | undefined>(undefined);

export const useMicrobiologyReport = () => {
  const context = useContext(MicrobiologyReportContext);
  if (context === undefined) {
    throw new Error('useMicrobiologyReport must be used within a MicrobiologyReportProvider');
  }
  return context;
};

interface MicrobiologyReportProviderProps {
  children: ReactNode;
}

export const MicrobiologyReportProvider: React.FC<MicrobiologyReportProviderProps> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>(() => {
    const savedReports = localStorage.getItem('microbiologyReports');
    return savedReports ? JSON.parse(savedReports) : [];
  });

  useEffect(() => {
    localStorage.setItem('microbiologyReports', JSON.stringify(reports));
  }, [reports]);

  const addReport = (report: Report) => {
    setReports((prevReports) => [...prevReports, report]);
  };

  const getReportById = (id: string) => {
    return reports.find((report) => report.id === id);
  };

  const deleteReport = (id: string) => {
    setReports((prevReports) => prevReports.filter((report) => report.id !== id));
  };

  return (
    <MicrobiologyReportContext.Provider
      value={{
        reports,
        addReport,
        getReportById,
        deleteReport,
      }}
    >
      {children}
    </MicrobiologyReportContext.Provider>
  );
};
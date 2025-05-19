import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Microscope, FileText, History, Send, Beaker } from 'lucide-react';
import { useMicrobiologyReport } from '../contexts/MicrobiologyReportContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { reports } = useMicrobiologyReport();
  
  const draftReports = reports.filter(report => report.status === 'draft').length;
  const completedReports = reports.filter(report => report.status === 'completed').length;
  const sentReports = reports.filter(report => report.status === 'sent').length;

  const cards = [
    {
      title: 'Create New Report',
      description: 'Start a new microbiological analysis report',
      icon: <FileText className="h-10 w-10 text-primary-500" />,
      action: () => navigate('/create-report'),
      color: 'bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200'
    },
    {
      title: 'View Report History',
      description: 'Access previously created reports',
      icon: <History className="h-10 w-10 text-secondary-500" />,
      action: () => navigate('/report-history'),
      color: 'bg-gradient-to-br from-secondary-50 to-secondary-100 border-secondary-200'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Hero section */}
      <section className="bg-gradient-to-r from-primary-800 to-primary-900 text-white rounded-xl shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Microbiology Analysis Report System</h1>
            <p className="text-lg opacity-90 mb-6">
              Create professional microbiological analysis reports for your samples and share them with clients.
            </p>
            <button 
              onClick={() => navigate('/create-report')}
              className="bg-white text-primary-800 hover:bg-gray-100 transition-colors px-6 py-3 rounded-lg font-medium flex items-center"
            >
              <Beaker className="mr-2 h-5 w-5" />
              Create New Report
            </button>
          </div>
          <div className="flex-shrink-0">
            <Microscope className="h-32 w-32 md:h-44 md:w-44 text-primary-100 opacity-80" />
          </div>
        </div>
      </section>

      {/* Stats section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-primary-100 p-3 mr-4">
            <FileText className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <p className="text-gray-500 font-medium">Draft Reports</p>
            <p className="text-2xl font-bold">{draftReports}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-success-100 p-3 mr-4">
            <Beaker className="h-6 w-6 text-success-600" />
          </div>
          <div>
            <p className="text-gray-500 font-medium">Completed Reports</p>
            <p className="text-2xl font-bold">{completedReports}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-secondary-100 p-3 mr-4">
            <Send className="h-6 w-6 text-secondary-600" />
          </div>
          <div>
            <p className="text-gray-500 font-medium">Sent to Clients</p>
            <p className="text-2xl font-bold">{sentReports}</p>
          </div>
        </div>
      </section>

      {/* Quick access cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${card.color} border rounded-xl shadow-sm p-6 cursor-pointer transition-all`}
            onClick={card.action}
          >
            <div className="flex flex-col items-center text-center p-4">
              {card.icon}
              <h3 className="text-xl font-semibold mt-4 mb-2">{card.title}</h3>
              <p className="text-gray-600">{card.description}</p>
            </div>
          </motion.div>
        ))}
      </section>
    </motion.div>
  );
};

export default HomePage;
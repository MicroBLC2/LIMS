import React, { useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useReactToPdf } from 'react-to-pdf';
import { 
  Download, ArrowLeft, Printer, Send, Edit, Trash2, FileText, Calendar, User 
} from 'lucide-react';

import { useMicrobiologyReport } from '../contexts/MicrobiologyReportContext';

const ViewReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getReportById, deleteReport } = useMicrobiologyReport();
  const report = getReportById(id || '');
  const reportRef = useRef<HTMLDivElement>(null);
  
  const { toPDF, targetRef } = useReactToPdf({
    filename: `Microbiology-Report-${report?.sampleId}.pdf`,
    options: {
      orientation: 'portrait',
      format: 'a4',
    },
  });
  
  if (!report) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Report Not Found</h2>
        <p className="text-gray-600 mb-6">The report you are looking for does not exist or has been deleted.</p>
        <Link
          to="/report-history"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Reports
        </Link>
      </div>
    );
  }
  
  const handleDeleteReport = () => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      deleteReport(report.id);
      navigate('/report-history');
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'completed':
        return 'bg-primary-100 text-primary-800';
      case 'sent':
        return 'bg-success-100 text-success-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto"
    >
      {/* Report controls */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </button>
          
          <h1 className="text-xl font-bold text-gray-900">{report.title}</h1>
          
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => toPDF()}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-1" />
            Download PDF
          </button>
          
          <button
            onClick={() => window.print()}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Printer className="h-4 w-4 mr-1" />
            Print
          </button>
          
          {report.status !== 'sent' && (
            <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-success-600 hover:bg-success-700">
              <Send className="h-4 w-4 mr-1" />
              Send to Client
            </button>
          )}
          
          {report.status === 'draft' && (
            <Link
              to={`/edit-report/${report.id}`}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Link>
          )}
          
          <button
            onClick={handleDeleteReport}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:text-error-600 hover:border-error-300"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </button>
        </div>
      </div>
      
      {/* Printable report */}
      <div
        ref={targetRef}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8 print:shadow-none print:border-none"
      >
        {/* Report header */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Microscope className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">MicroLab Report</h1>
            </div>
            <h2 className="text-xl font-bold text-gray-800">{report.title}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                Report Information
              </h3>
              <div className="bg-gray-50 rounded-md p-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="text-sm text-gray-500">Report Date:</div>
                  <div className="text-sm font-medium">{report.date}</div>
                  
                  <div className="text-sm text-gray-500">Sample ID:</div>
                  <div className="text-sm font-medium">{report.sampleId}</div>
                  
                  <div className="text-sm text-gray-500">Sample Type:</div>
                  <div className="text-sm font-medium">{report.sampleType}</div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                <User className="h-4 w-4 mr-1" />
                Client Information
              </h3>
              <div className="bg-gray-50 rounded-md p-4">
                <div className="grid gap-y-1">
                  <div className="text-sm font-medium">{report.client.name}</div>
                  {report.client.institution && (
                    <div className="text-sm">{report.client.institution}</div>
                  )}
                  <div className="text-sm">{report.client.email}</div>
                  {report.client.phone && (
                    <div className="text-sm">{report.client.phone}</div>
                  )}
                  {report.client.address && (
                    <div className="text-sm">{report.client.address}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sample information */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Sample Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 mb-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <div className="text-sm text-gray-500">Collection Date</div>
                <div className="font-medium">{report.collectionDate}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <div className="text-sm text-gray-500">Analysis Date</div>
                <div className="font-medium">{report.analysisDate}</div>
              </div>
            </div>
          </div>
          
          {report.sampleDescription && (
            <div className="mt-4">
              <div className="text-sm text-gray-500 mb-1">Sample Description</div>
              <p className="text-gray-900">{report.sampleDescription}</p>
            </div>
          )}
        </div>
        
        {/* Microbiological results */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Microbiological Analysis Results
          </h3>
          
          {report.microorganisms.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Microorganism
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Count
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {report.microorganisms.map((microorganism, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {microorganism.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                        {microorganism.count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {microorganism.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 italic">No microorganisms recorded.</p>
          )}
          
          {report.additionalTests && report.additionalTests.length > 0 && (
            <div className="mt-8">
              <h4 className="text-md font-medium text-gray-900 mb-4">
                Additional Tests
              </h4>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Test
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Result
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Normal Range
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Interpretation
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {report.additionalTests.map((test, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {test.testName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {test.result}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {test.normalRange || '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {test.interpretation || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        
        {/* Conclusion and recommendations */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Conclusion and Recommendations
          </h3>
          
          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-1">Conclusion</div>
            <p className="text-gray-900 whitespace-pre-line">{report.conclusion}</p>
          </div>
          
          {report.recommendations && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Recommendations</div>
              <p className="text-gray-900 whitespace-pre-line">{report.recommendations}</p>
            </div>
          )}
        </div>
        
        {/* Authentication */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-4 md:mb-0">
              <div className="text-sm text-gray-500 mb-1">Analyzed by</div>
              <p className="font-medium">{report.analyst}</p>
            </div>
            
            {report.supervisor && (
              <div>
                <div className="text-sm text-gray-500 mb-1">Verified by</div>
                <p className="font-medium">{report.supervisor}</p>
              </div>
            )}
          </div>
          
          {report.notes && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-500 mb-1">Notes</div>
              <p className="text-gray-600 italic text-sm">{report.notes}</p>
            </div>
          )}
          
          <div className="mt-8 text-center text-xs text-gray-500">
            This report was generated by MicroLab Report System on {report.date}.
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ViewReportPage;
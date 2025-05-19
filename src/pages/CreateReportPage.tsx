import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'react-router-dom';
import { format } from 'date-fns';
import { Plus, Trash2, Save, Send, ChevronDown, ChevronUp, BadgeHelp as Help } from 'lucide-react';

import { useMicrobiologyReport } from '../contexts/MicrobiologyReportContext';
import { Report, SampleType, MicroorganismCount, TestResult, Client } from '../types';

const CreateReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { addReport } = useMicrobiologyReport();
  const [activeSection, setActiveSection] = useState<string>('sampleInfo');
  
  const [title, setTitle] = useState('');
  const [sampleId, setSampleId] = useState('');
  const [sampleType, setSampleType] = useState<SampleType>(SampleType.WATER);
  const [sampleDescription, setSampleDescription] = useState('');
  const [collectionDate, setCollectionDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [analysisDate, setAnalysisDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  const [client, setClient] = useState<Client>({
    name: '',
    email: '',
    institution: '',
    address: '',
    phone: ''
  });
  
  const [microorganisms, setMicroorganisms] = useState<MicroorganismCount[]>([
    { name: '', count: 0, unit: 'CFU/mL' }
  ]);
  
  const [additionalTests, setAdditionalTests] = useState<TestResult[]>([
    { testName: '', result: '', normalRange: '', interpretation: '' }
  ]);
  
  const [conclusion, setConclusion] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [analyst, setAnalyst] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [notes, setNotes] = useState('');
  
  const handleClientChange = (field: keyof Client, value: string) => {
    setClient(prev => ({ ...prev, [field]: value }));
  };
  
  const handleAddMicroorganism = () => {
    setMicroorganisms([...microorganisms, { name: '', count: 0, unit: 'CFU/mL' }]);
  };
  
  const handleMicroorganismChange = (index: number, field: keyof MicroorganismCount, value: any) => {
    const updatedMicroorganisms = [...microorganisms];
    updatedMicroorganisms[index] = { ...updatedMicroorganisms[index], [field]: value };
    setMicroorganisms(updatedMicroorganisms);
  };
  
  const handleRemoveMicroorganism = (index: number) => {
    setMicroorganisms(microorganisms.filter((_, i) => i !== index));
  };
  
  const handleAddTest = () => {
    setAdditionalTests([...additionalTests, { testName: '', result: '', normalRange: '', interpretation: '' }]);
  };
  
  const handleTestChange = (index: number, field: keyof TestResult, value: string) => {
    const updatedTests = [...additionalTests];
    updatedTests[index] = { ...updatedTests[index], [field]: value };
    setAdditionalTests(updatedTests);
  };
  
  const handleRemoveTest = (index: number) => {
    setAdditionalTests(additionalTests.filter((_, i) => i !== index));
  };
  
  const handleSaveReport = (status: 'draft' | 'completed' | 'sent') => {
    const newReport: Report = {
      id: uuidv4(),
      title,
      date: format(new Date(), 'yyyy-MM-dd'),
      client,
      sampleId,
      sampleType,
      sampleDescription,
      collectionDate,
      analysisDate,
      microorganisms: microorganisms.filter(m => m.name.trim() !== ''),
      additionalTests: additionalTests.filter(t => t.testName.trim() !== ''),
      conclusion,
      recommendations,
      analyst,
      supervisor,
      notes,
      status
    };
    
    addReport(newReport);
    navigate(`/report/${newReport.id}`);
  };
  
  const isFormValid = () => {
    return (
      title.trim() !== '' &&
      sampleId.trim() !== '' &&
      client.name.trim() !== '' &&
      client.email.trim() !== '' &&
      microorganisms.some(m => m.name.trim() !== '') &&
      conclusion.trim() !== '' &&
      analyst.trim() !== ''
    );
  };
  
  const Section: React.FC<{
    title: string;
    id: string;
    children: React.ReactNode;
  }> = ({ title, id, children }) => {
    const isActive = activeSection === id;
    
    return (
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <button
          className="w-full px-6 py-4 text-left font-medium flex justify-between items-center hover:bg-gray-50"
          onClick={() => setActiveSection(isActive ? '' : id)}
        >
          <span>{title}</span>
          {isActive ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
        
        {isActive && (
          <div className="px-6 py-4 border-t border-gray-200">
            {children}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Create New Microbiological Analysis Report</h1>
        <p className="text-gray-600">Fill in the analysis details and send to your client</p>
      </div>
      
      <div className="space-y-6">
        {/* Report Title */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Report Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            placeholder="E.g., Water Microbiological Analysis"
            required
          />
        </div>
        
        {/* Sample Information */}
        <Section title="Sample Information" id="sampleInfo">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sample ID
              </label>
              <input
                type="text"
                value={sampleId}
                onChange={(e) => setSampleId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="E.g., WS-2025-001"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sample Type
              </label>
              <select
                value={sampleType}
                onChange={(e) => setSampleType(e.target.value as SampleType)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {Object.values(SampleType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Collection Date
              </label>
              <input
                type="date"
                value={collectionDate}
                onChange={(e) => setCollectionDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Analysis Date
              </label>
              <input
                type="date"
                value={analysisDate}
                onChange={(e) => setAnalysisDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sample Description
            </label>
            <textarea
              value={sampleDescription}
              onChange={(e) => setSampleDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
              placeholder="Describe the sample (appearance, source, etc.)"
            />
          </div>
        </Section>
        
        {/* Client Information */}
        <Section title="Client Information" id="clientInfo">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name
              </label>
              <input
                type="text"
                value={client.name}
                onChange={(e) => handleClientChange('name', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Full name"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={client.email}
                onChange={(e) => handleClientChange('email', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="client@example.com"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institution
              </label>
              <input
                type="text"
                value={client.institution}
                onChange={(e) => handleClientChange('institution', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Company or institution name"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={client.phone}
                onChange={(e) => handleClientChange('phone', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Phone number"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              value={client.address}
              onChange={(e) => handleClientChange('address', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={2}
              placeholder="Full address"
            />
          </div>
        </Section>
        
        {/* Microbiological Analysis */}
        <Section title="Microbiological Analysis" id="microbiologicalAnalysis">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Microorganisms Detected
              </label>
              <button
                type="button"
                onClick={handleAddMicroorganism}
                className="inline-flex items-center p-1 text-sm font-medium text-primary-700 bg-primary-50 rounded-md hover:bg-primary-100"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Microorganism
              </button>
            </div>
            
            {microorganisms.map((microorganism, index) => (
              <div key={index} className="flex flex-wrap items-end gap-2 mb-3 pb-3 border-b border-gray-200">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs text-gray-500 mb-1">Microorganism</label>
                  <input
                    type="text"
                    value={microorganism.name}
                    onChange={(e) => handleMicroorganismChange(index, 'name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="E.g., E. coli"
                  />
                </div>
                
                <div className="w-20">
                  <label className="block text-xs text-gray-500 mb-1">Count</label>
                  <input
                    type="number"
                    value={microorganism.count}
                    onChange={(e) => handleMicroorganismChange(index, 'count', parseInt(e.target.value) || 0)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min="0"
                  />
                </div>
                
                <div className="w-28">
                  <label className="block text-xs text-gray-500 mb-1">Unit</label>
                  <select
                    value={microorganism.unit}
                    onChange={(e) => handleMicroorganismChange(index, 'unit', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="CFU/mL">CFU/mL</option>
                    <option value="CFU/g">CFU/g</option>
                    <option value="CFU/100mL">CFU/100mL</option>
                    <option value="MPN/100mL">MPN/100mL</option>
                  </select>
                </div>
                
                <button
                  type="button"
                  onClick={() => handleRemoveMicroorganism(index)}
                  className="p-2 text-gray-500 hover:text-error-500"
                  disabled={microorganisms.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Additional Tests
              </label>
              <button
                type="button"
                onClick={handleAddTest}
                className="inline-flex items-center p-1 text-sm font-medium text-primary-700 bg-primary-50 rounded-md hover:bg-primary-100"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Test
              </button>
            </div>
            
            {additionalTests.map((test, index) => (
              <div key={index} className="mb-3 pb-3 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Test Name</label>
                    <input
                      type="text"
                      value={test.testName}
                      onChange={(e) => handleTestChange(index, 'testName', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="E.g., pH"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Result</label>
                    <input
                      type="text"
                      value={test.result}
                      onChange={(e) => handleTestChange(index, 'result', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="E.g., 7.2"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Normal Range</label>
                    <input
                      type="text"
                      value={test.normalRange || ''}
                      onChange={(e) => handleTestChange(index, 'normalRange', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="E.g., 6.5 - 8.5"
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <div className="flex-grow">
                      <label className="block text-xs text-gray-500 mb-1">Interpretation</label>
                      <input
                        type="text"
                        value={test.interpretation || ''}
                        onChange={(e) => handleTestChange(index, 'interpretation', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="E.g., Within normal limits"
                      />
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => handleRemoveTest(index)}
                      className="ml-2 p-2 text-gray-500 hover:text-error-500"
                      disabled={additionalTests.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
        
        {/* Conclusions & Recommendations */}
        <Section title="Conclusions & Recommendations" id="conclusions">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Conclusion
            </label>
            <textarea
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={4}
              placeholder="Overall conclusion based on analysis results"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recommendations
            </label>
            <textarea
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
              placeholder="Recommended actions based on results"
            />
          </div>
        </Section>
        
        {/* Report Authentication */}
        <Section title="Report Authentication" id="authentication">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Analyst Name
              </label>
              <input
                type="text"
                value={analyst}
                onChange={(e) => setAnalyst(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Your name"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supervisor Name (Optional)
              </label>
              <input
                type="text"
                value={supervisor}
                onChange={(e) => setSupervisor(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Supervisor's name"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
              placeholder="Any additional notes or comments"
            />
          </div>
        </Section>
        
        {/* Actions Buttons */}
        <div className="flex flex-wrap gap-3 justify-end mt-8">
          <button
            type="button"
            onClick={() => handleSaveReport('draft')}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            Save as Draft
          </button>
          
          <button
            type="button"
            onClick={() => handleSaveReport('completed')}
            disabled={!isFormValid()}
            className={`px-4 py-2 rounded-md flex items-center ${
              isFormValid()
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Save className="h-4 w-4 mr-2" />
            Complete Report
          </button>
          
          <button
            type="button"
            onClick={() => handleSaveReport('sent')}
            disabled={!isFormValid()}
            className={`px-4 py-2 rounded-md flex items-center ${
              isFormValid()
                ? 'bg-success-600 text-white hover:bg-success-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send className="h-4 w-4 mr-2" />
            Complete & Send to Client
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateReportPage;
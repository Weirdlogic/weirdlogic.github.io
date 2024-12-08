// src/components/Dashboard/index.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tabs } from './Tabs';
import { SearchPanel } from './SearchPanel';
import { ResultsPanel } from './ResultsPanel';
import { BatchAnalysis } from './BatchAnalysis';
import { HistoryPanel } from './HistoryPanel';
import { AlertSystem } from './AlertSystem';
import { ComparisonView } from './ComparisonView';
import { ReportGenerator } from './ReportGenerator';
import { ExportTools } from './ExportTools';
import { RealtimeMonitor } from './RealtimeMonitor';
import { storage } from '../../utils/storage';
import { AnalyticsDashboard } from './Analytics/AnalyticsDashboard';
import { IPRelationshipGraph } from './Relationships/IPRelationshipGraph';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [searchHistory, setSearchHistory] = useState([]);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comparisonData, setComparisonData] = useState([]);
  const [monitoredIPs, setMonitoredIPs] = useState([]);

  useEffect(() => {
    // Initialize storage on mount
    storage.initializeStorage();
    
    // Load history from localStorage
    const savedHistory = JSON.parse(localStorage.getItem('ipHistory') || '[]');
    setSearchHistory(savedHistory);
    
    // Load monitored IPs from storage
    const data = storage.getData();
    const monitoredList = Object.keys(data.ipHistory || {})
      .filter(ip => data.ipHistory[ip].isMonitored);
    setMonitoredIPs(monitoredList);
  }, []);

  const analyzeSingleIP = async (ip) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/analysis/analyze/${ip}/`);
      const analysisData = response.data;
      setCurrentAnalysis(analysisData);
      
      // Track this search with enhanced data structure
      storage.addIPInvestigation(
        ip,
        'U199@cybers.eu', // We'll add real authentication later
        '', // Initial ticket number
        '', // Initial notes
        '', // Initial client
        []  // Initial behaviors
      );
      
      // Add to history with enhanced data
      addToHistory(analysisData);
      
      return analysisData;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addToHistory = (data) => {
    const newEntry = {
      ip: data.ip,
      timestamp: new Date().toISOString(),
      score: data.risk_score.combined,
      summary: data.summary.structured_summary,
      client: '', // Added for client tracking
      behaviors: [], // Added for behavior tracking
    };
    const updatedHistory = [newEntry, ...searchHistory].slice(0, 10);
    setSearchHistory(updatedHistory);
    localStorage.setItem('ipHistory', JSON.stringify(updatedHistory));
  };

  const handleExport = (format = 'pdf') => {
    if (!currentAnalysis) return;

    switch (format) {
      case 'pdf':
        ReportGenerator.generatePDF(currentAnalysis);
        break;
      case 'json':
        ExportTools.exportToJSON(currentAnalysis);
        break;
      case 'csv':
        ExportTools.exportToCSV(currentAnalysis);
        break;
      default:
        break;
    }
  };

  const handleCompare = async (ips) => {
    try {
      const results = await Promise.all(ips.map(ip => analyzeSingleIP(ip)));
      if (results[0] && results[1]) {
        setComparisonData(results);
        return results;
      }
    } catch (err) {
      setError('Error comparing IPs');
    }
    return null;
  };

  const toggleMonitorIP = (ip) => {
    setMonitoredIPs(prev => {
      const newMonitoredIPs = prev.includes(ip)
        ? prev.filter(item => item !== ip)
        : [...prev, ip];
      
      // Update monitoring status in storage
      const data = storage.getData();
      if (data.ipHistory[ip]) {
        data.ipHistory[ip].isMonitored = !prev.includes(ip);
        storage.saveData(data);
      }
      
      return newMonitoredIPs;
    });
  };

  const tabs = [
    { id: 'search', label: 'Single IP Analysis' },
    { id: 'batch', label: 'Batch Analysis' },
    { id: 'history', label: 'History' },
    { id: 'compare', label: 'Compare IPs' },
    { id: 'monitor', label: 'Real-time Monitor' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'relationships', label: 'IP Relationships' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">IP Analysis Dashboard</h1>
            {currentAnalysis && (
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentAnalysis.risk_score.combined >= 80 ? 'bg-red-100 text-red-800' :
                  currentAnalysis.risk_score.combined >= 50 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  Risk Score: {currentAnalysis.risk_score.combined}
                </span>
                <button
                  onClick={() => toggleMonitorIP(currentAnalysis.ip)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    monitoredIPs.includes(currentAnalysis.ip)
                      ? 'bg-red-500 text-white'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  {monitoredIPs.includes(currentAnalysis.ip) 
                    ? 'Stop Monitoring' 
                    : 'Monitor IP'}
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleExport('pdf')}
                    className="px-3 py-1 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
                  >
                    Export PDF
                  </button>
                  <button
                    onClick={() => handleExport('json')}
                    className="px-3 py-1 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
                  >
                    Export JSON
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        <div className="mt-8">
          {activeTab === 'search' && (
            <>
              <SearchPanel 
                onSearch={analyzeSingleIP} 
                loading={loading} 
              />
              {error && (
                <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
                  {error}
                </div>
              )}
              {currentAnalysis && (
                <ResultsPanel 
                  data={currentAnalysis} 
                  onExport={handleExport}
                />
              )}
            </>
          )}

          {activeTab === 'batch' && (
            <BatchAnalysis 
              onAnalyze={analyzeSingleIP}
              onAddToMonitor={toggleMonitorIP}
            />
          )}

          {activeTab === 'history' && (
            <HistoryPanel 
              history={searchHistory}
              onItemSelect={analyzeSingleIP}
              onAddToMonitor={toggleMonitorIP}
            />
          )}

          {activeTab === 'compare' && (
            <ComparisonView 
              data={comparisonData}
              onCompare={handleCompare}
              onExport={handleExport}
            />
          )}

          {activeTab === 'monitor' && (
            <RealtimeMonitor 
              ipsToMonitor={monitoredIPs}
              onRemoveIP={toggleMonitorIP}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsDashboard />
          )}

          {activeTab === 'relationships' && (
            <IPRelationshipGraph />
          )}
        </div>
      </main>

      <AlertSystem 
        riskScore={currentAnalysis?.risk_score}
        securityConcerns={currentAnalysis?.summary?.structured_summary?.concerns}
      />
    </div>
  );
};

export default Dashboard;
// src/components/Dashboard/RealtimeMonitor.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getBaseUrl } from '../../utils/config';

export const RealtimeMonitor = ({ ipsToMonitor }) => {
  const [monitoringData, setMonitoringData] = useState({});
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    let interval;
    if (isMonitoring && ipsToMonitor.length > 0) {
      interval = setInterval(async () => {
        const baseUrl = getBaseUrl();
        const newData = {};
        for (const ip of ipsToMonitor) {
          try {
            const response = await axios.get(`${baseUrl}/analyze/${ip}/`);
            newData[ip] = {
              timestamp: new Date(),
              data: response.data
            };
          } catch (error) {
            console.error(`Error monitoring ${ip}:`, error);
          }
        }
        setMonitoringData(prev => ({ ...prev, ...newData }));
      }, 300000);
    }
    return () => clearInterval(interval);
  }, [isMonitoring, ipsToMonitor]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Real-time Monitoring</h2>
        <button
          onClick={() => setIsMonitoring(!isMonitoring)}
          className={`px-4 py-2 rounded-lg ${
            isMonitoring ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          } text-white`}
        >
          {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
        </button>
      </div>

      <div className="space-y-4">
        {Object.entries(monitoringData).map(([ip, data]) => (
          <div key={ip} className="p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{ip}</h3>
                <p className="text-sm text-gray-500">
                  Last checked: {new Date(data.timestamp).toLocaleString()}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                data.data.risk_score.combined >= 80 ? 'bg-red-100 text-red-800' :
                data.data.risk_score.combined >= 50 ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                Risk Score: {data.data.risk_score.combined}
              </div>
            </div>
            {data.data.summary.structured_summary.concerns.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium">Active Concerns:</p>
                <ul className="mt-1 list-disc pl-5 text-sm text-gray-600">
                  {data.data.summary.structured_summary.concerns.map((concern, i) => (
                    <li key={i}>{concern}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
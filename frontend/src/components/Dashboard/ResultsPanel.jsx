// src/components/Dashboard/ResultsPanel.jsx
import React from 'react';
import { Card } from '../common/Card';
import { IPHistory } from './IPHistory';
import { IPTagging } from './IPTagging';
import { EmailAlerts } from './Alerts/EmailAlerts';
import { storage } from '../../utils/storage';

export const ResultsPanel = ({ data, onExport }) => {
  const handleTagAdded = () => {
    // Refresh the history display if needed
  };

  return (
    <div className="space-y-6 mt-4">
      {/* Previously investigated banner */}
      {storage.getData().ipHistory[data.ip]?.searchCount > 1 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                This IP has been previously investigated
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Analysis Results Card */}
      <Card>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Analysis Results</h2>
            <div className="flex space-x-2">
              <button
                onClick={onExport}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Export Results
              </button>
            </div>
          </div>

          {/* Risk Score Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {Object.entries(data.risk_score).map(([key, value]) => (
              <div key={key} className="p-4 border rounded-lg text-center">
                <div className="text-sm text-gray-500">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                <div className={`text-2xl font-bold ${
                  value >= 80 ? 'text-red-600' :
                  value >= 50 ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {value}%
                </div>
              </div>
            ))}
          </div>

          {/* Security Concerns */}
          {data.summary.structured_summary.concerns.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Security Concerns</h3>
              <ul className="list-disc pl-5 space-y-1">
                {data.summary.structured_summary.concerns.map((concern, index) => (
                  <li key={index} className="text-gray-700">{concern}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Location & Network Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Location Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Country:</span> {data.geolocation.country.name}</p>
                <p><span className="font-medium">City (ProxyCheck):</span> {data.geolocation.city.proxycheck}</p>
                <p><span className="font-medium">City (IPQS):</span> {data.geolocation.city.ipqs}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Network Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">ISP:</span> {data.network_info.isp.primary}</p>
                <p><span className="font-medium">VPN Provider:</span> {data.network_info.isp.vpn_provider}</p>
                <p><span className="font-medium">ASN:</span> {data.network_info.asn.number}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Investigation History */}
      <IPHistory ip={data.ip} />

      {/* Tagging System */}
      <IPTagging ip={data.ip} onTagAdded={handleTagAdded} />

      {/* Email Alerts */}
      <EmailAlerts ip={data.ip} />
    </div>
  );
};
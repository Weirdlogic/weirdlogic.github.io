// src/components/Dashboard/ComparisonView.jsx
import React, { useState } from 'react';
import { Card } from '../common/Card';

export const ComparisonView = ({ onCompare }) => {
  const [ips, setIps] = useState(['', '']);
  const [comparisonResults, setComparisonResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    if (!ips[0] || !ips[1]) {
      alert('Please enter two IP addresses to compare');
      return;
    }

    setLoading(true);
    try {
      const results = await onCompare(ips);
      setComparisonResults(results);
    } finally {
      setLoading(false);
    }
  };

  const renderScore = (score) => (
    <span className={`font-bold ${
      score >= 80 ? 'text-red-600' :
      score >= 50 ? 'text-yellow-600' :
      'text-green-600'
    }`}>
      {score}%
    </span>
  );

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Compare IP Addresses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[0, 1].map((index) => (
              <input
                key={index}
                type="text"
                value={ips[index]}
                onChange={(e) => {
                  const newIps = [...ips];
                  newIps[index] = e.target.value;
                  setIps(newIps);
                }}
                placeholder={`Enter IP address ${index + 1}`}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
          <button
            onClick={handleCompare}
            disabled={loading}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Comparing...' : 'Compare'}
          </button>
        </div>
      </Card>

      {/* Results Section */}
      {comparisonResults && (
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4">Comparison Results</h2>
            
            <div className="grid grid-cols-2 gap-8">
              {/* Risk Scores */}
              <div>
                <h3 className="font-medium mb-2">IP: {comparisonResults[0].ip}</h3>
                <div className="space-y-2">
                  <p>Risk Score: {renderScore(comparisonResults[0].risk_score.combined)}</p>
                  <p>AbuseIPDB: {renderScore(comparisonResults[0].risk_score.abuseipdb)}</p>
                  <p>ProxyCheck: {renderScore(comparisonResults[0].risk_score.proxycheck)}</p>
                  <p>IPQS: {renderScore(comparisonResults[0].risk_score.ipqs)}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">IP: {comparisonResults[1].ip}</h3>
                <div className="space-y-2">
                  <p>Risk Score: {renderScore(comparisonResults[1].risk_score.combined)}</p>
                  <p>AbuseIPDB: {renderScore(comparisonResults[1].risk_score.abuseipdb)}</p>
                  <p>ProxyCheck: {renderScore(comparisonResults[1].risk_score.proxycheck)}</p>
                  <p>IPQS: {renderScore(comparisonResults[1].risk_score.ipqs)}</p>
                </div>
              </div>

              {/* Security Concerns */}
              <div>
                <h3 className="font-medium mb-2">Security Concerns</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {comparisonResults[0].summary.structured_summary.concerns.map((concern, i) => (
                    <li key={i} className="text-sm text-red-600">{concern}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">Security Concerns</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {comparisonResults[1].summary.structured_summary.concerns.map((concern, i) => (
                    <li key={i} className="text-sm text-red-600">{concern}</li>
                  ))}
                </ul>
              </div>

              {/* Location Info */}
              <div>
                <h3 className="font-medium mb-2">Location</h3>
                <div className="space-y-1">
                  <p>Country: {comparisonResults[0].geolocation.country.name}</p>
                  <p>City: {comparisonResults[0].geolocation.city.proxycheck}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Location</h3>
                <div className="space-y-1">
                  <p>Country: {comparisonResults[1].geolocation.country.name}</p>
                  <p>City: {comparisonResults[1].geolocation.city.proxycheck}</p>
                </div>
              </div>

              {/* Network Info */}
              <div>
                <h3 className="font-medium mb-2">Network Information</h3>
                <div className="space-y-1">
                  <p>ISP: {comparisonResults[0].network_info.isp.primary}</p>
                  <p>VPN Provider: {comparisonResults[0].network_info.isp.vpn_provider}</p>
                  <p>ASN: {comparisonResults[0].network_info.asn.number}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Network Information</h3>
                <div className="space-y-1">
                  <p>ISP: {comparisonResults[1].network_info.isp.primary}</p>
                  <p>VPN Provider: {comparisonResults[1].network_info.isp.vpn_provider}</p>
                  <p>ASN: {comparisonResults[1].network_info.asn.number}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
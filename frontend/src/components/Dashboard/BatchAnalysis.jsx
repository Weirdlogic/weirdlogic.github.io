// src/components/Dashboard/BatchAnalysis.jsx
import React, { useState } from 'react';
import axios from 'axios';

export const BatchAnalysis = () => {
  const [ips, setIps] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ipList = ips.split('\n').map(ip => ip.trim()).filter(Boolean);
    setLoading(true);

    try {
      const analysisPromises = ipList.map(ip => 
        axios.get(`http://127.0.0.1:8000/analysis/analyze/${ip}/`)
      );
      
      const responses = await Promise.allSettled(analysisPromises);
      const processedResults = responses.map((result, index) => ({
        ip: ipList[index],
        status: result.status,
        data: result.status === 'fulfilled' ? result.value.data : null,
        error: result.status === 'rejected' ? result.reason.message : null
      }));

      setResults(processedResults);
    } catch (err) {
      console.error('Batch analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Batch IP Analysis</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={ips}
            onChange={(e) => setIps(e.target.value)}
            placeholder="Enter IP addresses (one per line)"
            className="w-full h-32 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Analyze All'}
          </button>
        </form>
      </div>

      {results.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Results</h3>
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="border-b pb-4">
                <h4 className="font-medium">{result.ip}</h4>
                {result.status === 'fulfilled' ? (
                  <div className="mt-2">
                    <p>Risk Score: {result.data.risk_score.combined}</p>
                    {result.data.summary.structured_summary.concerns.length > 0 && (
                      <ul className="mt-2 list-disc pl-5">
                        {result.data.summary.structured_summary.concerns.map((concern, i) => (
                          <li key={i} className="text-sm text-gray-600">{concern}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <p className="mt-2 text-red-600">Error: {result.error}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
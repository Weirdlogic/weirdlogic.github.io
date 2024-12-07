// src/components/Dashboard/HistoryPanel.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export const HistoryPanel = ({ history, onItemSelect }) => {
  const chartData = history.map(item => ({
    time: new Date(item.timestamp).toLocaleTimeString(),
    score: item.score
  })).reverse();

  return (
    <div className="space-y-6">
      {/* Trend Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Risk Score Trends</h2>
        <div className="h-64">
          <LineChart width={800} height={240} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="score" stroke="#3b82f6" name="Risk Score" />
          </LineChart>
        </div>
      </div>

      {/* History List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium">Recent Analyses</h3>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {history.map((item, index) => (
              <li key={index} className="px-4 py-4 hover:bg-gray-50 cursor-pointer" onClick={() => onItemSelect(item.ip)}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.ip}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item.score >= 80 ? 'bg-red-100 text-red-800' :
                    item.score >= 50 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    Score: {item.score}
                  </div>
                </div>
                {item.summary.concerns.length > 0 && (
                  <ul className="mt-2 list-disc pl-5 text-sm text-gray-600">
                    {item.summary.concerns.slice(0, 2).map((concern, i) => (
                      <li key={i}>{concern}</li>
                    ))}
                    {item.summary.concerns.length > 2 && (
                      <li>...</li>
                    )}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
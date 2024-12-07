// src/components/IPAnalysis/RiskScore.jsx
import React from 'react';
import { Card } from '../common/Card';

export const RiskScore = ({ scores }) => {
  const getRiskColor = (score) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">Risk Assessment</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(scores).map(([key, value]) => (
          <div key={key} className="text-center p-4 border rounded-lg">
            <div className="text-sm text-gray-500">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </div>
            <div className={`text-2xl font-bold ${getRiskColor(value)}`}>
              {value}%
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

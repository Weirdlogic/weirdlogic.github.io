// src/components/Dashboard/IPHistory.jsx
import React from 'react';
import { Card } from '../common/Card';
import { storage } from '../../utils/storage';


export const IPHistory = ({ ip }) => {
  const data = storage.getData();
  const ipData = data.ipHistory[ip];

  if (!ipData) return null;

  return (
    <Card className="mt-4">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Investigation History</h2>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            Searched {ipData.searchCount} times
          </span>
        </div>

        {ipData.investigations.length > 0 ? (
          <div className="space-y-4">
            {ipData.investigations.map((investigation, index) => (
              <div key={index} className="border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">
                      Ticket: {investigation.ticketNumber || 'No ticket'}
                    </p>
                    <p className="text-sm text-gray-500">
                      By {investigation.analyst} on {new Date(investigation.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                {investigation.notes && (
                  <p className="mt-2 text-gray-600">{investigation.notes}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No previous investigations recorded</p>
        )}
      </div>
    </Card>
  );
};
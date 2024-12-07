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

        {ipData.tags?.length > 0 ? (
          <div className="space-y-4">
            {ipData.tags.map((tag, index) => (
              <div key={index} className="border-b pb-4">
                {/* Ticket and Date Information */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">
                      Ticket: {tag.ticketNumber || 'No ticket'}
                    </p>
                    <p className="text-sm text-gray-500">
                      By {tag.createdBy} on {new Date(tag.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Risk Assessment Section */}
                {tag.analystRiskScore !== undefined && (
                  <div className="mt-3 bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Analyst Risk Assessment:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        tag.analystRiskScore >= 80 ? 'bg-red-100 text-red-800' :
                        tag.analystRiskScore >= 50 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        Score: {tag.analystRiskScore}
                      </span>
                    </div>
                    {tag.riskJustification && (
                      <p className="mt-2 text-sm text-gray-600">
                        Justification: {tag.riskJustification}
                      </p>
                    )}
                  </div>
                )}

                {/* Client Tag */}
                {tag.client && (
                  <div className="mt-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Client: {tag.client}
                    </span>
                  </div>
                )}

                {/* Behavior Tags */}
                {tag.behaviors && tag.behaviors.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tag.behaviors.map((behavior, i) => (
                      <span 
                        key={i}
                        className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                      >
                        {behavior}
                      </span>
                    ))}
                  </div>
                )}

                {/* Investigation Notes */}
                {tag.notes && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700">Notes:</p>
                    <p className="mt-1 text-gray-600">{tag.notes}</p>
                  </div>
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
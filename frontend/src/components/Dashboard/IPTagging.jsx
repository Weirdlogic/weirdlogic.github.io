// src/components/Dashboard/IPTagging.jsx
import React, { useState } from 'react';
import { Card } from '../common/Card';
import { storage } from '../../utils/storage';

export const IPTagging = ({ ip, onTagAdded }) => {
  const [ticketNumber, setTicketNumber] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    storage.tagIP(ip, ticketNumber, 'alpha@beta.com', notes);
    setTicketNumber('');
    setNotes('');
    if (onTagAdded) onTagAdded();
  };

  return (
    <Card className="mt-4">
      <div className="p-6">
        <h2 className="text-lg font-medium mb-4">Add Investigation Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ticket Number
              </label>
              <input
                type="text"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
                placeholder="SOCSI-123"
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Investigation Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your investigation notes..."
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save Investigation Details
            </button>
          </div>
        </form>
      </div>
    </Card>
  );
};
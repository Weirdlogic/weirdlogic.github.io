// src/components/Dashboard/Alerts/EmailAlerts.jsx
import React, { useState } from 'react';
import { Card } from '../../common/Card';

const saveEmailAlert = (ip, email, alertType) => {
  const data = storage.getData();
  if (!data.ipHistory[ip]) {
    data.ipHistory[ip] = {
      searchCount: 0,
      investigations: [],
      tags: [],
      alerts: []
    };
  }

  data.ipHistory[ip].alerts.push({
    email,
    type: alertType,
    status: 'active',
    createdAt: new Date().toISOString()
  });

  storage.saveData(data);
};

export const EmailAlerts = ({ ip }) => {
  const [email, setEmail] = useState('');
  const [alertType, setAlertType] = useState('new_search');

  const handleSubmit = (e) => {
    e.preventDefault();
    saveEmailAlert(ip, email, alertType);
    setEmail('');
  };

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-medium mb-4">Set Email Alerts</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Alert Type
            </label>
            <select
              value={alertType}
              onChange={(e) => setAlertType(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="new_search">New Search</option>
              <option value="new_tag">New Tag</option>
              <option value="new_investigation">New Investigation</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Set Alert
          </button>
        </form>
      </div>
    </Card>
  );
};
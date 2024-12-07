// src/components/Dashboard/Analytics/AnalyticsDashboard.jsx
import React from 'react';
import { Card } from '../../common/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { storage } from '../../../utils/storage';

export const AnalyticsDashboard = () => {
  const data = storage.getData();

  // Prepare data for charts
  const searchData = data.analytics.mostSearchedIPs.map(item => ({
    ip: item.ip,
    searches: item.searchCount
  }));

  // Get ticket relationship data
  const relationshipData = Object.entries(data.ticketRelationships).map(([ticket, info]) => ({
    ticket,
    ipCount: info.relatedIPs.length,
    lastUpdated: new Date(info.lastUpdated).toLocaleDateString()
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium">Total IPs Investigated</h3>
            <p className="text-3xl font-bold mt-2">
              {Object.keys(data.ipHistory).length}
            </p>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium">Active Tickets</h3>
            <p className="text-3xl font-bold mt-2">
              {Object.keys(data.ticketRelationships).length}
            </p>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium">Total Investigations</h3>
            <p className="text-3xl font-bold mt-2">
              {Object.values(data.ipHistory).reduce((acc, curr) => acc + curr.searchCount, 0)}
            </p>
          </div>
        </Card>
      </div>

      {/* Most Searched IPs Chart */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Most Investigated IPs</h3>
          <div className="h-64">
            <BarChart width={800} height={240} data={searchData}>
              <XAxis dataKey="ip" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="searches" fill="#3B82F6" name="Search Count" />
            </BarChart>
          </div>
        </div>
      </Card>

      {/* Recent Investigations */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Recent Investigations</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Searched</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Search Count</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latest Ticket</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(data.ipHistory)
                  .sort((a, b) => new Date(b[1].lastSearched) - new Date(a[1].lastSearched))
                  .slice(0, 10)
                  .map(([ip, info]) => (
                    <tr key={ip}>
                      <td className="px-6 py-4 whitespace-nowrap">{ip}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(info.lastSearched).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{info.searchCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {info.investigations[0]?.ticketNumber || 'N/A'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};
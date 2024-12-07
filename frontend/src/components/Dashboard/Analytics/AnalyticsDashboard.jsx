import React from 'react';
import { Card } from '../../common/Card';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { storage } from '../../../utils/storage';

const PrimaryStats = () => {
  const data = storage.getData();
  const ipHistory = data.ipHistory || {};
  
  // Calculate statistics
  const stats = {
    totalIPs: Object.keys(ipHistory).length,
    avgRiskScore: 0, // We'll add this when we have risk scores
    topClient: calculateTopClient(ipHistory),
    topBehavior: calculateTopBehavior(ipHistory)
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <h3 className="text-sm text-gray-500">total IPs</h3>
        <p className="text-2xl font-semibold">{stats.totalIPs}</p>
      </Card>
      <Card>
        <h3 className="text-sm text-gray-500">avg Risk Score</h3>
        <p className="text-2xl font-semibold">{stats.avgRiskScore}</p>
      </Card>
      <Card>
        <h3 className="text-sm text-gray-500">top Client</h3>
        <p className="text-2xl font-semibold">{stats.topClient || 'None'}</p>
      </Card>
      <Card>
        <h3 className="text-sm text-gray-500">top Behavior</h3>
        <p className="text-2xl font-semibold">{stats.topBehavior || 'None'}</p>
      </Card>
    </div>
  );
};

const ClientAnalysis = () => {
  const data = storage.getData();
  const clientData = processClientData(data.ipHistory || {});

  return (
    <Card className="mt-6">
      <h2 className="text-lg font-medium mb-4">Client Analysis</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={clientData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="client" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="attackCount" fill="#3b82f6" name="Attack Count" />
            <Bar dataKey="avgRiskScore" fill="#ef4444" name="Avg Risk Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

const BehaviorPatterns = () => {
  const data = storage.getData();
  const behaviorData = processBehaviorData(data.ipHistory || {});

  return (
    <Card className="mt-6">
      <h2 className="text-lg font-medium mb-4">Behavior Patterns</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={behaviorData}
                dataKey="count"
                nameKey="behavior"
                fill="#3b82f6"
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={behaviorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="behavior" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" name="Occurrences" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};

// Helper functions
const calculateTopClient = (ipHistory) => {
  const clientCount = {};
  Object.values(ipHistory).forEach(ip => {
    ip.tags?.forEach(tag => {
      if (tag.client) {
        clientCount[tag.client] = (clientCount[tag.client] || 0) + 1;
      }
    });
  });
  return Object.entries(clientCount)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';
};

const calculateTopBehavior = (ipHistory) => {
  const behaviorCount = {};
  Object.values(ipHistory).forEach(ip => {
    ip.tags?.forEach(tag => {
      tag.behaviors?.forEach(behavior => {
        behaviorCount[behavior] = (behaviorCount[behavior] || 0) + 1;
      });
    });
  });
  return Object.entries(behaviorCount)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';
};

const processClientData = (ipHistory) => {
  const clientStats = {};
  
  Object.values(ipHistory).forEach(ip => {
    ip.tags?.forEach(tag => {
      if (tag.client) {
        if (!clientStats[tag.client]) {
          clientStats[tag.client] = {
            attackCount: 0,
            avgRiskScore: 0
          };
        }
        clientStats[tag.client].attackCount++;
      }
    });
  });

  return Object.entries(clientStats).map(([client, stats]) => ({
    client,
    attackCount: stats.attackCount,
    avgRiskScore: stats.avgRiskScore || 0
  }));
};

const processBehaviorData = (ipHistory) => {
  const behaviorCount = {};
  
  Object.values(ipHistory).forEach(ip => {
    ip.tags?.forEach(tag => {
      tag.behaviors?.forEach(behavior => {
        behaviorCount[behavior] = (behaviorCount[behavior] || 0) + 1;
      });
    });
  });

  return Object.entries(behaviorCount).map(([behavior, count]) => ({
    behavior,
    count
  }));
};

export const AnalyticsDashboard = () => {
  return (
    <div className="space-y-6">
      <PrimaryStats />
      <ClientAnalysis />
      <BehaviorPatterns />
    </div>
  );
};
import React, { useState } from 'react';
import { Card } from '../../common/Card';
import { storage } from '../../../utils/storage';

export const IPRelationshipGraph = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [filters, setFilters] = useState({
    client: '',
    behavior: '',
    minRiskScore: 0,
    dateRange: 30
  });

  const data = storage.getData();
  const ipHistory = data.ipHistory || {};

  // Get unique clients and behaviors for filters
  const uniqueClients = new Set();
  const uniqueBehaviors = new Set();
  Object.values(ipHistory).forEach(ip => {
    ip.tags?.forEach(tag => {
      if (tag.client) uniqueClients.add(tag.client);
      tag.behaviors?.forEach(b => uniqueBehaviors.add(b));
    });
  });

  const processedData = processGraphData(ipHistory, filters);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Filters Panel */}
      <Card>
        <h2 className="text-lg font-medium mb-4">Filters</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Client</label>
            <select
              value={filters.client}
              onChange={(e) => setFilters({ ...filters, client: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="">All Clients</option>
              {Array.from(uniqueClients).map(client => (
                <option key={client} value={client}>{client}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Behavior Type</label>
            <select
              value={filters.behavior}
              onChange={(e) => setFilters({ ...filters, behavior: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="">All Behaviors</option>
              {Array.from(uniqueBehaviors).map(behavior => (
                <option key={behavior} value={behavior}>{behavior}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Min Risk Score: {filters.minRiskScore}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={filters.minRiskScore}
              onChange={(e) => setFilters({ ...filters, minRiskScore: Number(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Time Range (days)</label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: Number(e.target.value) })}
              className="w-full p-2 border rounded"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={365}>Last year</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Graph View */}
      <div className="col-span-2">
        <Card>
          <h2 className="text-lg font-medium mb-4">IP Relationships</h2>
          <div className="min-h-[600px] border rounded p-4">
            <div className="text-sm text-gray-500">
              {processedData.nodes.length === 0 ? (
                "No IPs match the current filters"
              ) : (
                <ul className="space-y-2">
                  {processedData.nodes.map(node => (
                    <li 
                      key={node.ip} 
                      className="p-2 border rounded hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedNode(node)}
                    >
                      {node.ip} - {node.clients.join(', ')}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Details Panel */}
      <Card>
        <h2 className="text-lg font-medium mb-4">Details</h2>
        {selectedNode ? (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">IP Information</h3>
              <p className="text-sm">{selectedNode.ip}</p>
            </div>

            <div>
              <h3 className="font-medium">Associated Clients</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedNode.clients.map(client => (
                  <span
                    key={client}
                    className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                  >
                    {client}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium">Behaviors</h3>
              <ul className="mt-1 space-y-1">
                {selectedNode.behaviors.map(behavior => (
                  <li key={behavior} className="text-sm">{behavior}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium">Recent Investigations</h3>
              <div className="mt-1 space-y-2">
                {selectedNode.investigations.map((inv, i) => (
                  <div key={i} className="text-sm border-l-2 border-blue-500 pl-2">
                    <p className="font-medium">{inv.ticketNumber}</p>
                    <p className="text-gray-500">{new Date(inv.createdAt).toLocaleDateString()}</p>
                    <p>{inv.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Select an IP to view details</p>
        )}
      </Card>
    </div>
  );
};

const processGraphData = (ipHistory, filters) => {
  const nodes = [];
  const edges = [];
  const now = new Date();
  const cutoffDate = new Date(now.setDate(now.getDate() - filters.dateRange));

  // Process nodes
  Object.entries(ipHistory).forEach(([ip, info]) => {
    const nodeClients = new Set();
    const nodeBehaviors = new Set();
    const investigations = [];

    // Process tags for clients and behaviors
    info.tags?.forEach(tag => {
      if (tag.client) nodeClients.add(tag.client);
      tag.behaviors?.forEach(b => nodeBehaviors.add(b));
      if (tag.ticketNumber || tag.notes) {
        investigations.push(tag);
      }
    });

    // Apply filters
    if (filters.client && !nodeClients.has(filters.client)) return;
    if (filters.behavior && !nodeBehaviors.has(filters.behavior)) return;
    if (new Date(info.lastSearched) < cutoffDate) return;

    nodes.push({
      ip,
      clients: Array.from(nodeClients),
      behaviors: Array.from(nodeBehaviors),
      investigations
    });
  });

  // Create edges between related nodes
  nodes.forEach((node1, i) => {
    nodes.slice(i + 1).forEach(node2 => {
      const sharedClients = node1.clients.filter(c => node2.clients.includes(c));
      const sharedBehaviors = node1.behaviors.filter(b => node2.behaviors.includes(b));
      
      if (sharedClients.length > 0 || sharedBehaviors.length > 0) {
        edges.push({
          source: node1.ip,
          target: node2.ip,
          sharedClients,
          sharedBehaviors
        });
      }
    });
  });

  return { nodes, edges };
};
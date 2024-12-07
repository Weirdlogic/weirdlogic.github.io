// src/components/Dashboard/Relationships/IPRelationshipGraph.jsx
import React from 'react';
import { Card } from '../../common/Card';
import { ForceGraph2D } from 'react-force-graph';
import { storage } from '../../../utils/storage';

export const IPRelationshipGraph = () => {
  const data = storage.getData();

  // Prepare data for the force graph
  const prepareGraphData = () => {
    const nodes = new Set();
    const links = [];

    // Add IPs and tickets as nodes
    Object.entries(data.ticketRelationships).forEach(([ticket, info]) => {
      nodes.add(ticket);
      info.relatedIPs.forEach(ip => {
        nodes.add(ip);
        links.push({
          source: ticket,
          target: ip,
          value: 1
        });
      });
    });

    return {
      nodes: Array.from(nodes).map(id => ({
        id,
        group: id.startsWith('SOCSI') ? 'ticket' : 'ip'
      })),
      links
    };
  };

  const graphData = prepareGraphData();

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-medium mb-4">IP Relationships</h3>
        <div className="h-[600px]">
          <ForceGraph2D
            graphData={graphData}
            nodeAutoColorBy="group"
            nodeLabel={node => node.id}
            linkDirectionalParticles={2}
            linkDirectionalParticleSpeed={d => d.value * 0.001}
            backgroundColor="#ffffff"
          />
        </div>
      </div>
    </Card>
  );
};
// src/utils/storage.js

const STORAGE_KEY = 'ip_analysis_data';

// Initialize storage with default structure
const initializeStorage = () => {
  const defaultStructure = {
    ipHistory: {},
    ticketRelationships: {},
    analytics: {
      mostSearchedIPs: [],
      recentInvestigations: []
    }
  };

  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStructure));
  }
};

// Get all data
const getData = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
};

// Save all data
const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Add a new IP investigation
const addIPInvestigation = (ip, analyst, ticketNumber = '', notes = '') => {
  const data = getData();
  
  if (!data.ipHistory[ip]) {
    data.ipHistory[ip] = {
      searchCount: 0,
      investigations: [],
      tags: [],
      alerts: []
    };
  }

  // Update search count and history
  data.ipHistory[ip].searchCount += 1;
  data.ipHistory[ip].lastSearched = new Date().toISOString();
  
  if (ticketNumber) {
    data.ipHistory[ip].investigations.unshift({
      timestamp: new Date().toISOString(),
      analyst,
      ticketNumber,
      notes
    });
  }

  // Update analytics
  updateAnalytics(data, ip);
  
  saveData(data);
  return data.ipHistory[ip];
};

// Add a tag to an IP
const tagIP = (ip, ticketNumber, analyst, notes = '') => {
  const data = getData();
  
  if (!data.ipHistory[ip]) {
    data.ipHistory[ip] = {
      searchCount: 0,
      investigations: [],
      tags: [],
      alerts: []
    };
  }

  data.ipHistory[ip].tags.unshift({
    ticketNumber,
    createdAt: new Date().toISOString(),
    createdBy: analyst,
    notes
  });

  saveData(data);
  return data.ipHistory[ip];
};

// Add/update ticket relationships
const updateTicketRelationships = (ticketNumber, ips, notes = '') => {
  const data = getData();
  
  data.ticketRelationships[ticketNumber] = {
    relatedIPs: ips,
    createdAt: data.ticketRelationships[ticketNumber]?.createdAt || new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    notes
  };

  saveData(data);
  return data.ticketRelationships[ticketNumber];
};

// Update analytics data
const updateAnalytics = (data, ip) => {
  // Update most searched IPs
  const searchedIPIndex = data.analytics.mostSearchedIPs.findIndex(item => item.ip === ip);
  if (searchedIPIndex >= 0) {
    data.analytics.mostSearchedIPs[searchedIPIndex].searchCount += 1;
  } else {
    data.analytics.mostSearchedIPs.push({
      ip,
      searchCount: 1
    });
  }

  // Sort by search count
  data.analytics.mostSearchedIPs.sort((a, b) => b.searchCount - a.searchCount);

  // Keep only top 10
  data.analytics.mostSearchedIPs = data.analytics.mostSearchedIPs.slice(0, 10);
};

export const storage = {
  initializeStorage,
  getData,
  addIPInvestigation,
  tagIP,
  updateTicketRelationships
};
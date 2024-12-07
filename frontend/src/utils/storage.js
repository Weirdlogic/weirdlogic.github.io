// src/utils/storage.js
const STORAGE_KEY = 'ip_analysis_data';

// Initialize storage with default structure
const initializeStorage = () => {
  const defaultStructure = {
    ipHistory: {},
    ticketRelationships: {},
    analytics: {
      mostSearchedIPs: [],
      recentInvestigations: [],
      clientStats: {},
      behaviorStats: {}
    }
  };

  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStructure));
  }
};

// Get all data
const getData = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
};

// Save all data
const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Add a new IP investigation
const addIPInvestigation = (ip, analyst, ticketNumber = '', notes = '', client = '', behaviors = []) => {
  const data = getData();
  
  if (!data.ipHistory) {
    data.ipHistory = {};
  }

  if (!data.ipHistory[ip]) {
    data.ipHistory[ip] = {
      searchCount: 0,
      investigations: [],
      tags: [],
      alerts: [],
      clients: [],
      behaviors: []
    };
  }

  // Update search count and history
  data.ipHistory[ip].searchCount += 1;
  data.ipHistory[ip].lastSearched = new Date().toISOString();
  
  if (ticketNumber || notes || client || behaviors.length > 0) {
    data.ipHistory[ip].investigations.unshift({
      timestamp: new Date().toISOString(),
      analyst,
      ticketNumber,
      notes,
      client,
      behaviors
    });
  }

  // Update client tracking
  if (client && !data.ipHistory[ip].clients.includes(client)) {
    data.ipHistory[ip].clients.push(client);
  }

  // Update behavior tracking
  behaviors.forEach(behavior => {
    if (!data.ipHistory[ip].behaviors.includes(behavior)) {
      data.ipHistory[ip].behaviors.push(behavior);
    }
  });

  saveData(data);
  return data.ipHistory[ip];
};

// Add a tag to an IP with risk assessment
const tagIP = (ip, ticketNumber, analyst, notes = '', client = '', behaviors = [], analystRiskScore = null, riskJustification = '') => {
  const data = getData();
  
  if (!data.ipHistory[ip]) {
    data.ipHistory[ip] = {
      searchCount: 0,
      investigations: [],
      tags: [],
      alerts: [],
      clients: [],
      behaviors: []
    };
  }

  // Add new tag with risk assessment
  data.ipHistory[ip].tags.unshift({
    ticketNumber,
    createdAt: new Date().toISOString(),
    createdBy: analyst,
    notes,
    client,
    behaviors,
    analystRiskScore: analystRiskScore !== null ? Number(analystRiskScore) : null,
    riskJustification
  });

  // Update client tracking
  if (client && !data.ipHistory[ip].clients.includes(client)) {
    data.ipHistory[ip].clients.push(client);
  }

  // Update behavior tracking
  behaviors.forEach(behavior => {
    if (!data.ipHistory[ip].behaviors.includes(behavior)) {
      data.ipHistory[ip].behaviors.push(behavior);
    }
  });

  // Update analytics
  if (analystRiskScore !== null) {
    if (!data.analytics.riskAssessments) {
      data.analytics.riskAssessments = {};
    }
    if (!data.analytics.riskAssessments[ip]) {
      data.analytics.riskAssessments[ip] = [];
    }
    data.analytics.riskAssessments[ip].unshift({
      score: Number(analystRiskScore),
      timestamp: new Date().toISOString(),
      analyst
    });
  }

  saveData(data);
  return data.ipHistory[ip];
};

// Get analytics for a specific client
const getClientAnalytics = (client) => {
  const data = getData();
  return data.analytics?.clientStats?.[client] || null;
};

// Get analytics for a specific behavior
const getBehaviorAnalytics = (behavior) => {
  const data = getData();
  return data.analytics?.behaviorStats?.[behavior] || null;
};

// Get all behaviors for an IP
const getIPBehaviors = (ip) => {
  const data = getData();
  return data.ipHistory?.[ip]?.behaviors || [];
};

// Get latest risk assessment for an IP
const getLatestRiskAssessment = (ip) => {
  const data = getData();
  const ipData = data.ipHistory?.[ip];
  if (!ipData?.tags) return null;

  const latestAssessment = ipData.tags
    .filter(tag => tag.analystRiskScore !== null)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

  return latestAssessment ? {
    score: latestAssessment.analystRiskScore,
    justification: latestAssessment.riskJustification,
    timestamp: latestAssessment.createdAt,
    analyst: latestAssessment.createdBy
  } : null;
};

// Get risk assessment history for an IP
const getRiskAssessmentHistory = (ip) => {
  const data = getData();
  return data.analytics?.riskAssessments?.[ip] || [];
};

export const storage = {
  initializeStorage,
  getData,
  saveData,
  addIPInvestigation,
  tagIP,
  getClientAnalytics,
  getBehaviorAnalytics,
  getIPBehaviors,
  getLatestRiskAssessment,
  getRiskAssessmentHistory
};
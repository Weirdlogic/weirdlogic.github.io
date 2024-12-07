const STORAGE_KEY = 'ip_analysis_data';

const initializeStorage = () => {
  const defaultStructure = {
    ipHistory: {},
    ticketRelationships: {},
    analytics: {
      mostSearchedIPs: [],
      recentInvestigations: [],
      clientStats: {},
      behaviorStats: {},
      riskTrends: {}, // Ensure riskTrends is initialized
    },
  };

  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStructure));
  }
};

const getData = () => {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return data || {}; // Ensure default structure if data is null
  } catch (e) {
    console.error('Error reading localStorage:', e);
    return {}; // Return an empty object if parsing fails
  }
};

const saveData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
};

const calculateTimeWeightedScore = (assessments) => {
  if (!assessments || assessments.length === 0) return 0;

  const now = new Date();
  let weightedTotal = 0;
  let weightSum = 0;

  assessments.forEach((assessment) => {
    if (assessment.calculatedScore == null) return; // Skip invalid scores

    const ageInDays = (now - new Date(assessment.timestamp)) / (1000 * 60 * 60 * 24);
    let timeWeight;

    if (ageInDays <= 1) timeWeight = 1.0; // Last 24 hours
    else if (ageInDays <= 7) timeWeight = 0.7; // Last week
    else if (ageInDays <= 30) timeWeight = 0.4; // Last month
    else timeWeight = 0.2; // Older

    weightedTotal += assessment.calculatedScore * timeWeight;
    weightSum += timeWeight;
  });

  return weightSum === 0 ? 0 : Math.round(weightedTotal / weightSum); // Prevent division by zero
};

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
      riskAssessments: [],
      lastSearched: new Date().toISOString(),
    };
  }

  data.ipHistory[ip].searchCount += 1;
  data.ipHistory[ip].lastSearched = new Date().toISOString();

  saveData(data);
  return data.ipHistory[ip];
};

const tagIP = (
  ip,
  ticketNumber,
  analyst,
  notes = '',
  client = '',
  behaviors = [],
  clientImpact = null,
  responseActions = [],
  infrastructureType = null,
  analystRiskScore = null,
  assessmentDetails = null
) => {
  const data = getData();

  if (!data.ipHistory) data.ipHistory = {};
  if (!data.analytics) {
    data.analytics = {
      mostSearchedIPs: [],
      recentInvestigations: [],
      clientStats: {},
      behaviorStats: {},
      riskTrends: {},
    };
  }

  if (!data.analytics.riskTrends) {
    data.analytics.riskTrends = {};
  }

  if (!data.ipHistory[ip]) {
    data.ipHistory[ip] = {
      searchCount: 0,
      investigations: [],
      tags: [],
      alerts: [],
      riskAssessments: [],
      lastSearched: new Date().toISOString(),
    };
  }

  const timestamp = new Date().toISOString();

  // Ensure `calculatedScore` is computed
  const calculatedScore =
    analystRiskScore ??
    calculateTimeWeightedScore(data.ipHistory[ip].riskAssessments);

  const newAssessment = {
    timestamp,
    analyst,
    ticketNumber,
    client,
    behaviors,
    clientImpact,
    responseActions,
    infrastructureType,
    calculatedScore,
    details: assessmentDetails,
  };

  data.ipHistory[ip].riskAssessments.unshift(newAssessment);

  const newTag = {
    ticketNumber,
    createdAt: timestamp,
    createdBy: analyst,
    notes,
    client,
    behaviors,
    clientImpact,
    responseActions,
    infrastructureType,
    assessment: newAssessment,
  };

  data.ipHistory[ip].tags.unshift(newTag);

  if (!data.analytics.riskTrends[ip]) {
    data.analytics.riskTrends[ip] = [];
  }
  data.analytics.riskTrends[ip].push({
    timestamp,
    score: calculatedScore,
    details: assessmentDetails,
  });

  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  data.analytics.riskTrends[ip] = data.analytics.riskTrends[ip].filter(
    (trend) => new Date(trend.timestamp) > ninetyDaysAgo
  );

  data.ipHistory[ip].currentRiskScore = calculateTimeWeightedScore(
    data.ipHistory[ip].riskAssessments
  );

  behaviors.forEach((behavior) => {
    if (!data.analytics.behaviorStats[behavior]) {
      data.analytics.behaviorStats[behavior] = {
        occurrences: 0,
        lastSeen: null,
        byClient: {},
      };
    }
    data.analytics.behaviorStats[behavior].occurrences += 1;
    data.analytics.behaviorStats[behavior].lastSeen = timestamp;

    if (client) {
      if (!data.analytics.behaviorStats[behavior].byClient[client]) {
        data.analytics.behaviorStats[behavior].byClient[client] = 0;
      }
      data.analytics.behaviorStats[behavior].byClient[client] += 1;
    }
  });

  if (client && clientImpact) {
    if (!data.analytics.clientStats[client]) {
      data.analytics.clientStats[client] = {
        totalAssessments: 0,
        impactLevels: {},
        commonBehaviors: {},
      };
    }
    data.analytics.clientStats[client].totalAssessments += 1;
    data.analytics.clientStats[client].impactLevels[clientImpact] =
      (data.analytics.clientStats[client].impactLevels[clientImpact] || 0) + 1;
  }

  saveData(data);
  return data.ipHistory[ip];
};

const getRiskTrend = (ip, days = 90) => {
  const data = getData();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  return (
    data.analytics?.riskTrends?.[ip]?.filter(
      (trend) => new Date(trend.timestamp) > cutoff
    ) || []
  );
};

const getIPAnalytics = (ip) => {
  const data = getData();
  const ipData = data.ipHistory[ip];

  if (!ipData) return null;

  return {
    currentRiskScore: ipData.currentRiskScore || 0,
    assessmentCount: ipData.riskAssessments?.length || 0,
    lastAssessment: ipData.riskAssessments?.[0] || null,
    riskTrend: getRiskTrend(ip),
    behaviorHistory: ipData.tags.map((tag) => ({
      timestamp: tag.createdAt,
      behaviors: tag.behaviors,
      impact: tag.clientImpact,
    })),
  };
};

export const storage = {
  initializeStorage,
  getData,
  saveData,
  addIPInvestigation,
  tagIP,
  getRiskTrend,
  getIPAnalytics,
};

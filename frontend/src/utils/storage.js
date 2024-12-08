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
      riskTrends: {},
    },
  };

  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStructure));
  }
};

const getData = () => {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return data || {};
  } catch (e) {
    console.error('Error reading localStorage:', e);
    return {};
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
    // Get score from either the root or responseActions
    const score = assessment.responseActions?.calculatedScore || assessment.calculatedScore || 0;

    const ageInDays = (now - new Date(assessment.timestamp)) / (1000 * 60 * 60 * 24);
    let timeWeight;

    if (ageInDays <= 1) timeWeight = 1.0;
    else if (ageInDays <= 7) timeWeight = 0.7;
    else if (ageInDays <= 30) timeWeight = 0.4;
    else timeWeight = 0.2;

    weightedTotal += score * timeWeight;
    weightSum += timeWeight;
  });

  return weightSum === 0 ? 0 : Math.round(weightedTotal / weightSum);
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
      currentRiskScore: 0
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
  calculatedScore = null,
  assessmentDetails = null
) => {
  const data = getData();

  // Initialize data structures
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

  if (!data.ipHistory[ip]) {
    data.ipHistory[ip] = {
      searchCount: 0,
      investigations: [],
      tags: [],
      alerts: [],
      riskAssessments: [],
      lastSearched: new Date().toISOString(),
      currentRiskScore: 0
    };
  }

  const timestamp = new Date().toISOString();
  const finalScore = Number(calculatedScore) || 0;

  // Create new assessment
  const newAssessment = {
    timestamp,
    analyst,
    ticketNumber,
    client,
    behaviors,
    clientImpact,
    responseActions,
    infrastructureType,
    calculatedScore: finalScore,
    details: assessmentDetails
  };

  // Add to risk assessments
  data.ipHistory[ip].riskAssessments.unshift(newAssessment);

  // Calculate new weighted average score
  const weightedScore = calculateTimeWeightedScore([
    newAssessment,
    ...data.ipHistory[ip].riskAssessments.slice(1)
  ]);

  // Create new tag
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
    calculatedScore: finalScore,
    weightedScore,
    assessment: newAssessment
  };

  // Update storage with both scores
  data.ipHistory[ip].tags.unshift(newTag);
  data.ipHistory[ip].currentRiskScore = weightedScore;
  data.ipHistory[ip].latestScore = finalScore;

  // Update risk trends
  if (!data.analytics.riskTrends[ip]) {
    data.analytics.riskTrends[ip] = [];
  }

  data.analytics.riskTrends[ip].push({
    timestamp,
    rawScore: finalScore,
    weightedScore,
    behaviors,
    clientImpact,
    details: {
      ...assessmentDetails,
      calculatedScore: finalScore,
      weightedScore
    }
  });

  // Maintain 90-day window for trends
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  data.analytics.riskTrends[ip] = data.analytics.riskTrends[ip].filter(
    (trend) => new Date(trend.timestamp) > ninetyDaysAgo
  );

  // Update behavior and client statistics...
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
    latestScore: ipData.latestScore || 0,
    assessmentCount: ipData.riskAssessments?.length || 0,
    lastAssessment: ipData.riskAssessments?.[0] || null,
    riskTrend: getRiskTrend(ip),
    behaviorHistory: ipData.tags.map((tag) => ({
      timestamp: tag.createdAt,
      behaviors: tag.behaviors,
      impact: tag.clientImpact,
      rawScore: tag.calculatedScore,
      weightedScore: tag.weightedScore
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
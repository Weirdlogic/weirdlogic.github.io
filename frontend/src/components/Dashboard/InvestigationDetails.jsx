import React, { useState } from 'react';
import { Tag, X } from 'lucide-react';

const CLIENT_TAGS = ['HANZA', 'LHV', 'ERGO', 'LUMINOR'];

const CLIENT_IMPACT = {
  'Critical': { weight: 1.5, class: 'bg-red-100 text-red-800' },
  'High Value': { weight: 1.3, class: 'bg-orange-100 text-orange-800' },
  'Standard': { weight: 1.0, class: 'bg-blue-100 text-blue-800' },
  'Non-Client': { weight: 0.8, class: 'bg-gray-100 text-gray-800' }
};

const RESPONSE_ACTIONS = [
  { id: 'Blocked_at_Firewall', label: 'Blocked at Firewall', weight: -20 },
  { id: 'WAF_Rules_Added', label: 'WAF Rules Added', weight: -15 },
  { id: 'Under_Active_Monitoring', label: 'Under Active Monitoring', weight: -10 },
  { id: 'Client_Notified', label: 'Client Notified', weight: -5 }
];

const INFRASTRUCTURE_TYPES = [
  { id: 'Known_Good_Service', label: 'Known Good Service', modifier: -0.5 },
  { id: 'CDN_Cloud_Provider', label: 'CDN/Cloud Provider', modifier: -0.3 },
  { id: 'VPN_Proxy', label: 'VPN/Proxy', modifier: 0.2 },
  { id: 'Tor_Exit_Node', label: 'Tor Exit Node', modifier: 0.3 }
];

const BEHAVIOR_TAGS = {
  'Authentication': {
    base: 30,
    behaviors: [
      { id: 'Failed_Login_Attempts', label: 'Failed Login Attempts', weight: 10 },
      { id: 'Password_Spraying', label: 'Password Spraying', weight: 20 },
      { id: 'Credential_Stuffing', label: 'Credential Stuffing', weight: 25 },
      { id: 'MFA_Bypass_Attempt', label: 'MFA Bypass Attempt', weight: 30 }
    ]
  },
  'Scanning/Recon': {
    base: 25,
    behaviors: [
      { id: 'Port_Scan', label: 'Port Scan', weight: 25 },
      { id: 'Directory_Enumeration', label: 'Directory Enumeration', weight: 20 },
      { id: 'Vulnerability_Scan', label: 'Vulnerability Scan', weight: 25 },
      { id: 'API_Enumeration', label: 'API Enumeration', weight: 20 }
    ]
  },
  'Data Access': {
    base: 35,
    behaviors: [
      { id: 'Data_Exfiltration', label: 'Data Exfiltration', weight: 35 },
      { id: 'Unauthorized_Access', label: 'Unauthorized Access', weight: 25 },
      { id: 'File_Download', label: 'File Download', weight: 20 },
      { id: 'Sensitive_Data_Access', label: 'Sensitive Data Access', weight: 30 }
    ]
  },
  'Application Attacks': {
    base: 40,
    behaviors: [
      { id: 'SQL_Injection', label: 'SQL Injection', weight: 40 },
      { id: 'XSS_Attempt', label: 'XSS Attempt', weight: 30 },
      { id: 'File_Upload', label: 'File Upload', weight: 25 },
      { id: 'Command_Injection', label: 'Command Injection', weight: 45 }
    ]
  },
  'Network Behavior': {
    base: 35,
    behaviors: [
      { id: 'C2_Communication', label: 'C2 Communication', weight: 45 },
      { id: 'Abnormal_Traffic', label: 'Abnormal Traffic', weight: 25 },
      { id: 'DDoS_Attempt', label: 'DDoS Attempt', weight: 40 },
      { id: 'Proxy_Usage', label: 'Proxy Usage', weight: 20 }
    ]
  },
  'Email/Phishing': {
    base: 30,
    behaviors: [
      { id: 'Phishing_Source', label: 'Phishing Source', weight: 35 },
      { id: 'Spam_Source', label: 'Spam Source', weight: 25 },
      { id: 'Email_Harvesting', label: 'Email Harvesting', weight: 20 }
    ]
  },
  'Malware Related': {
    base: 45,
    behaviors: [
      { id: 'Malware_Download', label: 'Malware Download', weight: 40 },
      { id: 'Ransomware_Activity', label: 'Ransomware Activity', weight: 45 },
      { id: 'Botnet_Activity', label: 'Botnet Activity', weight: 35 },
      { id: 'Cryptomining', label: 'Cryptomining', weight: 25 }
    ]
  },
  'Suspicious Activity': {
    base: 20,
    behaviors: [
      { id: 'Unusual_Hours', label: 'Unusual Hours', weight: 15 },
      { id: 'Geographic_Anomaly', label: 'Geographic Anomaly', weight: 20 },
      { id: 'High_Volume_Requests', label: 'High Volume Requests', weight: 25 },
      { id: 'Rate_Limiting_Bypass', label: 'Rate Limiting Bypass', weight: 30 }
    ]
  }
};

export default function InvestigationDetails({ ip, onSave }) {
  const [ticketNumber, setTicketNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedBehaviors, setSelectedBehaviors] = useState([]);
  const [selectedImpact, setSelectedImpact] = useState('Standard');
  const [selectedResponses, setSelectedResponses] = useState([]);
  const [selectedInfraType, setSelectedInfraType] = useState('');
  const [customBehavior, setCustomBehavior] = useState('');

  const calculateRiskScore = () => {
    console.log('Selected Behaviors:', selectedBehaviors);
    console.log('Selected Impact:', selectedImpact);
    console.log('Response Actions:', selectedResponses);
    console.log('Infrastructure Type:', selectedInfraType);
    let baseScore = 0;

    // Calculate behavior scores
    selectedBehaviors.forEach((behaviorId) => {
      for (const category of Object.values(BEHAVIOR_TAGS)) {
        const behavior = category.behaviors.find(b => b.id === behaviorId);
        if (behavior) {
          baseScore += behavior.weight;
          break;
        }
      }
    });

    // Apply infrastructure type modifier
    const infraType = INFRASTRUCTURE_TYPES.find(type => type.id === selectedInfraType);
    if (infraType) {
      baseScore = baseScore * (1 + infraType.modifier);
    }

    // Apply client impact multiplier
    const impactMultiplier = CLIENT_IMPACT[selectedImpact]?.weight || 1.0;
    baseScore = baseScore * impactMultiplier;

    // Apply response action reductions
    selectedResponses.forEach((responseId) => {
      const response = RESPONSE_ACTIONS.find(action => action.id === responseId);
      if (response) {
        baseScore += response.weight;
      }
    });

    // Ensure score stays between 0 and 100
    return Math.max(0, Math.min(100, Math.round(baseScore)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const riskScore = calculateRiskScore();
    onSave({
      ip,
      ticketNumber,
      notes,
      client: selectedClient,
      behaviors: selectedBehaviors,
      clientImpact: selectedImpact,
      responseActions: selectedResponses,
      infrastructureType: selectedInfraType,
      analystRiskScore: riskScore,
      assessmentDetails: {
        selectedBehaviors,
        selectedImpact,
        selectedResponses,
        selectedInfraType,
        calculatedScore: riskScore,
        timestamp: new Date().toISOString()
      }
    });
    
    // Reset form
    setTicketNumber('');
    setNotes('');
    setSelectedClient('');
    setSelectedBehaviors([]);
    setSelectedImpact('Standard');
    setSelectedResponses([]);
    setSelectedInfraType('');
  };

  const addCustomBehavior = () => {
    if (customBehavior && !selectedBehaviors.includes(customBehavior)) {
      setSelectedBehaviors([...selectedBehaviors, customBehavior]);
      setCustomBehavior('');
    }
  };

  const removeBehavior = (behavior) => {
    setSelectedBehaviors(selectedBehaviors.filter(b => b !== behavior));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Add Investigation Details</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ticket Number
          </label>
          <input
            type="text"
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
            placeholder="SOCSI-123"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Client
          </label>
          <div className="flex flex-wrap gap-2">
            {CLIENT_TAGS.map(client => (
              <button
                key={client}
                type="button"
                onClick={() => setSelectedClient(client)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                  ${selectedClient === client 
                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-500' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                {client}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Client Impact Level
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(CLIENT_IMPACT).map(([level, config]) => (
              <button
                key={level}
                type="button"
                onClick={() => setSelectedImpact(level)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                  ${selectedImpact === level 
                    ? `${config.class} border-2` 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Infrastructure Type
          </label>
          <div className="flex flex-wrap gap-2">
            {INFRASTRUCTURE_TYPES.map(type => (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedInfraType(type.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                  ${selectedInfraType === type.id
                    ? 'bg-purple-100 text-purple-800 border-2 border-purple-500'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Behaviors
          </label>
          {Object.entries(BEHAVIOR_TAGS).map(([category, { behaviors }]) => (
            <div key={category} className="mb-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {behaviors.map(behavior => (
                  <button
                    key={behavior.id}
                    type="button"
                    onClick={() => {
                      if (!selectedBehaviors.includes(behavior.id)) {
                        setSelectedBehaviors([...selectedBehaviors, behavior.id]);
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                      ${selectedBehaviors.includes(behavior.id)
                        ? 'bg-green-100 text-green-800 border-2 border-green-500'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                  >
                    {behavior.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Response Actions
          </label>
          <div className="flex flex-wrap gap-2">
            {RESPONSE_ACTIONS.map(action => (
              <button
                key={action.id}
                type="button"
                onClick={() => {
                  setSelectedResponses(prev => 
                    prev.includes(action.id)
                      ? prev.filter(a => a !== action.id)
                      : [...prev, action.id]
                  );
                }}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                  ${selectedResponses.includes(action.id)
                    ? 'bg-green-100 text-green-800 border-2 border-green-500'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              Calculated Risk Score
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              calculateRiskScore() >= 80 ? 'bg-red-100 text-red-800' :
              calculateRiskScore() >= 50 ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {calculateRiskScore()}%
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Investigation Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Add your investigation notes..."
          />
        </div>

        {/* Selected Behaviors Display */}
        {selectedBehaviors.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Selected Behaviors:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedBehaviors.map(behaviorId => {
                // Find behavior label
                let behaviorLabel = behaviorId;
                for (const category of Object.values(BEHAVIOR_TAGS)) {
                  const behavior = category.behaviors.find(b => b.id === behaviorId);
                  if (behavior) {
                    behaviorLabel = behavior.label;
                    break;
                  }
                }
                return (
                  <span
                    key={behaviorId}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {behaviorLabel}
                    <button
                      type="button"
                      onClick={() => removeBehavior(behaviorId)}
                      className="hover:text-blue-600"
                    >
                      <X size={14} />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          Save Investigation Details
        </button>
      </form>
    </div>
  );
}
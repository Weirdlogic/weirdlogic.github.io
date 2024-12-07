import React, { useState } from 'react';
import { Tag, X } from 'lucide-react';

const CLIENT_TAGS = ['HANZA', 'LHV', 'ERGO', 'LUMINOR'];

const BEHAVIOR_TAGS = {
  'Authentication': [
    'Failed_Login_Attempts',
    'Password_Spraying',
    'Credential_Stuffing',
    'MFA_Bypass_Attempt'
  ],
  'Scanning/Recon': [
    'Port_Scan',
    'Directory_Enumeration',
    'Vulnerability_Scan',
    'API_Enumeration'
  ],
  'Data Access': [
    'Data_Exfiltration',
    'Unauthorized_Access',
    'File_Download',
    'Sensitive_Data_Access'
  ],
  'Application Attacks': [
    'SQL_Injection',
    'XSS_Attempt',
    'File_Upload',
    'Command_Injection'
  ],
  'Network Behavior': [
    'C2_Communication',
    'Abnormal_Traffic',
    'DDoS_Attempt',
    'Proxy_Usage'
  ],
  'Email/Phishing': [
    'Phishing_Source',
    'Spam_Source',
    'Email_Harvesting'
  ],
  'Malware Related': [
    'Malware_Download',
    'Ransomware_Activity',
    'Botnet_Activity',
    'Cryptomining'
  ],
  'Suspicious Activity': [
    'Unusual_Hours',
    'Geographic_Anomaly',
    'High_Volume_Requests',
    'Rate_Limiting_Bypass'
  ]
};

export default function InvestigationDetails({ ip, onSave }) {
  const [ticketNumber, setTicketNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedBehaviors, setSelectedBehaviors] = useState([]);
  const [customBehavior, setCustomBehavior] = useState('');
  const [analystRiskScore, setAnalystRiskScore] = useState(0);
  const [riskJustification, setRiskJustification] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ip,
      ticketNumber,
      notes,
      client: selectedClient,
      behaviors: selectedBehaviors,
      analystRiskScore,
      riskJustification
    });
    
    // Reset form
    setTicketNumber('');
    setNotes('');
    setSelectedClient('');
    setSelectedBehaviors([]);
    setAnalystRiskScore(0);
    setRiskJustification('');
  };

  const addBehaviorTag = (behavior) => {
    if (!selectedBehaviors.includes(behavior)) {
      setSelectedBehaviors([...selectedBehaviors, behavior]);
    }
  };

  const removeBehaviorTag = (behavior) => {
    setSelectedBehaviors(selectedBehaviors.filter(b => b !== behavior));
  };

  const addCustomBehavior = () => {
    if (customBehavior && !selectedBehaviors.includes(customBehavior)) {
      setSelectedBehaviors([...selectedBehaviors, customBehavior]);
      setCustomBehavior('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Add Investigation Details</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Ticket Number */}
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

        {/* Client Selection */}
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

        {/* Risk Assessment Section */}
        <div className="space-y-4 border-t pt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Analyst Risk Score (0-100)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={analystRiskScore}
                onChange={(e) => setAnalystRiskScore(Number(e.target.value))}
                className="flex-1"
              />
              <span 
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  analystRiskScore >= 80 ? 'bg-red-100 text-red-800' :
                  analystRiskScore >= 50 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}
              >
                {analystRiskScore}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Risk Assessment Justification
            </label>
            <textarea
              value={riskJustification}
              onChange={(e) => setRiskJustification(e.target.value)}
              placeholder="Explain why you assigned this risk score..."
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
            />
          </div>
        </div>

        {/* Behavior Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Behavior Tags
          </label>
          
          {/* Custom Behavior Input */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={customBehavior}
              onChange={(e) => setCustomBehavior(e.target.value)}
              placeholder="Add custom behavior tag"
              className="flex-1 px-3 py-2 border rounded-md"
            />
            <button
              type="button"
              onClick={addCustomBehavior}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
            >
              Add
            </button>
          </div>

          {/* Predefined Behaviors */}
          <div className="space-y-4">
            {Object.entries(BEHAVIOR_TAGS).map(([category, behaviors]) => (
              <div key={category}>
                <h3 className="text-sm font-medium text-gray-600 mb-2">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {behaviors.map(behavior => (
                    <button
                      key={behavior}
                      type="button"
                      onClick={() => addBehaviorTag(behavior)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                        ${selectedBehaviors.includes(behavior)
                          ? 'bg-green-100 text-green-800 border-2 border-green-500'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    >
                      {behavior.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Selected Behaviors Display */}
          {selectedBehaviors.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Selected Behaviors:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedBehaviors.map(behavior => (
                  <span
                    key={behavior}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {behavior.replace(/_/g, ' ')}
                    <button
                      type="button"
                      onClick={() => removeBehaviorTag(behavior)}
                      className="hover:text-blue-600"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Investigation Notes */}
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

        {/* Submit Button */}
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
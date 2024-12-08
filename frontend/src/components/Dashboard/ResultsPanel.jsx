import React from 'react';
import { Card } from '../common/Card';
import { IPHistory } from './IPHistory';
import InvestigationDetails from './InvestigationDetails';
import { EmailAlerts } from './Alerts/EmailAlerts';
import { storage } from '../../utils/storage';

// Helper functions with null checks
const getActualScore = (assessment) => {
  if (!assessment) return 0;
  return assessment.responseActions?.calculatedScore ?? assessment.calculatedScore ?? 0;
};

const getActualImpact = (assessment) => {
  if (!assessment) return 'Standard';
  return assessment.responseActions?.selectedImpact ?? assessment.clientImpact ?? 'Standard';
};

const getActualInfraType = (assessment) => {
  if (!assessment) return null;
  return assessment.responseActions?.selectedInfraType ?? assessment.infrastructureType ?? null;
};

const getLatestAnalystScore = (ip) => {
  if (!ip) return null;
  const storageData = storage.getData();
  const ipData = storageData?.ipHistory?.[ip];
  if (!ipData?.riskAssessments?.length) return null;

  const latestAssessment = ipData.riskAssessments[0];
  return getActualScore(latestAssessment);
};

export const ResultsPanel = ({ data = {}, onExport }) => {
  if (!data) return null;  // Early return if no data

  // Get latest assessment and its details with null checks
  const latestAssessment = data?.riskAssessments?.[0];
  const impact = getActualImpact(latestAssessment);
  const infraType = getActualInfraType(latestAssessment);
  const ipqsData = data?.detailed_results?.ipqs || {};

  const handleInvestigationSave = ({
    ip,
    ticketNumber,
    notes,
    client,
    behaviors,
    clientImpact,
    responseActions,
    infrastructureType,
    calculatedScore,
    assessmentDetails
  }) => {
    if (!ip) return;
    storage.tagIP(
      ip,
      ticketNumber,
      'analyst@company.com',
      notes,
      client,
      behaviors,
      clientImpact,
      responseActions,
      infrastructureType,
      calculatedScore,
      assessmentDetails
    );
  };

  // Get analyst score
  const analystScore = data.ip ? getLatestAnalystScore(data.ip) : null;

  // Get current risk score and latest score
  const currentRiskScore = data.ip ? storage.getIPAnalytics(data.ip)?.currentRiskScore || 0 : 0;
  const latestScore = data.ip ? storage.getIPAnalytics(data.ip)?.latestScore || 0 : 0;

  const getRiskColorClass = (value) => {
    const numValue = Number(value) || 0;
    if (numValue >= 80) return 'text-red-600';
    if (numValue >= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6 mt-4">
      {/* Previously investigated banner */}
      {data.ip && storage.getData()?.ipHistory?.[data.ip]?.searchCount > 1 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                This IP has been previously investigated.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Analysis Results */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Analysis Results</h2>
          <div className="flex space-x-2">
            <button
              onClick={onExport}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Export Results
            </button>
          </div>
        </div>

        {/* Risk Score Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {Object.entries(data.risk_score || {}).map(([key, value]) => (
            <div key={key} className="p-4 border rounded-lg text-center">
              <div className="text-sm text-gray-500">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </div>
              <div className={`text-2xl font-bold ${getRiskColorClass(value)}`}>
                {value}%
              </div>
            </div>
          ))}

          {/* Current Risk Score */}
          <div className="p-4 border rounded-lg text-center">
            <div className="text-sm text-gray-500">Current Risk</div>
            <div className={`text-2xl font-bold ${getRiskColorClass(currentRiskScore)}`}>
              {currentRiskScore}%
            </div>
          </div>


          {/* Analyst Assessment Score */}
          <div className="p-4 border-2 border-blue-500 rounded-lg text-center">
            <div className="text-sm text-gray-500">Analyst Assessment</div>
            {analystScore !== null ? (
              <div className={`text-2xl font-bold ${getRiskColorClass(analystScore)}`}>
                {analystScore}%
              </div>
            ) : (
              <div className="text-2xl text-gray-400">-%</div>
            )}
          </div>
        </div>

        {/* Infrastructure Info */}
        {infraType && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Infrastructure Type</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <span className="font-medium">{infraType}</span>
            </div>
          </div>
        )}

        {/* Connection Information */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Connection Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">VPN Status:</span>
              <span className={`ml-2 ${ipqsData.vpn ? 'text-yellow-600' : 'text-green-600'}`}>
                {ipqsData.vpn ? 'VPN Detected' : 'Not a VPN'}
              </span>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Proxy Status:</span>
              <span className={`ml-2 ${ipqsData.proxy ? 'text-yellow-600' : 'text-green-600'}`}>
                {ipqsData.proxy ? 'Proxy Detected' : 'Not a Proxy'}
              </span>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Tor Status:</span>
              <span className={`ml-2 ${ipqsData.tor ? 'text-yellow-600' : 'text-green-600'}`}>
                {ipqsData.tor ? 'Tor Exit Node' : 'Not Tor'}
              </span>
            </div>
          </div>
        </div>

        {/* Security Concerns */}
        {data.summary?.structured_summary?.concerns?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Security Concerns</h3>
            <ul className="list-disc pl-5 space-y-1">
              {data.summary.structured_summary.concerns.map((concern, index) => (
                <li
                  key={index}
                  className={`${
                    concern.startsWith('Known') ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  {concern}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Location & Network Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Location Information</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Country:</span>{' '}
                {data.geolocation?.country?.name}
              </p>
              <p>
                <span className="font-medium">City (ProxyCheck):</span>{' '}
                {data.geolocation?.city?.proxycheck}
              </p>
              <p>
                <span className="font-medium">City (IPQS):</span>{' '}
                {data.geolocation?.city?.ipqs}
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Network Information</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">ISP:</span>{' '}
                {data.network_info?.isp?.primary}
              </p>
              {ipqsData.vpn && data.network_info?.isp?.vpn_provider !== 'N/A' && (
                <p>
                  <span className="font-medium">VPN Provider:</span>{' '}
                  {data.network_info?.isp?.vpn_provider}
                </p>
              )}
              <p>
                <span className="font-medium">ASN:</span>{' '}
                {data.network_info?.asn?.number}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Investigation History */}
      <IPHistory ip={data.ip} />

      {/* Investigation Details */}
      <InvestigationDetails ip={data.ip} onSave={handleInvestigationSave} />

      {/* Email Alerts */}
      <EmailAlerts ip={data.ip} />
    </div>
  );
};
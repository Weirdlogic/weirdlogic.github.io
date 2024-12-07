// src/components/IPAnalysis/DetailTabs.jsx
import React, { useState } from 'react';
import { Card } from '../common/Card';

export const DetailTabs = ({ geolocation, networkInfo, securityInfo }) => {
  const [activeTab, setActiveTab] = useState('location');

  // Prevent default button behavior
  const handleTabClick = (tabId, e) => {
    e.preventDefault();
    setActiveTab(tabId);
  };

  return (
    <Card>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['location', 'network', 'security'].map((tab) => (
            <button
              key={tab}
              onClick={(e) => handleTabClick(tab, e)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab 
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-4 p-4">
        {activeTab === 'location' && (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Location Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Country</h4>
                <p className="mt-1">{geolocation.country.name} ({geolocation.country.code})</p>
                <p className="mt-1 text-sm text-gray-500">Region: {geolocation.region.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Cities Reported</h4>
                <p className="mt-1">ProxyCheck: {geolocation.city.proxycheck}</p>
                <p className="mt-1">IPQS: {geolocation.city.ipqs}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Coordinates</h4>
                <p className="mt-1">ProxyCheck: {geolocation.coordinates.proxycheck.latitude}, {geolocation.coordinates.proxycheck.longitude}</p>
                <p className="mt-1">IPQS: {geolocation.coordinates.ipqs.latitude}, {geolocation.coordinates.ipqs.longitude}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Timezone</h4>
                <p className="mt-1">{geolocation.timezone}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'network' && (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Network Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500">ISP Details</h4>
                <p className="mt-1">Primary: {networkInfo.isp.primary}</p>
                <p className="mt-1">VPN Provider: {networkInfo.isp.vpn_provider}</p>
                <p className="mt-1">Organization: {networkInfo.isp.organization}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">ASN Information</h4>
                <p className="mt-1">Number: {networkInfo.asn.number}</p>
                <p className="mt-1">Range: {networkInfo.asn.range}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Additional Info</h4>
                <p className="mt-1">Usage Type: {networkInfo.usage_type}</p>
                <p className="mt-1">Domain: {networkInfo.domain}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Security Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500">VPN/Proxy Detection</h4>
                <p className="mt-1">VPN Detected: {securityInfo.vpn_detected ? 'Yes' : 'No'}</p>
                <p className="mt-1">Tor Detected: {securityInfo.tor_detected ? 'Yes' : 'No'}</p>
                <p className="mt-1">Proxy Detected: {securityInfo.proxy_detected ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Activity Indicators</h4>
                <p className="mt-1">Recent Abuse: {securityInfo.recent_abuse ? 'Yes' : 'No'}</p>
                <p className="mt-1">Bot Status: {securityInfo.bot_status ? 'Yes' : 'No'}</p>
                <p className="mt-1">Is Crawler: {securityInfo.is_crawler ? 'Yes' : 'No'}</p>
                <p className="mt-1">Is Mobile: {securityInfo.is_mobile ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Abuse History</h4>
                <p className="mt-1">Total Reports: {securityInfo.abuse_history.total_reports}</p>
                <p className="mt-1">Distinct Users: {securityInfo.abuse_history.distinct_users}</p>
                <p className="mt-1">Last Reported: {securityInfo.abuse_history.last_reported}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
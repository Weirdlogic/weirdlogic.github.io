import React, { useState } from 'react';

export const SearchPanel = ({ onSearch, loading }) => {
  const [ip, setIp] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(ip);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="Enter IP address"
            className="flex-1 max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </form>
    </div>
  );
};
// src/components/Dashboard/ExportTools.jsx
export const ExportTools = {
    exportToJSON: (data) => {
      const exportData = {
        timestamp: new Date().toISOString(),
        ...data
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ip-analysis-${data.ip}.json`;
      a.click();
    },
    
    exportToCSV: (data) => {
      const rows = [
        ['IP Address', data.ip],
        ['Risk Score (Combined)', data.risk_score.combined],
        ['Risk Score (AbuseIPDB)', data.risk_score.abuseipdb],
        ['Risk Score (ProxyCheck)', data.risk_score.proxycheck],
        ['Risk Score (IPQS)', data.risk_score.ipqs],
        ['Country', data.geolocation.country.name],
        ['City', data.geolocation.city.proxycheck],
        ['Security Concerns', data.summary.structured_summary.concerns.join('; ')]
      ];
      
      const csvContent = "data:text/csv;charset=utf-8," + 
        rows.map(row => row.join(',')).join('\n');
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `ip-analysis-${data.ip}.csv`);
      document.body.appendChild(link);
      link.click();
    }
  };
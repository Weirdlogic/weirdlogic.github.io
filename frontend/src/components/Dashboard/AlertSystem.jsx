// src/components/Dashboard/AlertSystem.jsx
export const AlertSystem = ({ riskScore, securityConcerns }) => {
    if (!riskScore || !securityConcerns) return null;
  
    const getAlerts = () => {
      const alerts = [];
  
      if (riskScore.combined >= 80) {
        alerts.push({
          type: 'error',
          message: 'Critical Risk Level Detected'
        });
      } else if (riskScore.combined >= 50) {
        alerts.push({
          type: 'warning',
          message: 'Moderate Risk Level Detected'
        });
      }
  
      if (securityConcerns.length > 3) {
        alerts.push({
          type: 'error',
          message: 'Multiple Security Concerns Detected'
        });
      }
  
      return alerts;
    };
  
    const alerts = getAlerts();
    if (alerts.length === 0) return null;
  
    return (
      <div className="fixed bottom-4 right-4 space-y-2">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg shadow-lg ${
              alert.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {alert.message}
          </div>
        ))}
      </div>
    );
  };
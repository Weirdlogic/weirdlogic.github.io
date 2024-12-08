# SOC IP Analysis Dashboard

An integrated IP analysis platform designed for SOC analysts to investigate, track, and document IP-based threats. This tool combines multiple threat intelligence services (AbuseIPDB, ProxyCheck, and IPQS) with case management features specifically designed for SOC workflows.

## Table of Contents
- [Features](#features)
- [SOC Integration Features](#soc-integration-features)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Usage Guide for SOC Analysts](#usage-guide-for-soc-analysts)
- [Development](#development)

## Features

### Core Analysis
- Single IP threat assessment
- Batch analysis for multiple IPs
- Real-time monitoring of suspicious IPs
- Historical analysis tracking
- IP comparison for threat pattern analysis

### SOC-Specific Features

#### Investigation Management
- Link IPs to SOCSI/Ticket numbers
- Track investigation status and findings
- Add detailed analyst notes and observations
- Tag IPs with threat categories and client impacts
- Document incident response actions

#### Threat Intelligence
- Build organization-specific IOC database
- Track IPs by impacted client/system
- Document observed malicious behaviors
- Link related IPs in attack patterns
- Custom risk scoring based on organizational context

#### Investigation Workflow
1. Initial Analysis
   - Quick threat assessment
   - Historical context check
   - Previous investigation lookup

2. Case Documentation
   - Link to SOCSI tickets
   - Record affected clients/systems
   - Document observed behaviors
   - Tag with threat categories

3. Pattern Analysis
   - Related IP tracking
   - Attack pattern documentation
   - Client impact correlation

4. Reporting
   - PDF report generation
   - Threat summaries
   - Client-specific reports

## Project Structure

```
project-root/
├── consolidated_api/          # Backend FastAPI application
│   ├── app/
│   │   ├── api/              # API endpoints
│   │   ├── core/             # Core analysis logic
│   │   ├── models/           # Data models
│   │   ├── services/         # External service integrations
│   │   └── utils/            # Utility functions
│   └── requirements.txt      # Python dependencies
│
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Dashboard/    # Main dashboard components
│   │   │   ├── Analytics/    # Analysis visualization
│   │   │   └── common/      # Shared components
│   │   └── utils/           # Frontend utilities
│   └── package.json         # Node.js dependencies
```

## Setup

### Backend Setup

```bash
cd consolidated_api
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Configure API keys in `.env`:
```env
ABUSEIPDB_API_KEY=your_key_here
PROXYCHECK_API_KEY=your_key_here
IPQS_API_KEY=your_key_here
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Usage Guide for SOC Analysts

### Initial IP Investigation

1. Single IP Analysis:
   - Enter IP in search bar
   - Review comprehensive threat assessment
   - Check historical investigations
   - View existing tags and notes

2. Documenting Findings:
   ```
   - Add SOCSI ticket number
   - Document observed behaviors
   - Tag affected clients/systems
   - Record investigation notes
   ```

### Investigation Tags Structure

```json
{
  "ticketNumber": "SOCSI-1234",
  "affectedClients": ["Client-A", "Client-B"],
  "threatCategories": ["Ransomware", "C2"],
  "observedBehaviors": [
    "Port scanning activity",
    "Multiple failed login attempts"
  ],
  "clientImpact": "Medium",
  "analystNotes": "IP associated with ransomware campaign..."
}
```

### Building IOC Context

1. Threat Categories:
   - Malware distribution
   - Command & Control
   - Data exfiltration
   - Scanning/Reconnaissance
   - Brute force attempts

2. Client Impact Documentation:
   - Affected systems
   - Attack timeline
   - Observed behaviors
   - Mitigation actions

3. Related IOC Tracking:
   - Associated IPs
   - Attack patterns
   - Campaign correlation
   - Infrastructure mapping

### Reporting Features

Generate comprehensive reports including:
- Threat analysis summary
- Investigation timeline
- Client impact assessment
- Mitigation recommendations
- Historical context

## API Documentation

### Investigation Endpoints

```
POST /analysis/tag/                # Add investigation tags
GET /analysis/history/{ip}/        # Get IP investigation history
POST /analysis/relate/             # Link related IPs
GET /analysis/client/{client_id}/  # Get client-specific IOCs
```

### Example Tag Request

```json
{
  "ip": "1.1.1.1",
  "ticketNumber": "SOCSI-1234",
  "tags": {
    "threatType": "Ransomware",
    "client": "FinTech-A",
    "impact": "High",
    "behaviors": ["Lateral Movement", "Data Encryption"]
  },
  "notes": "Part of recent ransomware campaign..."
}
```

## Best Practices

1. Investigation Documentation
   - Use consistent tagging formats
   - Document all observed behaviors
   - Link related investigations
   - Include mitigation steps

2. Client Impact Assessment
   - Document affected systems
   - Track incident timeline
   - Record business impact
   - Note containment actions

3. Pattern Recognition
   - Tag similar behaviors
   - Link related IPs
   - Document attack patterns
   - Track campaign evolution

## Development

### Adding New Features

1. New Integrations

#### Shodan Integration
- Real-time asset discovery and monitoring
- Vulnerability identification
- Service enumeration
- Historical exposure analysis
- Integration benefits:
  - Proactive threat hunting
  - Enhanced asset visibility
  - Early warning system for exposed services
  - Historical internet exposure context

#### Enhanced Ticketing Integration
- ServiceNow Integration
  - Bi-directional status sync
  - Asset relationship mapping

- Jira Integration
  - Automated ticket creation
  - Custom SOC workflow templates
  - Team collaboration features

### 2. Custom Analytics Implementation

#### A. New Metrics System
- Investigation Response Times
  - Time to detection tracking
  - Analysis duration metrics
  - Resolution timeframe analysis
  - Escalation pattern monitoring
- Threat Intelligence Metrics
  - Actor pattern recognition
  - Campaign correlation analysis
  - Geographic attack distribution
  - Attack vector frequency
  - Mitre Attack Mapping

#### B. Advanced Visualizations
- Attack pattern heatmaps
- Geographic distribution maps
- Related IP network graphs
- Timeline visualizations
- Impact assessment matrices
- Trend analysis charts

#### C. Dashboard Enhancement
- Customizable widget system
- Dynamic layout management
- Advanced filtering
- Export capabilities

### 3. Threat Hunting System

#### A. Hunt Creation and Management
```javascript
const ThreatHuntingDashboard = () => {
  const [huntingRules, setHuntingRules] = useState([]);
  const [matches, setMatches] = useState([]);

  const createHuntingRule = (rule) => {
    // Validate rule syntax
    // Add to hunting ruleset
    // Schedule execution
  };

  const runHunt = async () => {
    // Execute hunting rules
    // Process matches
    // Generate reports
  };

  return (
    <div className="hunting-dashboard">
      <RuleEditor onSave={createHuntingRule} />
      <MatchesList matches={matches} />
      <HuntingMetrics />
    </div>
  );
};
```

#### B. Pattern Recognition
- ML-based clustering for IP behavior
- Automated pattern detection
- Behavior analysis
- Attack signature matching
- Anomaly detection
- Dynamic IOC extraction


## Troubleshooting

Common Issues:
- API rate limiting
- Search performance
- Report generation
- Data consistency

*Built by a SOC Analyst*

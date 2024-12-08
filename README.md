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

1. New Investigation Fields:
   - Update models in backend
   - Add UI components
   - Update report templates

2. Custom Analytics:
   - Add new metrics
   - Create visualizations
   - Update dashboard components

## Troubleshooting

Common Issues:
- API rate limiting
- Search performance
- Report generation
- Data consistency

## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Create Pull Request

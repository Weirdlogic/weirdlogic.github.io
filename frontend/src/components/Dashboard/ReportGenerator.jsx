// src/components/Dashboard/ReportGenerator.jsx
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const ReportGenerator = {
  generatePDF: (data) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Helper function to add a new page if needed
    const checkSpace = (yPosition, neededSpace = 40) => {
      if (yPosition + neededSpace > doc.internal.pageSize.getHeight()) {
        doc.addPage();
        return 20; // Reset Y position to top of new page
      }
      return yPosition;
    };

    // Title & Basic Info
    doc.setFontSize(20);
    doc.text('IP Analysis Report', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    let yPos = 40;
    doc.text(`IP Address: ${data.ip}`, 20, yPos);
    doc.text(`Analysis Date: ${new Date().toLocaleString()}`, 20, yPos + 10);
    doc.text(`Overall Risk Score: ${data.risk_score.combined}%`, 20, yPos + 20);

    // Risk Scores Table
    yPos = checkSpace(yPos + 40);
    doc.autoTable({
      startY: yPos,
      head: [['Risk Source', 'Score']],
      body: [
        ['AbuseIPDB', `${data.risk_score.abuseipdb}%`],
        ['ProxyCheck', `${data.risk_score.proxycheck}%`],
        ['IPQS', `${data.risk_score.ipqs}%`],
        ['Combined', `${data.risk_score.combined}%`]
      ],
      headStyles: { fillColor: [59, 130, 246] } // Blue header
    });

    // Security Concerns
    yPos = doc.lastAutoTable.finalY + 20;
    yPos = checkSpace(yPos);
    doc.setFont(undefined, 'bold');
    doc.text('Security Concerns:', 20, yPos);
    doc.setFont(undefined, 'normal');
    
    if (data.summary.structured_summary.concerns.length > 0) {
      data.summary.structured_summary.concerns.forEach((concern, index) => {
        yPos = checkSpace(yPos + 10);
        doc.text(`• ${concern}`, 25, yPos);
      });
    } else {
      yPos = checkSpace(yPos + 10);
      doc.text('No security concerns detected', 25, yPos);
    }

    // Geolocation Information
    yPos = checkSpace(yPos + 20);
    doc.setFont(undefined, 'bold');
    doc.text('Geolocation Information:', 20, yPos);
    doc.setFont(undefined, 'normal');
    
    const geoInfo = [
      [`Country: ${data.geolocation.country.name} (${data.geolocation.country.code})`],
      [`Region: ${data.geolocation.region.name}`],
      [`City (ProxyCheck): ${data.geolocation.city.proxycheck}`],
      [`City (IPQS): ${data.geolocation.city.ipqs}`],
      [`Timezone: ${data.geolocation.timezone}`]
    ];

    doc.autoTable({
      startY: yPos + 10,
      body: geoInfo,
      theme: 'plain',
      styles: { cellPadding: 2 }
    });

    // Network Information
    yPos = doc.lastAutoTable.finalY + 20;
    yPos = checkSpace(yPos);
    doc.setFont(undefined, 'bold');
    doc.text('Network Information:', 20, yPos);
    doc.setFont(undefined, 'normal');

    const networkInfo = [
      [`ISP: ${data.network_info.isp.primary}`],
      [`VPN Provider: ${data.network_info.isp.vpn_provider}`],
      [`Organization: ${data.network_info.isp.organization}`],
      [`ASN: ${data.network_info.asn.number}`],
      [`IP Range: ${data.network_info.asn.range}`],
      [`Usage Type: ${data.network_info.usage_type}`],
      [`Domain: ${data.network_info.domain}`]
    ];

    doc.autoTable({
      startY: yPos + 10,
      body: networkInfo,
      theme: 'plain',
      styles: { cellPadding: 2 }
    });

    // Additional Security Information
    yPos = doc.lastAutoTable.finalY + 20;
    yPos = checkSpace(yPos);
    doc.setFont(undefined, 'bold');
    doc.text('Additional Security Information:', 20, yPos);
    doc.setFont(undefined, 'normal');

    const securityInfo = [
      ['Attribute', 'Status'],
      ['Crawler Detection', data.security_info.is_crawler ? 'Yes' : 'No'],
      ['Mobile Traffic', data.security_info.is_mobile ? 'Yes' : 'No'],
      ['Recent Abuse', data.security_info.recent_abuse ? 'Yes' : 'No'],
      ['Bot Status', data.security_info.bot_status ? 'Yes' : 'No'],
      ['Total Abuse Reports', data.security_info.abuse_history.total_reports.toString()],
      ['Distinct Reporters', data.security_info.abuse_history.distinct_users.toString()]
    ];

    doc.autoTable({
      startY: yPos + 10,
      head: [securityInfo[0]],
      body: securityInfo.slice(1),
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] }
    });

    // Footer with timestamp
    const timestamp = `Report generated on ${new Date().toLocaleString()}`;
    doc.setFontSize(10);
    doc.setTextColor(128);
    doc.text(timestamp, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });

    // Save the PDF
    doc.save(`ip-analysis-${data.ip}-${new Date().toISOString().slice(0,10)}.pdf`);
  }
};

export default ReportGenerator;
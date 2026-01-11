import jsPDF from 'jspdf';

export const generateUserGuidePDF = () => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const lineHeight = 7;
  let y = margin;

  const addPage = () => {
    doc.addPage();
    y = margin;
  };

  const checkPageBreak = (height: number = lineHeight) => {
    if (y + height > doc.internal.pageSize.getHeight() - margin) {
      addPage();
    }
  };

  const addTitle = (text: string) => {
    checkPageBreak(20);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 128, 185);
    doc.text(text, pageWidth / 2, y, { align: 'center' });
    y += 15;
  };

  const addHeading = (text: string) => {
    checkPageBreak(15);
    y += 5;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(44, 62, 80);
    doc.text(text, margin, y);
    y += 10;
  };

  const addSubHeading = (text: string) => {
    checkPageBreak(12);
    y += 3;
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(52, 73, 94);
    doc.text(text, margin, y);
    y += 8;
  };

  const addParagraph = (text: string) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
    lines.forEach((line: string) => {
      checkPageBreak();
      doc.text(line, margin, y);
      y += lineHeight;
    });
  };

  const addBullet = (text: string) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(text, pageWidth - margin * 2 - 10);
    lines.forEach((line: string, index: number) => {
      checkPageBreak();
      if (index === 0) {
        doc.text('•', margin, y);
      }
      doc.text(line, margin + 10, y);
      y += lineHeight;
    });
  };

  const addTable = (headers: string[], rows: string[][]) => {
    const colWidth = (pageWidth - margin * 2) / headers.length;
    
    // Headers
    checkPageBreak(10);
    doc.setFillColor(52, 73, 94);
    doc.rect(margin, y - 5, pageWidth - margin * 2, 8, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    headers.forEach((header, i) => {
      doc.text(header, margin + colWidth * i + 2, y);
    });
    y += 8;

    // Rows
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    rows.forEach((row, rowIndex) => {
      checkPageBreak(8);
      if (rowIndex % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(margin, y - 5, pageWidth - margin * 2, 7, 'F');
      }
      row.forEach((cell, i) => {
        const truncated = cell.length > 25 ? cell.substring(0, 22) + '...' : cell;
        doc.text(truncated, margin + colWidth * i + 2, y);
      });
      y += 7;
    });
    y += 5;
  };

  const addNote = (text: string) => {
    checkPageBreak(15);
    doc.setFillColor(255, 243, 205);
    const lines = doc.splitTextToSize(text, pageWidth - margin * 2 - 10);
    doc.rect(margin, y - 4, pageWidth - margin * 2, lines.length * 6 + 8, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(133, 100, 4);
    lines.forEach((line: string) => {
      doc.text(line, margin + 5, y);
      y += 6;
    });
    y += 5;
  };

  // Cover Page
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), 'F');
  
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('SOC Dashboard', pageWidth / 2, 80, { align: 'center' });
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('User Guide', pageWidth / 2, 95, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139);
  doc.text('AI Video Intelligence Platform', pageWidth / 2, 115, { align: 'center' });
  doc.text('Operator Training Manual', pageWidth / 2, 125, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 250, { align: 'center' });

  // Table of Contents
  addPage();
  addTitle('Table of Contents');
  y += 10;
  
  const tocItems = [
    '1. Getting Started',
    '2. Dashboard Overview',
    '3. Live Monitoring',
    '4. VLM Analysis',
    '5. Event Review Workflow',
    '6. Predictive Intelligence',
    '7. Camera Map',
    '8. Audit & Compliance',
    '9. Best Practices'
  ];
  
  tocItems.forEach((item) => {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(item, margin + 10, y);
    y += 10;
  });

  // Section 1: Getting Started
  addPage();
  addHeading('1. Getting Started');
  
  addSubHeading('Logging In');
  addBullet('Navigate to the dashboard URL');
  addBullet('Enter your credentials (username/password or SSO)');
  addBullet('Complete two-factor authentication if required');
  addBullet('You will be directed to the Live Monitoring screen');
  
  addSubHeading('Understanding Your Role');
  addTable(
    ['Role', 'Permissions'],
    [
      ['Operator', 'Monitor cameras, review events, confirm/dismiss alerts'],
      ['Supervisor', 'All operator permissions + escalation, bulk actions'],
      ['Admin', 'All permissions + system settings, user management']
    ]
  );
  
  addSubHeading('System Health Indicator');
  addParagraph('Located in the top-right corner of the header:');
  addBullet('Green: All systems operational');
  addBullet('Amber: Degraded performance or minor issues');
  addBullet('Red: Critical system failure - contact IT immediately');

  // Section 2: Dashboard Overview
  addPage();
  addHeading('2. Dashboard Overview');
  
  addSubHeading('Navigation Sidebar');
  addParagraph('The left sidebar provides access to all major sections:');
  addTable(
    ['Section', 'Description'],
    [
      ['Live Monitoring', 'Real-time camera feeds'],
      ['VLM Analysis', 'AI vision-language model outputs'],
      ['Events & Incidents', 'Event review queue'],
      ['Predictive Alerts', 'Forecasting and trend analysis'],
      ['Camera Map', 'Spatial view of all cameras'],
      ['Audit Logs', 'Compliance and action history'],
      ['Reports', 'Analytics and exports'],
      ['Settings', 'System configuration (Admin only)']
    ]
  );

  // Section 3: Live Monitoring
  addPage();
  addHeading('3. Live Monitoring');
  
  addSubHeading('Camera Tile Status Indicators');
  addTable(
    ['Status', 'Meaning'],
    [
      ['Online (Green)', 'Camera streaming normally'],
      ['Offline (Gray)', 'No connection to camera'],
      ['Alert (Red)', 'AI detected event requires attention']
    ]
  );
  
  addSubHeading('Filtering Cameras');
  addBullet('Search: Type camera ID or location name');
  addBullet('Zone Filter: Select specific zone (Zone A, B, C, etc.)');
  addBullet('View Toggle: Switch between grid and list views');
  
  addSubHeading('Camera Statistics Bar');
  addParagraph('At the top of the grid, you\'ll see total cameras online, active alerts count, and offline cameras count.');

  // Section 4: VLM Analysis
  addPage();
  addHeading('4. VLM Analysis');
  
  addParagraph('The Vision-Language Model (VLM) provides AI-powered scene understanding.');
  
  addSubHeading('Understanding VLM Output');
  addTable(
    ['Section', 'Description'],
    [
      ['Scene Understanding', 'Natural language description of what AI sees'],
      ['Detected Objects', 'Identified objects with confidence scores'],
      ['Risk Assessment', 'Calculated risk level with reasoning'],
      ['Anomalies Detected', 'Unusual patterns compared to baseline'],
      ['Behavior Analysis', 'Interpretation of movement and actions']
    ]
  );
  
  addSubHeading('Confidence Scores');
  addTable(
    ['Range', 'Interpretation'],
    [
      ['85-100%', 'High confidence - likely accurate'],
      ['60-84%', 'Medium confidence - verify carefully'],
      ['0-59%', 'Low confidence - treat with caution']
    ]
  );
  
  addSubHeading('Risk Levels');
  addTable(
    ['Level', 'Score Range', 'Action Required'],
    [
      ['Low', '0-30', 'Routine monitoring'],
      ['Medium', '31-60', 'Enhanced attention'],
      ['High', '61-85', 'Priority review'],
      ['Critical', '86-100', 'Immediate action']
    ]
  );
  
  addNote('Important: VLM outputs are AI-generated suggestions. Always validate before taking enforcement action.');

  // Section 5: Event Review Workflow
  addPage();
  addHeading('5. Event Review Workflow');
  
  addSubHeading('Event Statuses');
  addTable(
    ['Status', 'Meaning'],
    [
      ['Pending (Yellow)', 'Awaiting human review'],
      ['Confirmed (Green)', 'Validated as real incident'],
      ['Dismissed (Gray)', 'Marked as false positive'],
      ['Escalated (Red)', 'Sent to supervisor']
    ]
  );
  
  addSubHeading('Reviewing an Event');
  addBullet('Click "View" on any event row');
  addBullet('Review the video snapshot/clip');
  addBullet('Read the AI analysis and reasoning');
  addBullet('Compare with historical baseline');
  addBullet('Enter a mandatory comment explaining your decision');
  addBullet('Click: Confirm Event, Mark False Positive, or Escalate');
  
  addNote('Compliance Note: Comments are mandatory and become part of the permanent audit record.');

  // Section 6: Predictive Intelligence
  addPage();
  addHeading('6. Predictive Intelligence');
  
  addParagraph('The Predictive Alerts screen shows AI forecasts about potential future events.');
  
  addSubHeading('Crowd Density Trends');
  addBullet('Historical crowd levels (past 24 hours)');
  addBullet('Current crowd density');
  addBullet('Predicted crowd levels (next 4 hours)');
  
  addSubHeading('Predictive Alert Cards');
  addParagraph('Each alert card shows prediction, timeframe, confidence, and recommended action.');
  
  addNote('Disclaimer: Predictions require human validation before any enforcement action. AI forecasts are probabilistic, not certain.');

  // Section 7: Camera Map
  addPage();
  addHeading('7. Camera Map');
  
  addSubHeading('Map Elements');
  addBullet('Camera Markers: Show camera locations and status');
  addBullet('Zone Boundaries: Colored regions for different areas');
  addBullet('Heatmap Overlay: Activity density visualization');
  
  addSubHeading('Zone Colors');
  addTable(
    ['Color', 'Meaning'],
    [
      ['Green', 'Normal activity levels'],
      ['Yellow', 'Elevated activity'],
      ['Orange', 'High activity'],
      ['Red', 'Critical alert in zone']
    ]
  );

  // Section 8: Audit & Compliance
  addPage();
  addHeading('8. Audit & Compliance');
  
  addSubHeading('Logged Actions');
  addTable(
    ['Action Type', 'What\'s Recorded'],
    [
      ['User Access', 'Login, logout, session duration'],
      ['Event Decisions', 'Confirm, dismiss, escalate with comments'],
      ['Data Exports', 'Who exported what and when'],
      ['Settings Changes', 'Configuration modifications'],
      ['Model Updates', 'AI model version changes']
    ]
  );
  
  addNote('Audit logs cannot be edited or deleted. Export functionality may be restricted based on your role.');
  
  addSubHeading('Compliance Standards');
  addBullet('DPDP Act 2023: Personal data protection requirements');
  addBullet('CERT-In: Incident reporting guidelines');
  addBullet('IT Act 2000: Electronic record retention');

  // Section 9: Best Practices
  addPage();
  addHeading('9. Best Practices');
  
  addSubHeading('For Shift Handover');
  addBullet('Review all pending events before end of shift');
  addBullet('Document any ongoing situations in event comments');
  addBullet('Notify incoming operator of critical alerts');
  addBullet('Log any system issues in the shift report');
  
  addSubHeading('For Event Review');
  addBullet('Always watch the video clip, not just the snapshot');
  addBullet('Compare current behavior with historical baseline');
  addBullet('Consider environmental factors (time, weather, events)');
  addBullet('When in doubt, escalate rather than dismiss');
  addBullet('Write clear, specific comments explaining your reasoning');
  
  addSubHeading('Keyboard Shortcuts');
  addTable(
    ['Shortcut', 'Action'],
    [
      ['R', 'Refresh current view'],
      ['N', 'Next pending event'],
      ['P', 'Previous event'],
      ['E', 'Open event detail'],
      ['Esc', 'Close modal/dialog']
    ]
  );

  // Footer on last page
  y = doc.internal.pageSize.getHeight() - 20;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(128, 128, 128);
  doc.text('SOC Dashboard User Guide - For Operator Training', pageWidth / 2, y, { align: 'center' });

  // Save the PDF
  doc.save('SOC_Dashboard_User_Guide.pdf');
};

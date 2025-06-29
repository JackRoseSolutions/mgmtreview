import { getCurrentData } from './storage.js';
import { showToast } from './ui.js';
import { agendaItems } from './agenda.js';

const setColumnWidths = (worksheet, data) => {
    if (!data || data.length === 0) return;
    const objectMaxLength = [];
    const headers = Object.keys(data[0]);
    for (let i = 0; i < data.length; i++) {
        let value = data[i];
        for (let j = 0; j < headers.length; j++) {
            const cellValue = value[headers[j]] ? value[headers[j]].toString() : '';
            objectMaxLength[j] = objectMaxLength[j] >= cellValue.length ? objectMaxLength[j] : cellValue.length;
        }
    }
     const headerLengths = headers.map(header => header.length);
     const finalLengths = objectMaxLength.map((len, i) => Math.max(len, headerLengths[i]) + 2);

    worksheet['!cols'] = finalLengths.map(wch => ({ wch }));
};

// XML Export function
export function exportToXML() {
    try {
        const data = getCurrentData();
        
        // Create XML string
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<managementReview>\n';
        
        // Details
        xml += '  <details>\n';
        for (const [key, value] of Object.entries(data.details)) {
            xml += `    <${key}>${escapeXML(value)}</${key}>\n`;
        }
        xml += '  </details>\n';
        
        // PEST Analysis
        xml += '  <pestAnalysis>\n';
        for (const [key, value] of Object.entries(data.pest)) {
            xml += `    <${key}>${escapeXML(value)}</${key}>\n`;
        }
        xml += '  </pestAnalysis>\n';
        
        // SWOT Analysis
        xml += '  <swotAnalysis>\n';
        for (const [key, value] of Object.entries(data.swot)) {
            xml += `    <${key}>${escapeXML(value)}</${key}>\n`;
        }
        xml += '  </swotAnalysis>\n';
        
        // Issues
        xml += '  <issues>\n';
        data.issues.forEach(issue => {
            xml += '    <issue>\n';
            for (const [key, value] of Object.entries(issue)) {
                xml += `      <${key}>${escapeXML(value)}</${key}>\n`;
            }
            xml += '    </issue>\n';
        });
        xml += '  </issues>\n';
        
        // Agenda Items
        xml += '  <agenda>\n';
        for (const [id, item] of Object.entries(data.agenda)) {
            xml += `    <item id="${escapeXML(id)}">\n`;
            xml += `      <minutes>${escapeXML(item.minutes)}</minutes>\n`;
            
            // Action Items
            if (item.actionItems && item.actionItems.length > 0) {
                xml += '      <actionItems>\n';
                item.actionItems.forEach(action => {
                    xml += '        <action>\n';
                    for (const [key, value] of Object.entries(action)) {
                        xml += `          <${key}>${escapeXML(value)}</${key}>\n`;
                    }
                    xml += '        </action>\n';
                });
                xml += '      </actionItems>\n';
            }
            
            // List Items
            if (item.listItems && item.listItems.length > 0) {
                xml += '      <listItems>\n';
                item.listItems.forEach(listItem => {
                    xml += '        <listItem>\n';
                    for (const [key, value] of Object.entries(listItem)) {
                        xml += `          <${key}>${escapeXML(value)}</${key}>\n`;
                    }
                    xml += '        </listItem>\n';
                });
                xml += '      </listItems>\n';
            }
            
            xml += '    </item>\n';
        }
        xml += '  </agenda>\n';
        
        // Sign-offs
        if (data.signOffs && data.signOffs.length > 0) {
            xml += '  <signOffs>\n';
            data.signOffs.forEach(signoff => {
                xml += '    <signOff>\n';
                for (const [key, value] of Object.entries(signoff)) {
                    xml += `      <${key}>${escapeXML(value)}</${key}>\n`;
                }
                xml += '    </signOff>\n';
            });
            xml += '  </signOffs>\n';
        }
        
        xml += '</managementReview>';
        
        // Create and download file
        const blob = new Blob([xml], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ISO9001_Management_Review_${new Date().toISOString().split('T')[0]}.xml`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Data exported to XML successfully!');
    } catch (error) {
        console.error("Error exporting to XML:", error);
        showToast('Failed to export XML data.', 5000);
    }
}

// XML Import function
export function importFromXML(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(e.target.result, "text/xml");
            
            const data = {
                details: {},
                pest: {},
                swot: {},
                issues: [],
                agenda: {},
                signOffs: []
            };
            
            // Parse Details
            const details = xmlDoc.querySelector('details');
            if (details) {
                Array.from(details.children).forEach(child => {
                    data.details[child.tagName] = child.textContent;
                });
            }
            
            // Parse PEST
            const pest = xmlDoc.querySelector('pestAnalysis');
            if (pest) {
                Array.from(pest.children).forEach(child => {
                    data.pest[child.tagName] = child.textContent;
                });
            }
            
            // Parse SWOT
            const swot = xmlDoc.querySelector('swotAnalysis');
            if (swot) {
                Array.from(swot.children).forEach(child => {
                    data.swot[child.tagName] = child.textContent;
                });
            }
            
            // Parse Issues
            const issues = xmlDoc.querySelectorAll('issues > issue');
            issues.forEach(issue => {
                const issueObj = {};
                Array.from(issue.children).forEach(child => {
                    issueObj[child.tagName] = child.textContent;
                });
                data.issues.push(issueObj);
            });
            
            // Parse Agenda
            const agendaItems = xmlDoc.querySelectorAll('agenda > item');
            agendaItems.forEach(item => {
                const id = item.getAttribute('id');
                const agendaItem = {
                    minutes: item.querySelector('minutes')?.textContent || '',
                    actionItems: [],
                    listItems: []
                };
                
                // Parse Action Items
                item.querySelectorAll('actionItems > action').forEach(action => {
                    const actionObj = {};
                    Array.from(action.children).forEach(child => {
                        actionObj[child.tagName] = child.textContent;
                    });
                    agendaItem.actionItems.push(actionObj);
                });
                
                // Parse List Items
                item.querySelectorAll('listItems > listItem').forEach(listItem => {
                    const listObj = {};
                    Array.from(listItem.children).forEach(child => {
                        listObj[child.tagName] = child.textContent;
                    });
                    agendaItem.listItems.push(listObj);
                });
                
                data.agenda[id] = agendaItem;
            });
            
            // Parse Sign-offs
            const signOffs = xmlDoc.querySelectorAll('signOffs > signOff');
            signOffs.forEach(signOff => {
                const signOffObj = {};
                Array.from(signOff.children).forEach(child => {
                    signOffObj[child.tagName] = child.textContent;
                });
                data.signOffs.push(signOffObj);
            });
            
            loadFromData(data);
            showToast('Data imported from XML successfully!');
        } catch (error) {
            console.error("Error importing from XML:", error);
            showToast('Failed to import XML file. Please check format.', 5000);
        }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
}

// Helper function to escape XML special characters
function escapeXML(str) {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export const exportAllToXLSX = () => {
    const data = getCurrentData();
    const workbook = XLSX.utils.book_new();

    // 1. Meeting Details Sheet
    const detailsData = [
        { key: 'Review Date', value: data.details.date || '' },
        { key: 'Location / Platform', value: data.details.location || '' },
        { key: 'Attendees', value: data.details.attendees || '' }
    ];
    const detailsWorksheet = XLSX.utils.json_to_sheet(detailsData, { header: ['key', 'value'], skipHeader: true });
    detailsWorksheet['!cols'] = [{ wch: 25 }, { wch: 80 }];
    XLSX.utils.book_append_sheet(workbook, detailsWorksheet, 'Meeting Details');

    // 1.5. Meeting Summary Sheet
    const summaryData = [
        { key: 'Meeting Summary', value: data.summary.meetingSummary || '' },
        { key: 'Key Decisions', value: data.summary.keyDecisions || '' },
        { key: 'Next Steps', value: data.summary.nextSteps || '' },
        { key: 'Review Effectiveness', value: data.summary.reviewEffectiveness || '' }
    ];
    const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData, { header: ['key', 'value'], skipHeader: true });
    summaryWorksheet['!cols'] = [{ wch: 25 }, { wch: 80 }];
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Meeting Summary');

    // 1.6. Sign-offs Sheet
    if (data.signOffs.length > 0) {
        const signOffData = data.signOffs.map(s => ({
            "Name & Title": s.name,
            "Role": s.role || 'Attendee',
            "Date": s.date
        }));
        const signOffHeaders = ["Name & Title", "Role", "Date"];
        const signOffWorksheet = XLSX.utils.json_to_sheet(signOffData, { header: signOffHeaders });
        setColumnWidths(signOffWorksheet, signOffData.length > 0 ? signOffData : [Object.fromEntries(signOffHeaders.map(h => [h, '']))]);
        XLSX.utils.book_append_sheet(workbook, signOffWorksheet, 'Sign-offs');
    }

    // 2. PEST Analysis Sheet
    const p = (data.pest.political || '').split('\n').filter(Boolean);
    const e = (data.pest.economic || '').split('\n').filter(Boolean);
    const s = (data.pest.social || '').split('\n').filter(Boolean);
    const t = (data.pest.technological || '').split('\n').filter(Boolean);
    const maxPestRows = Math.max(p.length, e.length, s.length, t.length);
    const pestData = [];
    for (let i = 0; i < maxPestRows; i++) {
        pestData.push({
            'Political': p[i] || '',
            'Economic': e[i] || '',
            'Social': s[i] || '',
            'Technological': t[i] || '',
        });
    }
    const pestWorksheet = XLSX.utils.json_to_sheet(pestData, { header: ['Political', 'Economic', 'Social', 'Technological'] });
    pestWorksheet['!cols'] = [{ wch: 40 }, { wch: 40 }, { wch: 40 }, { wch: 40 }];
    XLSX.utils.book_append_sheet(workbook, pestWorksheet, 'PEST Analysis');

    // 3. SWOT Analysis Sheet
    const str = (data.swot.strengths || '').split('\n').filter(Boolean);
    const w = (data.swot.weaknesses || '').split('\n').filter(Boolean);
    const o = (data.swot.opportunities || '').split('\n').filter(Boolean);
    const thr = (data.swot.threats || '').split('\n').filter(Boolean);
    const maxSwotRows = Math.max(str.length, w.length, o.length, thr.length);
    const swotData = [];
    for (let i = 0; i < maxSwotRows; i++) {
        swotData.push({
            'Strengths': str[i] || '',
            'Weaknesses': w[i] || '',
            'Opportunities': o[i] || '',
            'Threats': thr[i] || '',
        });
    }
    const swotWorksheet = XLSX.utils.json_to_sheet(swotData, { header: ['Strengths', 'Weaknesses', 'Opportunities', 'Threats'] });
    swotWorksheet['!cols'] = [{ wch: 40 }, { wch: 40 }, { wch: 40 }, { wch: 40 }];
    XLSX.utils.book_append_sheet(workbook, swotWorksheet, 'SWOT Analysis');

    // 4. Issues Register Sheet
    const issuesData = data.issues.map(i => ({
        "Issue Description": i.desc,
        "Type": i.type,
        "Interested Party": i.party,
        "Date Identified": i.date,
        "Risk/Opportunity": i.riskOpp,
        "Actions Taken": i.actions,
        "Owner": i.owner,
        "Status": i.status,
    }));
    const issuesHeaders = ["Issue Description", "Type", "Interested Party", "Date Identified", "Risk/Opportunity", "Actions Taken", "Owner", "Status"];
    const issuesWorksheet = XLSX.utils.json_to_sheet(issuesData, { header: issuesHeaders });
    setColumnWidths(issuesWorksheet, issuesData.length > 0 ? issuesData : [Object.fromEntries(issuesHeaders.map(h => [h, '']))]);
    XLSX.utils.book_append_sheet(workbook, issuesWorksheet, 'Issues Register');

    // 5. Action Items Summary Sheet
    const allActionItems = Object.values(data.agenda).flatMap(item => item.actionItems || [])
        .filter(item => item.task || item.owner || item.due);

    const actionItemsData = allActionItems.map(item => ({
        "Agenda Source": item.agendaTitle,
        "Action Task": item.task,
        "Assigned To": item.owner,
        "Due Date": item.due,
        "Status": item.status,
    }));
    const actionHeaders = ["Agenda Source", "Action Task", "Assigned To", "Due Date", "Status"];
    const actionItemsWorksheet = XLSX.utils.json_to_sheet(actionItemsData, { header: actionHeaders });
    setColumnWidths(actionItemsWorksheet, actionItemsData.length > 0 ? actionItemsData : [Object.fromEntries(actionHeaders.map(h => [h, '']))]);
    XLSX.utils.book_append_sheet(workbook, actionItemsWorksheet, 'Action Items Summary');

    // 6. Individual Agenda Item Sheets
    agendaItems.forEach((title, index) => {
        const kebabCaseId = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const itemData = data.agenda[kebabCaseId] || { minutes: '', listItems: [] };
        
        const sheetName = `${index + 1}. ${title.substring(0, 25)}`;
        const agendaSheetData = [];
        let listHeaders = [];

        if(itemData.minutes) {
             agendaSheetData.push({ 'Minutes & Notes': itemData.minutes });
        }
       
        if(itemData.listItems.length > 0) {
             if(itemData.minutes) agendaSheetData.push({}); // Add a spacer row
            agendaSheetData.push(...itemData.listItems);
            listHeaders = Object.keys(itemData.listItems[0] || {});
        } else {
             const listType = document.querySelector(`#item-${kebabCaseId} .add-list-item-btn`)?.dataset.listType;
             if (listType) {
                switch(listType) {
                    case 'feedback': listHeaders = ['source', 'summary', 'date', 'status']; break;
                    case 'objective': listHeaders = ['objective', 'target', 'actual', 'status', 'comments']; break;
                    case 'process': listHeaders = ['process', 'kpi', 'target', 'actual', 'status', 'comments']; break;
                    case 'nonconformity': listHeaders = ['ref', 'desc', 'source', 'date', 'action', 'owner', 'status']; break;
                    case 'kpi': listHeaders = ['name', 'frequency', 'target', 'result', 'trend', 'comments']; break;
                    case 'audit': listHeaders = ['type', 'date', 'auditor', 'scope', 'findings', 'status', 'actions']; break;
                    case 'supplier': listHeaders = ['name', 'service', 'metric', 'rating', 'issues', 'action']; break;
                    case 'resource': listHeaders = ['type', 'status', 'requirements', 'gap', 'priority', 'plan']; break;
                    case 'risk-opportunity': listHeaders = ['risk', 'action', 'expected', 'actual', 'effectiveness', 'next']; break;
                    case 'improvement': listHeaders = ['area', 'current', 'proposed', 'benefits', 'priority', 'owner', 'timeline']; break;
                }
             }
        }
        
        const hasList = listHeaders.length > 0;
        const finalHeaders = hasList ? listHeaders : (itemData.minutes ? [] : ['Minutes & Notes']);

        const agendaWorksheet = XLSX.utils.json_to_sheet(agendaSheetData, {
            skipHeader: itemData.minutes ? true : false,
            header: hasList ? finalHeaders : undefined
        });
        
        // Custom column widths
        if (itemData.listItems.length > 0) {
            setColumnWidths(agendaWorksheet, itemData.listItems);
        } else if (hasList) {
            setColumnWidths(agendaWorksheet, [Object.fromEntries(listHeaders.map(h => [h, '']))]);
        } else {
            agendaWorksheet['!cols'] = [{ wch: 120 }];
        }
        
        XLSX.utils.book_append_sheet(workbook, agendaWorksheet, sheetName);
    });

    XLSX.writeFile(workbook, `ISO9001_Management_Review_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
    showToast('Complete data exported to Excel successfully!');
};
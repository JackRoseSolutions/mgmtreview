// Data persistence functions
import { addIssueRow } from './issues.js';
import { addActionItem, updateActionItemSummary } from './actions.js';
import * as Lists from './lists.js';
import { showToast } from './ui.js';
import { getSignOffData } from './signoff.js';

export const exportToJSON = () => {
    const data = getCurrentData();
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ISO9001_Management_Review_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Data exported to JSON successfully!');
};

export const importFromJSON = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            loadFromData(data);
            showToast('Data imported successfully!');
        } catch (error) {
            showToast('Error importing JSON file. Please check the file format.', 5000);
            console.error('Import error:', error);
        }
    };
    reader.readAsText(file);
    
    // Reset the file input
    event.target.value = '';
};

export const getCurrentData = () => {
    return {
        details: {
            date: document.getElementById('review-date').value,
            location: document.getElementById('review-location').value,
            attendees: document.getElementById('attendees').value,
        },
        summary: {
            meetingSummary: document.getElementById('meeting-summary').value,
            keyDecisions: document.getElementById('key-decisions').value,
            nextSteps: document.getElementById('next-steps').value,
            reviewEffectiveness: document.getElementById('review-effectiveness').value,
        },
        signOffs: getSignOffData(),
        pageTitles: getPageTitles(),
        pest: getPestData(),
        swot: getSwotData(),
        issues: getIssuesData(),
        agenda: getAgendaData()
    };
};

// Helper functions to get specific data sections
const getPageTitles = () => {
    return {
        mainTitle: document.querySelector('header h1').textContent,
        subTitle: document.querySelector('header .lead').textContent,
        meetingDetails: document.querySelector('#meeting-details .card-header h3').textContent,
        pestAnalysis: document.querySelector('#pest-analysis-card .card-header h3').textContent,
        swotAnalysis: document.querySelector('#swot-analysis-card .card-header h3').textContent,
        issuesRegister: document.querySelector('#issues-register-card .card-header h3').textContent,
        actionSummary: document.querySelector('#summary-card .card-header h3').textContent,
        meetingSummaryTitle: document.querySelector('#meeting-summary-card .card-header h3').textContent,
        signOffTitle: document.querySelector('#sign-off-card .card-header h3').textContent,
        agendaTitle: document.querySelector('h2.mb-3').textContent,
        pestPolitical: document.querySelector('.pest-title.political').textContent,
        pestEconomic: document.querySelector('.pest-title.economic').textContent,
        pestSocial: document.querySelector('.pest-title.social').textContent,
        pestTechnological: document.querySelector('.pest-title.technological').textContent,
        swotStrengths: document.querySelector('.swot-title.strengths').textContent,
        swotWeaknesses: document.querySelector('.swot-title.weaknesses').textContent,
        swotOpportunities: document.querySelector('.swot-title.opportunities').textContent,
        swotThreats: document.querySelector('.swot-title.threats').textContent,
    };
};

const getPestData = () => {
    return {
        political: document.getElementById('pest-political').value,
        economic: document.getElementById('pest-economic').value,
        social: document.getElementById('pest-social').value,
        technological: document.getElementById('pest-technological').value,
    };
};

const getSwotData = () => {
    return {
        strengths: document.getElementById('swot-strengths').value,
        weaknesses: document.getElementById('swot-weaknesses').value,
        opportunities: document.getElementById('swot-opportunities').value,
        threats: document.getElementById('swot-threats').value,
    };
};

const getIssuesData = () => {
    const issues = [];
    document.querySelectorAll('.issue-item').forEach(issueEl => {
        issues.push({
            desc: issueEl.querySelector('.issue-desc').value,
            type: issueEl.querySelector('.issue-type').value,
            party: issueEl.querySelector('.issue-party').value,
            date: issueEl.querySelector('.issue-date').value,
            riskOpp: issueEl.querySelector('.issue-riskopp').value,
            actions: issueEl.querySelector('.issue-actions').value,
            owner: issueEl.querySelector('.issue-owner').value,
            status: issueEl.querySelector('.issue-status').value,
        });
    });
    return issues;
};

const getAgendaData = () => {
    const agenda = {};
    const agendaContainer = document.getElementById('management-review-agenda');
    agendaContainer.querySelectorAll('.accordion-item').forEach(itemEl => {
        const itemId = itemEl.id.replace('item-', '');
        agenda[itemId] = {
            title: itemEl.querySelector('.accordion-button span').textContent,
            minutes: itemEl.querySelector('textarea').value,
            actionItems: getActionItems(itemEl),
            listItems: getListItems(itemEl)
        };
    });
    return agenda;
};

const getActionItems = (itemEl) => {
    const actionItems = [];
    itemEl.querySelectorAll('.action-item').forEach(actionEl => {
        const task = actionEl.querySelector('.task').value;
        const owner = actionEl.querySelector('.owner').value;
        const due = actionEl.querySelector('.due').value;
        const status = actionEl.querySelector('.status').value;
        const agendaTitle = actionEl.dataset.agendaTitle;
        if (task || owner || due) {
            actionItems.push({ task, owner, due, status, agendaTitle });
        }
    });
    return actionItems;
};

const getListItems = (itemEl) => {
    const listItems = [];
    itemEl.querySelectorAll('.dynamic-list-container tbody tr').forEach(rowEl => {
        const rowData = {};
        rowEl.querySelectorAll('[data-field]').forEach(fieldEl => {
            rowData[fieldEl.dataset.field] = fieldEl.value;
        });
        if (Object.values(rowData).some(val => val !== '')) {
            listItems.push(rowData);
        }
    });
    return listItems;
};

export const loadFromData = (data) => {
    // Clear existing data
    document.getElementById('management-review-agenda').querySelectorAll('.action-item').forEach(el => el.remove());
    document.getElementById('management-review-agenda').querySelectorAll('.dynamic-list-container tbody tr').forEach(el => el.remove());
    document.getElementById('issues-container').innerHTML = `<p id="issues-placeholder" class="text-muted">No issues added yet. Click "+ Add Issue" to start building your register.</p>`;
    document.getElementById('additional-signoffs').innerHTML = '';

    // Load page titles
    if (data.pageTitles) {
        document.querySelector('header h1').textContent = data.pageTitles.mainTitle || 'Management Review';
        document.querySelector('header .lead').textContent = data.pageTitles.subTitle || 'As per ISO 9001:2015 Quality Management System';
        document.querySelector('#meeting-details .card-header h3').textContent = data.pageTitles.meetingDetails || 'Meeting Details';
        document.querySelector('#pest-analysis-card .card-header h3').textContent = data.pageTitles.pestAnalysis || 'PEST Analysis';
        document.querySelector('#swot-analysis-card .card-header h3').textContent = data.pageTitles.swotAnalysis || 'SWOT Analysis';
        document.querySelector('#issues-register-card .card-header h3').textContent = data.pageTitles.issuesRegister || 'External & Internal Issues Register';
        document.querySelector('#summary-card .card-header h3').textContent = data.pageTitles.actionSummary || 'Action Item Summary';
        document.querySelector('#meeting-summary-card .card-header h3').textContent = data.pageTitles.meetingSummaryTitle || 'Meeting Summary & Conclusions';
        document.querySelector('#sign-off-card .card-header h3').textContent = data.pageTitles.signOffTitle || 'Meeting Sign-Off & Approval';
        document.querySelector('h2.mb-3').textContent = data.pageTitles.agendaTitle || 'Agenda & Minutes';
        document.querySelector('.pest-title.political').textContent = data.pageTitles.pestPolitical || 'Political';
        document.querySelector('.pest-title.economic').textContent = data.pageTitles.pestEconomic || 'Economic';
        document.querySelector('.pest-title.social').textContent = data.pageTitles.pestSocial || 'Social';
        document.querySelector('.pest-title.technological').textContent = data.pageTitles.pestTechnological || 'Technological';
        document.querySelector('.swot-title.strengths').textContent = data.pageTitles.swotStrengths || 'Strengths';
        document.querySelector('.swot-title.weaknesses').textContent = data.pageTitles.swotWeaknesses || 'Weaknesses';
        document.querySelector('.swot-title.opportunities').textContent = data.pageTitles.swotOpportunities || 'Opportunities';
        document.querySelector('.swot-title.threats').textContent = data.pageTitles.swotThreats || 'Threats';
    }

    // Load details
    if (data.details) {
        document.getElementById('review-date').value = data.details.date || '';
        document.getElementById('review-location').value = data.details.location || '';
        document.getElementById('attendees').value = data.details.attendees || '';
    }

    // Load summary
    if (data.summary) {
        document.getElementById('meeting-summary').value = data.summary.meetingSummary || '';
        document.getElementById('key-decisions').value = data.summary.keyDecisions || '';
        document.getElementById('next-steps').value = data.summary.nextSteps || '';
        document.getElementById('review-effectiveness').value = data.summary.reviewEffectiveness || '';
    }

    // Load sign-offs
    if (data.signOffs && data.signOffs.length > 0) {
        let topMgmtLoaded = false;
        let qualityMgrLoaded = false;
        
        data.signOffs.forEach(signoff => {
            if (signoff.role === 'Top Management Representative' && !topMgmtLoaded) {
                document.getElementById('signoff-name-1').value = signoff.name || '';
                document.getElementById('signoff-date-1').value = signoff.date || '';
                topMgmtLoaded = true;
            } else if (signoff.role === 'Quality Manager' && !qualityMgrLoaded) {
                document.getElementById('signoff-name-2').value = signoff.name || '';
                document.getElementById('signoff-date-2').value = signoff.date || '';
                qualityMgrLoaded = true;
            } else if (!signoff.role) {
                addSignOffRow(signoff);
            }
        });
    }

    // Load PEST
    if (data.pest) {
        document.getElementById('pest-political').value = data.pest.political || '';
        document.getElementById('pest-economic').value = data.pest.economic || '';
        document.getElementById('pest-social').value = data.pest.social || '';
        document.getElementById('pest-technological').value = data.pest.technological || '';
    }

    // Load SWOT
    if (data.swot) {
        document.getElementById('swot-strengths').value = data.swot.strengths || '';
        document.getElementById('swot-weaknesses').value = data.swot.weaknesses || '';
        document.getElementById('swot-opportunities').value = data.swot.opportunities || '';
        document.getElementById('swot-threats').value = data.swot.threats || '';
    }

    // Load issues
    if (data.issues && data.issues.length > 0) {
        data.issues.forEach(issue => addIssueRow(issue));
    }
    
    // Load agenda items
    if (data.agenda) {
        for (const itemId in data.agenda) {
            const itemData = data.agenda[itemId];
            const itemEl = document.getElementById(`item-${itemId}`);
            if (itemEl) {
                if (itemData.title) {
                    itemEl.querySelector('.accordion-button span').textContent = itemData.title;
                }
                itemEl.querySelector('textarea').value = itemData.minutes || '';
                const container = itemEl.querySelector(`[id^="action-items-container-"]`);
                if (container && itemData.actionItems) {
                    itemData.actionItems.forEach(action => addActionItem(container, action));
                }
                const listContainer = itemEl.querySelector(`[id^="list-container-"]`);
                if (listContainer && itemData.listItems) {
                    const listType = itemEl.querySelector('.add-list-item-btn').dataset.listType;
                    itemData.listItems.forEach(listItem => {
                        if (listType === 'feedback') {
                            Lists.addCustomerFeedbackRow(listContainer, listItem);
                        } else if (listType === 'objective') {
                            Lists.addQualityObjectiveRow(listContainer, listItem);
                        } else if (listType === 'process') {
                            Lists.addProcessPerformanceRow(listContainer, listItem);
                        } else if (listType === 'nonconformity') {
                            Lists.addNonconformityRow(listContainer, listItem);
                        } else if (listType === 'kpi') {
                            Lists.addKPIRow(listContainer, listItem);
                        } else if (listType === 'audit') {
                            Lists.addAuditRow(listContainer, listItem);
                        } else if (listType === 'supplier') {
                            Lists.addSupplierRow(listContainer, listItem);
                        } else if (listType === 'resource') {
                            Lists.addResourceRow(listContainer, listItem);
                        } else if (listType === 'risk-opportunity') {
                            Lists.addRiskOpportunityRow(listContainer, listItem);
                        } else if (listType === 'improvement') {
                            Lists.addImprovementRow(listContainer, listItem);
                        }
                    });
                }
            }
        }
    }
    updateActionItemSummary();
};

export const exportToPPT = () => {
    const data = getCurrentData();
    const pres = new PptxGenJS();
    
    // Title slide
    const titleSlide = pres.addSlide();
    titleSlide.addText('ISO 9001:2015 Management Review', { 
        x: 1, y: 2, w: 8, h: 1.5, fontSize: 32, bold: true, align: 'center' 
    });
    titleSlide.addText(`Date: ${data.details.date || 'TBD'}`, { 
        x: 1, y: 4, w: 8, h: 0.5, fontSize: 18, align: 'center' 
    });
    titleSlide.addText(`Location: ${data.details.location || 'TBD'}`, { 
        x: 1, y: 4.5, w: 8, h: 0.5, fontSize: 18, align: 'center' 
    });

    // Meeting Details slide
    if (data.details.attendees) {
        const detailsSlide = pres.addSlide();
        detailsSlide.addText('Meeting Details', { 
            x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 24, bold: true 
        });
        detailsSlide.addText('Attendees:', { 
            x: 0.5, y: 1.5, w: 2, h: 0.5, fontSize: 16, bold: true 
        });
        detailsSlide.addText(data.details.attendees, { 
            x: 0.5, y: 2, w: 9, h: 4, fontSize: 14 
        });
    }

    // PEST Analysis slide
    if (data.pest.political || data.pest.economic || data.pest.social || data.pest.technological) {
        const pestSlide = pres.addSlide();
        pestSlide.addText('PEST Analysis', { 
            x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 24, bold: true 
        });
        
        const pestData = [
            ['Political', 'Economic'],
            [data.pest.political || 'N/A', data.pest.economic || 'N/A'],
            ['Social', 'Technological'],
            [data.pest.social || 'N/A', data.pest.technological || 'N/A']
        ];
        
        pestSlide.addTable(pestData, {
            x: 0.5, y: 1.5, w: 9, h: 4,
            fontSize: 12,
            border: { pt: 1, color: '363636' }
        });
    }

    // SWOT Analysis slide
    if (data.swot.strengths || data.swot.weaknesses || data.swot.opportunities || data.swot.threats) {
        const swotSlide = pres.addSlide();
        swotSlide.addText('SWOT Analysis', { 
            x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 24, bold: true 
        });
        
        const swotData = [
            ['Strengths', 'Weaknesses'],
            [data.swot.strengths || 'N/A', data.swot.weaknesses || 'N/A'],
            ['Opportunities', 'Threats'],
            [data.swot.opportunities || 'N/A', data.swot.threats || 'N/A']
        ];
        
        swotSlide.addTable(swotData, {
            x: 0.5, y: 1.5, w: 9, h: 4,
            fontSize: 12,
            border: { pt: 1, color: '363636' }
        });
    }

    // Issues Register slide
    if (data.issues.length > 0) {
        const issuesSlide = pres.addSlide();
        issuesSlide.addText('External & Internal Issues Register', { 
            x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 24, bold: true 
        });
        
        const issuesData = [
            ['Issue Description', 'Type', 'Status', 'Owner']
        ];
        
        data.issues.forEach(issue => {
            issuesData.push([
                issue.desc || 'N/A',
                issue.type || 'N/A',
                issue.status || 'N/A',
                issue.owner || 'N/A'
            ]);
        });
        
        issuesSlide.addTable(issuesData, {
            x: 0.5, y: 1.5, w: 9, h: 4,
            fontSize: 10,
            border: { pt: 1, color: '363636' }
        });
    }

    // Action Items Summary slide
    const allActionItems = [];
    for (const itemId in data.agenda) {
        const itemData = data.agenda[itemId];
        if (itemData.actionItems) {
            allActionItems.push(...itemData.actionItems);
        }
    }

    if (allActionItems.length > 0) {
        const actionSlide = pres.addSlide();
        actionSlide.addText('Action Items Summary', { 
            x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 24, bold: true 
        });
        
        const actionData = [
            ['Task', 'Owner', 'Due Date', 'Status']
        ];
        
        allActionItems.forEach(action => {
            actionData.push([
                action.task || 'N/A',
                action.owner || 'N/A',
                action.due || 'N/A',
                action.status || 'N/A'
            ]);
        });
        
        actionSlide.addTable(actionData, {
            x: 0.5, y: 1.5, w: 9, h: 4,
            fontSize: 10,
            border: { pt: 1, color: '363636' }
        });
    }

    pres.writeFile({ fileName: `ISO9001_Management_Review_${new Date().toISOString().split('T')[0]}.pptx` });
    showToast('PowerPoint presentation exported successfully!');
};

export const saveData = () => {
    const data = getCurrentData();
    localStorage.setItem('managementReviewData', JSON.stringify(data));
    updateActionItemSummary();
    showToast('Progress saved successfully!');
};

export const loadData = () => {
    const data = JSON.parse(localStorage.getItem('managementReviewData'));
    if (!data) return;
    loadFromData(data);
};
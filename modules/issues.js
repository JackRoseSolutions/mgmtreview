// Issues register management
import { showToast } from './ui.js';

export const addIssueRow = (issue = {}) => {
    const issuesContainer = document.getElementById('issues-container');
    document.getElementById('issues-placeholder')?.remove();

    const {
        desc = '',
        type = 'Internal',
        party = '',
        date = '',
        riskOpp = 'Risk',
        actions = '',
        owner = '',
        status = 'Open'
    } = issue;

    const issueDiv = document.createElement('div');
    issueDiv.className = 'issue-item';
    issueDiv.innerHTML = `
        <textarea class="form-control form-control-sm issue-desc" placeholder="Issue Description (e.g., Supply chain delays)" rows="2">${desc}</textarea>
        <select class="form-select form-select-sm issue-type">
            <option ${type === 'Internal' ? 'selected' : ''}>Internal</option>
            <option ${type === 'External' ? 'selected' : ''}>External</option>
        </select>
        <input type="text" class="form-control form-control-sm issue-party" placeholder="Interested Party" value="${party}">
        <input type="date" class="form-control form-control-sm issue-date" value="${date}">
        <select class="form-select form-select-sm issue-riskopp">
            <option ${riskOpp === 'Risk' ? 'selected' : ''}>Risk</option>
            <option ${riskOpp === 'Opportunity' ? 'selected' : ''}>Opportunity</option>
        </select>
        <textarea class="form-control form-control-sm issue-actions" placeholder="Actions Taken / Planned" rows="2">${actions}</textarea>
        <input type="text" class="form-control form-control-sm issue-owner" placeholder="Owner" value="${owner}">
        <select class="form-select form-select-sm issue-status">
            <option ${status === 'Open' ? 'selected' : ''}>Open</option>
            <option ${status === 'Monitored' ? 'selected' : ''}>Monitored</option>
            <option ${status === 'Closed' ? 'selected' : ''}>Closed</option>
        </select>
        <button class="btn btn-danger btn-sm delete-issue-btn" title="Remove Issue">×</button>
    `;
    issuesContainer.appendChild(issueDiv);
};

export const exportIssuesToXLSX = () => {
    const issuesData = [];
    const issueRows = document.querySelectorAll('.issue-item');

    if (issueRows.length === 0) {
        showToast('No issues to export.', 3000);
        return;
    }

    issueRows.forEach(row => {
        issuesData.push({
            "Issue Description": row.querySelector('.issue-desc').value,
            "Type": row.querySelector('.issue-type').value,
            "Interested Party": row.querySelector('.issue-party').value,
            "Date Identified": row.querySelector('.issue-date').value,
            "Risk/Opportunity": row.querySelector('.issue-riskopp').value,
            "Actions Taken": row.querySelector('.issue-actions').value,
            "Owner": row.querySelector('.issue-owner').value,
            "Status": row.querySelector('.issue-status').value,
        });
    });

    const worksheet = XLSX.utils.json_to_sheet(issuesData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Issues Register");

    // Auto-fit columns
    const colWidths = Object.keys(issuesData[0]).map(key => ({
        wch: Math.max(...issuesData.map(item => (item[key] || "").toString().length), key.length) + 2
    }));
    worksheet["!cols"] = colWidths;

    XLSX.writeFile(workbook, "ISO9001_Issues_Register.xlsx");
    showToast('Issues Register exported successfully!', 3000);
};
// Main application controller - coordinates all modules and handles events
import { agendaItems, createAgendaItemHTML } from './modules/agenda.js';
import { exportPestToXLSX, exportSwotToXLSX } from './modules/analyses.js';
import { addIssueRow, exportIssuesToXLSX } from './modules/issues.js';
import * as Lists from './modules/lists.js';
import { addActionItem, updateActionItemSummary } from './modules/actions.js';
import { saveData, loadData, exportToJSON, importFromJSON, exportToPPT } from './modules/storage.js';
import { exportAllToXLSX, exportToXML, importFromXML } from './modules/export.js';
import { showReleaseNotesModal } from './modules/modal.js';
import { exportToCSV, importFromCSV, exportToSingleCSV, importFromSingleCSV } from './modules/csv.js';
import { showToast } from './modules/ui.js';

// Add function to handle additional sign-offs
const addSignOffRow = (signoff = {}) => {
    const { name = '', date = '' } = signoff;
    const container = document.getElementById('additional-signoffs');
    
    const signoffDiv = document.createElement('div');
    signoffDiv.className = 'signoff-item';
    signoffDiv.innerHTML = `
        <button class="btn btn-danger btn-sm delete-signoff-btn" title="Remove Sign-off">×</button>
        <div class="mb-3">
            <label class="form-label"><strong>Attendee Name & Title</strong></label>
            <input type="text" class="form-control signoff-name" placeholder="Name and Title" value="${name}">
        </div>
        <div class="signature-box">
            <label class="form-label">Signature:</label>
            <div class="signature-line"></div>
        </div>
        <input type="date" class="form-control signoff-date" value="${date}">
    `;
    container.appendChild(signoffDiv);
};

// Theme management functions
const loadTheme = () => {
    const savedTheme = localStorage.getItem('selectedTheme') || 'default';
    applyTheme(savedTheme);
    updateThemeDropdown(savedTheme);
};

const applyTheme = (themeName) => {
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    if (themeName !== 'default') {
        document.body.classList.add(`theme-${themeName}`);
    }
};

const updateThemeDropdown = (selectedTheme) => {
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.theme === selectedTheme) {
            option.classList.add('active');
        }
    });
};

const saveTheme = (themeName) => {
    localStorage.setItem('selectedTheme', themeName);
    applyTheme(themeName);
    updateThemeDropdown(themeName);
};

document.addEventListener('DOMContentLoaded', () => {
    const agendaContainer = document.getElementById('management-review-agenda');
    const issuesContainer = document.getElementById('issues-container');

    // Initialize agenda
    agendaContainer.innerHTML = agendaItems.map(createAgendaItemHTML).join('');

    // Double-click to expand/collapse all sections
    agendaContainer.addEventListener('dblclick', (e) => {
        if (e.target.closest('.accordion-header') || e.target.closest('.accordion-button')) {
            e.preventDefault();
            e.stopPropagation();
            
            const allCollapses = agendaContainer.querySelectorAll('.accordion-collapse');
            const expandedCount = Array.from(allCollapses).filter(collapse => collapse.classList.contains('show')).length;
            
            // If all or most are expanded, collapse all; otherwise expand all
            const shouldExpand = expandedCount < allCollapses.length / 2;
            
            allCollapses.forEach(collapse => {
                const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapse, { toggle: false });
                if (shouldExpand) {
                    bsCollapse.show();
                } else {
                    bsCollapse.hide();
                }
            });
        }
    });

    // Event listeners for analyses
    document.getElementById('export-pest-btn').addEventListener('click', exportPestToXLSX);
    document.getElementById('export-swot-btn').addEventListener('click', exportSwotToXLSX);

    // Event listeners for issues register
    document.getElementById('add-issue-btn').addEventListener('click', () => addIssueRow());
    document.getElementById('export-issues-btn').addEventListener('click', exportIssuesToXLSX);

    // Issues container event delegation
    issuesContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-issue-btn')) {
            e.target.closest('.issue-item').remove();

            if (issuesContainer.children.length === 0) {
                 issuesContainer.innerHTML = `<p id="issues-placeholder" class="text-muted">No issues added yet. Click "+ Add Issue" to start building your register.</p>`;
            }
        }
    });

    // Agenda container event delegation
    agendaContainer.addEventListener('click', (e) => {
        if (e.target.closest('[contenteditable="true"]')) {
            e.stopImmediatePropagation();
        }

        if (e.target.classList.contains('add-action-item-btn')) {
            const containerId = e.target.dataset.targetContainer;
            const accordionItem = e.target.closest('.accordion-item');
            const agendaTitle = accordionItem.querySelector('.accordion-button span').textContent;
            const container = document.getElementById(containerId);
            addActionItem(container, { agendaTitle });
        }
        if (e.target.classList.contains('delete-action-item-btn')) {
            e.target.closest('.action-item').remove();
            updateActionItemSummary();
        }
        if (e.target.classList.contains('add-list-item-btn')) {
            const containerId = e.target.dataset.targetContainer;
            const listType = e.target.dataset.listType;
            const container = document.getElementById(containerId);
            if (listType === 'feedback') {
                Lists.addCustomerFeedbackRow(container);
            } else if (listType === 'objective') {
                Lists.addQualityObjectiveRow(container);
            } else if (listType === 'process') {
                Lists.addProcessPerformanceRow(container);
            } else if (listType === 'nonconformity') {
                Lists.addNonconformityRow(container);
            } else if (listType === 'kpi') {
                Lists.addKPIRow(container);
            } else if (listType === 'audit') {
                Lists.addAuditRow(container);
            } else if (listType === 'supplier') {
                Lists.addSupplierRow(container);
            } else if (listType === 'resource') {
                Lists.addResourceRow(container);
            } else if (listType === 'risk-opportunity') {
                Lists.addRiskOpportunityRow(container);
            } else if (listType === 'improvement') {
                Lists.addImprovementRow(container);
            }
        }
        if (e.target.classList.contains('delete-list-item-btn')) {
            e.target.closest('tr').remove();
        }
    });
    
    // Listen for any input changes to update summary in real-time
    document.getElementById('management-review-agenda').addEventListener('input', updateActionItemSummary);

    // Data persistence event listeners
    document.getElementById('save-progress').addEventListener('click', saveData);
    document.getElementById('finalize-print').addEventListener('click', () => {
        saveData();
        // Give a small delay to ensure data is saved before print dialog
        setTimeout(() => window.print(), 100);
    });
    document.getElementById('export-all-xlsx').addEventListener('click', exportAllToXLSX);
    document.getElementById('export-ppt').addEventListener('click', exportToPPT);
    document.getElementById('export-json').addEventListener('click', exportToJSON);
    document.getElementById('export-xml').addEventListener('click', exportToXML);
    document.getElementById('export-csv').addEventListener('click', exportToCSV);
    document.getElementById('export-single-csv').addEventListener('click', exportToSingleCSV);
    document.getElementById('import-json').addEventListener('click', () => {
        document.getElementById('import-json-file').click();
    });
    document.getElementById('import-xml').addEventListener('click', () => {
        document.getElementById('import-xml-file').click();
    });
    document.getElementById('import-xml-file').addEventListener('change', importFromXML);
    document.getElementById('import-json-file').addEventListener('change', importFromJSON);
    document.getElementById('import-csv').addEventListener('click', () => {
        document.getElementById('import-csv-file').click();
    });
    document.getElementById('import-csv-file').addEventListener('change', importFromCSV);
    document.getElementById('import-single-csv').addEventListener('click', () => {
        document.getElementById('import-single-csv-file').click();
    });
    document.getElementById('import-single-csv-file').addEventListener('change', importFromSingleCSV);
    document.getElementById('clear-data').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            localStorage.removeItem('managementReviewData');
            location.reload();
        }
    });

    // Release Notes modal
    document.getElementById('release-notes-btn').addEventListener('click', showReleaseNotesModal);

    // Add sign-off event listeners
    document.getElementById('add-signoff-btn').addEventListener('click', () => addSignOffRow());
    
    document.getElementById('additional-signoffs').addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-signoff-btn')) {
            e.target.closest('.signoff-item').remove();
        }
    });

    // Theme changer event listeners
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('theme-option')) {
            const themeName = e.target.dataset.theme;
            saveTheme(themeName);
            showToast(`Theme changed to: ${e.target.textContent}`, 2000);
        }
    });

    // Initial load
    loadData();
    loadTheme();
});
// CSV export and import functionality using JSZip
import { getCurrentData, loadFromData } from './storage.js';
import { showToast } from './ui.js';
import JSZip from 'jszip';

/**
 * Converts an array of objects to a CSV string.
 * @param {Array<Object>} dataArray The array of objects.
 * @returns {string} The CSV string.
 */
function toCSV(dataArray) {
    if (!dataArray || dataArray.length === 0) {
        return '';
    }
    const headers = Object.keys(dataArray[0]);
    const csvRows = [];

    // Add header row
    csvRows.push(headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','));

    // Add data rows
    for (const row of dataArray) {
        const values = headers.map(header => {
            const value = row[header];
            if (value === null || value === undefined) {
                return '';
            }
            const stringValue = String(value);
            // Escape double quotes and enclose in double quotes if it contains comma, newline or double quote
            if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
                return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
        });
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
}

/**
 * Parses a CSV string into an array of objects.
 * Handles quoted fields.
 * @param {string} csvString The CSV string to parse.
 * @returns {Array<Object>} The parsed data.
 */
function fromCSV(csvString) {
    if (!csvString) return [];

    const lines = csvString.trim().split('\n');
    if (lines.length < 1) return [];

    const rawHeaders = lines.shift();
    // Regex to split CSV headers, handling quoted headers with commas
    const headers = rawHeaders.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g).map(h => h.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
    
    const data = [];

    for (const line of lines) {
        if (!line.trim()) continue;

        const values = [];
        let currentField = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i+1];

            if (char === '"' && inQuotes && nextChar === '"') {
                currentField += '"';
                i++; // Skip next quote
            } else if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(currentField);
                currentField = '';
            } else {
                currentField += char;
            }
        }
        values.push(currentField);

        const obj = {};
        for (let i = 0; i < headers.length; i++) {
            obj[headers[i]] = values[i] || '';
        }
        data.push(obj);
    }
    return data;
}


export async function exportToCSV() {
    try {
        const data = getCurrentData();
        const zip = new JSZip();

        // 1. Details
        const detailsData = Object.entries(data.details).map(([key, value]) => ({ key, value }));
        zip.file('details.csv', toCSV(detailsData));

        // 2. PEST
        const pestData = [{}];
        Object.entries(data.pest).forEach(([key, value]) => {
            pestData[0][key] = value;
        });
        zip.file('pest.csv', toCSV(pestData));

        // 3. SWOT
        const swotData = [{}];
        Object.entries(data.swot).forEach(([key, value]) => {
            swotData[0][key] = value;
        });
        zip.file('swot.csv', toCSV(swotData));

        // 4. Issues
        if (data.issues.length > 0) {
            zip.file('issues.csv', toCSV(data.issues));
        }

        // 5. Agenda Notes and Lists
        const agendaNotes = [];
        const agendaListsFolder = zip.folder("agenda_lists");

        for (const agendaId in data.agenda) {
            const item = data.agenda[agendaId];
            if (item.minutes) {
                agendaNotes.push({ agenda_id: agendaId, minutes: item.minutes });
            }
            if (item.listItems && item.listItems.length > 0) {
                agendaListsFolder.file(`${agendaId}.csv`, toCSV(item.listItems));
            }
        }
        if (agendaNotes.length > 0) {
            zip.file('agenda_notes.csv', toCSV(agendaNotes));
        }
        
        // 6. Action Items
        const allActionItems = Object.values(data.agenda).flatMap(item => item.actionItems || [])
            .filter(item => item.task || item.owner || item.due);
        if (allActionItems.length > 0) {
            zip.file('action_items.csv', toCSV(allActionItems));
        }


        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ISO9001_Management_Review_CSV_${new Date().toISOString().split('T')[0]}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Data exported to CSV (ZIP) successfully!');
    } catch (error) {
        console.error("Error exporting to CSV:", error);
        showToast('Failed to export CSV data.', 5000);
    }
}

export function importFromCSV(event) {
    const file = event.target.files[0];
    if (!file) return;

    const zip = new JSZip();
    zip.loadAsync(file)
        .then(async (zip) => {
            const data = {
                details: {},
                pest: {},
                swot: {},
                issues: [],
                agenda: {}
            };

            // Helper to initialize agenda item
            const initAgenda = (id) => {
                if (!data.agenda[id]) {
                    data.agenda[id] = { minutes: '', actionItems: [], listItems: [] };
                }
            };

            for (const filename in zip.files) {
                const file = zip.files[filename];
                const content = await file.async("string");
                const parsedData = fromCSV(content);

                if (filename === 'details.csv') {
                    parsedData.forEach(row => { data.details[row.key] = row.value; });
                } else if (filename === 'pest.csv') {
                    data.pest = parsedData[0] || {};
                } else if (filename === 'swot.csv') {
                    data.swot = parsedData[0] || {};
                } else if (filename === 'issues.csv') {
                    data.issues = parsedData;
                } else if (filename === 'action_items.csv') {
                    parsedData.forEach(action => {
                        const agendaTitle = action.agendaTitle;
                        // Find the right agenda item to attach to. This is imperfect but best effort.
                        const itemEl = Array.from(document.querySelectorAll('.add-action-item-btn')).find(btn => btn.dataset.agendaTitle === agendaTitle);
                        if (itemEl) {
                           const kebabCaseId = itemEl.dataset.targetContainer.replace('action-items-container-', '');
                           initAgenda(kebabCaseId);
                           data.agenda[kebabCaseId].actionItems.push(action);
                        }
                    });
                } else if (filename === 'agenda_notes.csv') {
                    parsedData.forEach(note => {
                        initAgenda(note.agenda_id);
                        data.agenda[note.agenda_id].minutes = note.minutes;
                    });
                } else if (filename.startsWith('agenda_lists/')) {
                    const agendaId = filename.replace('agenda_lists/', '').replace('.csv', '');
                    initAgenda(agendaId);
                    data.agenda[agendaId].listItems = parsedData;
                }
            }
            
            loadFromData(data);
            showToast('Data imported from CSV (ZIP) successfully!');
        })
        .catch(error => {
            console.error("Error importing from CSV:", error);
            showToast('Failed to import CSV file. Please check format.', 5000);
        });

    // Reset file input
    event.target.value = '';
}


// --- SINGLE CSV EXPORT/IMPORT ---

function toSingleCSV(data) {
    const allRows = [];
    const allHeaders = new Set(['type', 'key']);

    // Process all data into a standardized row format
    // Details & Titles
    Object.entries(data.details).forEach(([key, value]) => allRows.push({ type: 'details', key, value }));
    Object.entries(data.pageTitles).forEach(([key, value]) => allRows.push({ type: 'pageTitles', key, value }));

    // PEST & SWOT
    Object.entries(data.pest).forEach(([key, value]) => allRows.push({ type: 'pest', key, value }));
    Object.entries(data.swot).forEach(([key, value]) => allRows.push({ type: 'swot', key, value }));

    // Issues
    data.issues.forEach(item => {
        Object.keys(item).forEach(h => allHeaders.add(h));
        allRows.push({ type: 'issue', ...item });
    });

    // Agenda items (minutes, lists, actions)
    for (const agendaId in data.agenda) {
        const item = data.agenda[agendaId];
        if (item.minutes) {
            allRows.push({ type: 'agenda_minutes', key: agendaId, value: item.minutes, title: item.title });
            allHeaders.add('value').add('title');
        }
        item.listItems?.forEach(listItem => {
            Object.keys(listItem).forEach(h => allHeaders.add(h));
            allRows.push({ type: `list_${agendaId}`, ...listItem });
        });
        item.actionItems?.forEach(actionItem => {
            Object.keys(actionItem).forEach(h => allHeaders.add(h));
            allRows.push({ type: 'action_item', ...actionItem });
        });
    }
    
    const headerArray = Array.from(allHeaders);
    const csvRows = [headerArray.map(h => `"${h.replace(/"/g, '""')}"`).join(',')];

    for (const row of allRows) {
        const values = headerArray.map(header => {
            const value = row[header] ?? '';
            const stringValue = String(value);
            if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
                return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
        });
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
}

export function exportToSingleCSV() {
    try {
        const data = getCurrentData();
        const csvContent = toSingleCSV(data);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ISO9001_Management_Review_Single_File_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Data exported to single CSV file successfully!');
    } catch (error) {
        console.error("Error exporting to single CSV:", error);
        showToast('Failed to export single CSV file.', 5000);
    }
}

export function importFromSingleCSV(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const csvContent = e.target.result;
            const parsedRows = fromCSV(csvContent);
            const data = {
                details: {}, pageTitles: {}, pest: {}, swot: {}, issues: [], agenda: {}
            };

            const initAgenda = (id) => {
                if (!data.agenda[id]) {
                    data.agenda[id] = { minutes: '', listItems: [], actionItems: [] };
                }
            };
            
            parsedRows.forEach(row => {
                const { type, key, value, ...rest } = row;
                
                if (type === 'details') data.details[key] = value;
                else if (type === 'pageTitles') data.pageTitles[key] = value;
                else if (type === 'pest') data.pest[key] = value;
                else if (type === 'swot') data.swot[key] = value;
                else if (type === 'issue') data.issues.push(rest);
                else if (type === 'action_item') {
                    const agendaTitle = rest.agendaTitle;
                     // Find the right agenda item to attach to.
                    const itemEl = Array.from(document.querySelectorAll('.accordion-button span')).find(span => span.textContent === agendaTitle);
                    if (itemEl) {
                        const kebabCaseId = itemEl.closest('.accordion-item').id.replace('item-', '');
                        initAgenda(kebabCaseId);
                        data.agenda[kebabCaseId].actionItems.push(rest);
                    }
                } else if (type === 'agenda_minutes') {
                    initAgenda(key);
                    data.agenda[key].minutes = value;
                    data.agenda[key].title = rest.title;
                } else if (type && type.startsWith('list_')) {
                    const agendaId = type.replace('list_', '');
                    initAgenda(agendaId);
                    data.agenda[agendaId].listItems.push(rest);
                }
            });

            loadFromData(data);
            showToast('Data imported from single CSV file successfully!');

        } catch (error) {
            console.error("Error importing from single CSV:", error);
            showToast('Failed to import single CSV file. Please check format.', 5000);
        }
    };
    reader.readAsText(file);

    // Reset file input
    event.target.value = '';
}
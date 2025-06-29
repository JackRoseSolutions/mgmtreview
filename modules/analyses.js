// PEST and SWOT analysis functions
import { showToast } from './ui.js';

export const exportPestToXLSX = () => {
    const p = document.getElementById('pest-political').value.split('\n').filter(Boolean);
    const e = document.getElementById('pest-economic').value.split('\n').filter(Boolean);
    const s = document.getElementById('pest-social').value.split('\n').filter(Boolean);
    const t = document.getElementById('pest-technological').value.split('\n').filter(Boolean);

    if (p.length === 0 && e.length === 0 && s.length === 0 && t.length === 0) {
        showToast('No PEST data to export.', 3000);
        return;
    }

    const maxRows = Math.max(p.length, e.length, s.length, t.length);
    const data = [];
    for (let i = 0; i < maxRows; i++) {
        data.push({
            'Political': p[i] || '',
            'Economic': e[i] || '',
            'Social': s[i] || '',
            'Technological': t[i] || '',
        });
    }
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PEST Analysis");

    worksheet["!cols"] = [ { wch: 40 }, { wch: 40 }, { wch: 40 }, { wch: 40 } ];
    XLSX.writeFile(workbook, "PEST_Analysis.xlsx");
    showToast('PEST Analysis exported successfully!', 3000);
};

export const exportSwotToXLSX = () => {
    const s = document.getElementById('swot-strengths').value.split('\n').filter(Boolean);
    const w = document.getElementById('swot-weaknesses').value.split('\n').filter(Boolean);
    const o = document.getElementById('swot-opportunities').value.split('\n').filter(Boolean);
    const t = document.getElementById('swot-threats').value.split('\n').filter(Boolean);

    if (s.length === 0 && w.length === 0 && o.length === 0 && t.length === 0) {
        showToast('No SWOT data to export.', 3000);
        return;
    }

    const maxRows = Math.max(s.length, w.length, o.length, t.length);
    const data = [];
    for (let i = 0; i < maxRows; i++) {
        data.push({
            'Strengths': s[i] || '',
            'Weaknesses': w[i] || '',
            'Opportunities': o[i] || '',
            'Threats': t[i] || '',
        });
    }
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SWOT Analysis");

    worksheet["!cols"] = [ { wch: 40 }, { wch: 40 }, { wch: 40 }, { wch: 40 } ];
    XLSX.writeFile(workbook, "SWOT_Analysis.xlsx");
    showToast('SWOT Analysis exported successfully!', 3000);
};


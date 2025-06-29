// Action item management
export const addActionItem = (container, item = {}) => {
    const { task = '', owner = '', due = '', status = 'Open', agendaTitle = '' } = item;
    const actionItemDiv = document.createElement('div');
    actionItemDiv.className = `action-item status-${status.toLowerCase().replace(' ', '-')}`;
    actionItemDiv.dataset.agendaTitle = agendaTitle;
    actionItemDiv.innerHTML = `
        <input type="text" class="form-control form-control-sm task" placeholder="Action Required" value="${task}">
        <input type="text" class="form-control form-control-sm owner" placeholder="Assigned To" value="${owner}">
        <input type="date" class="form-control form-control-sm due" value="${due}">
        <select class="form-select form-select-sm status">
            <option ${status === 'Open' ? 'selected' : ''}>Open</option>
            <option ${status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option ${status === 'Completed' ? 'selected' : ''}>Completed</option>
        </select>
        <button class="btn btn-danger btn-sm delete-action-item-btn" title="Remove Item">×</button>
    `;
    
    actionItemDiv.querySelector('.status').addEventListener('change', (e) => {
        actionItemDiv.className = `action-item status-${e.target.value.toLowerCase().replace(' ', '-')}`;
        updateActionItemSummary();
    });

    container.appendChild(actionItemDiv);
    updateActionItemSummary();
};

export const updateActionItemSummary = () => {
    const summaryContainer = document.getElementById('action-item-summary-container');
    const placeholder = document.getElementById('summary-placeholder');
    const countBadge = document.getElementById('action-item-count');
    summaryContainer.innerHTML = '';
    
    const allActionItems = [];
    document.querySelectorAll('.action-item').forEach(actionEl => {
         allActionItems.push({
            task: actionEl.querySelector('.task').value,
            owner: actionEl.querySelector('.owner').value,
            due: actionEl.querySelector('.due').value,
            status: actionEl.querySelector('.status').value,
            agendaTitle: actionEl.dataset.agendaTitle
         });
    });

    countBadge.textContent = allActionItems.length;

    if (allActionItems.length === 0) {
        placeholder.style.display = 'block';
        return;
    }
    
    placeholder.style.display = 'none';
    
    const table = document.createElement('table');
    table.className = 'table table-sm table-hover summary-table';
    table.innerHTML = `
        <thead>
            <tr>
                <th>Status</th>
                <th>Action Task</th>
                <th>Assigned To</th>
                <th>Due Date</th>
                <th>Source Agenda</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    const tbody = table.querySelector('tbody');

    allActionItems.sort((a, b) => { // Sort by status, then due date
        const statusOrder = { 'Open': 0, 'In Progress': 1, 'Completed': 2 };
        if (statusOrder[a.status] !== statusOrder[b.status]) {
            return statusOrder[a.status] - statusOrder[b.status];
        }
        return (a.due || '').localeCompare(b.due || '');
    }).forEach(item => {
        const statusClass = item.status.toLowerCase().replace(' ', '-');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><span class="badge status-badge status-${statusClass}">${item.status}</span></td>
            <td>${item.task || 'N/A'}</td>
            <td>${item.owner || 'N/A'}</td>
            <td>${item.due || 'N/A'}</td>
            <td>${item.agendaTitle || 'N/A'}</td>
        `;
        tbody.appendChild(row);
    });
    
    summaryContainer.appendChild(table);
};
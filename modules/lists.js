// Dynamic list management for various tables
export const addCustomerFeedbackRow = (container, item = {}) => {
    const { source = '', summary = '', date = '', status = 'Open' } = item;
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" class="form-control form-control-sm" data-field="source" value="${source}" placeholder="e.g., Survey, Complaint"></td>
        <td><textarea class="form-control form-control-sm" data-field="summary" rows="1" placeholder="Summary of feedback">${summary}</textarea></td>
        <td><input type="date" class="form-control form-control-sm" data-field="date" value="${date}"></td>
        <td>
            <select class="form-select form-select-sm" data-field="status">
                <option ${status === 'Open' ? 'selected' : ''}>Open</option>
                <option ${status === 'Under Review' ? 'selected' : ''}>Under Review</option>
                <option ${status === 'Closed' ? 'selected' : ''}>Closed</option>
            </select>
        </td>
        <td class="d-print-none"><button class="btn btn-danger btn-sm delete-list-item-btn" title="Remove Row">×</button></td>
    `;
    container.appendChild(row);
};

export const addQualityObjectiveRow = (container, item = {}) => {
    const { objective = '', target = '', actual = '', status = 'On Track', comments = '' } = item;
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><textarea class="form-control form-control-sm" data-field="objective" rows="1" placeholder="e.g., Reduce defects by 5%">${objective}</textarea></td>
        <td><input type="text" class="form-control form-control-sm" data-field="target" value="${target}" placeholder="e.g., < 1% defect rate"></td>
        <td><input type="text" class="form-control form-control-sm" data-field="actual" value="${actual}" placeholder="e.g., 0.8% defect rate"></td>
        <td>
            <select class="form-select form-select-sm" data-field="status">
                <option ${status === 'On Track' ? 'selected' : ''}>On Track</option>
                <option ${status === 'Met' ? 'selected' : ''}>Met</option>
                <option ${status === 'Not Met' ? 'selected' : ''}>Not Met</option>
            </select>
        </td>
        <td><textarea class="form-control form-control-sm" data-field="comments" rows="1">${comments}</textarea></td>
        <td class="d-print-none"><button class="btn btn-danger btn-sm delete-list-item-btn" title="Remove Row">×</button></td>
    `;
    container.appendChild(row);
};

export const addProcessPerformanceRow = (container, item = {}) => {
    const { process = '', kpi = '', target = '', actual = '', status = 'Conforming', comments = '' } = item;
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" class="form-control form-control-sm" data-field="process" value="${process}" placeholder="Process/Product Name"></td>
        <td><input type="text" class="form-control form-control-sm" data-field="kpi" value="${kpi}" placeholder="e.g., On-time delivery"></td>
        <td><input type="text" class="form-control form-control-sm" data-field="target" value="${target}" placeholder="e.g., >98%"></td>
        <td><input type="text" class="form-control form-control-sm" data-field="actual" value="${actual}" placeholder="e.g., 99%"></td>
        <td>
            <select class="form-select form-select-sm" data-field="status">
                <option ${status === 'Conforming' ? 'selected' : ''}>Conforming</option>
                <option ${status === 'Needs Improvement' ? 'selected' : ''}>Needs Improvement</option>
                <option ${status === 'At Risk' ? 'selected' : ''}>At Risk</option>
            </select>
        </td>
        <td><textarea class="form-control form-control-sm" data-field="comments" rows="1">${comments}</textarea></td>
        <td class="d-print-none"><button class="btn btn-danger btn-sm delete-list-item-btn" title="Remove Row">×</button></td>
    `;
    container.appendChild(row);
};

export const addNonconformityRow = (container, item = {}) => {
    const { ref = '', desc = '', source = '', date = '', action = '', owner = '', status = 'Open' } = item;
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" class="form-control form-control-sm" data-field="ref" value="${ref}" placeholder="e.g., NC-2024-001"></td>
        <td><textarea class="form-control form-control-sm" data-field="desc" rows="1">${desc}</textarea></td>
        <td><input type="text" class="form-control form-control-sm" data-field="source" value="${source}" placeholder="e.g., Internal Audit"></td>
        <td><input type="date" class="form-control form-control-sm" data-field="date" value="${date}"></td>
        <td><textarea class="form-control form-control-sm" data-field="action" rows="1">${action}</textarea></td>
        <td><input type="text" class="form-control form-control-sm" data-field="owner" value="${owner}"></td>
        <td>
            <select class="form-select form-select-sm" data-field="status">
                <option ${status === 'Open' ? 'selected' : ''}>Open</option>
                <option ${status === 'Closed' ? 'selected' : ''}>Closed</option>
                <option ${status === 'Verification Pending' ? 'selected' : ''}>Verification Pending</option>
            </select>
        </td>
        <td class="d-print-none"><button class="btn btn-danger btn-sm delete-list-item-btn" title="Remove Row">×</button></td>
    `;
    container.appendChild(row);
};

export const addKPIRow = (container, item = {}) => {
    const { name = '', frequency = '', target = '', result = '', trend = 'Stable', comments = '' } = item;
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" class="form-control form-control-sm" data-field="name" value="${name}" placeholder="e.g., Customer Satisfaction"></td>
        <td>
            <select class="form-select form-select-sm" data-field="frequency">
                <option ${frequency === 'Daily' ? 'selected' : ''}>Daily</option>
                <option ${frequency === 'Weekly' ? 'selected' : ''}>Weekly</option>
                <option ${frequency === 'Monthly' ? 'selected' : ''}>Monthly</option>
                <option ${frequency === 'Quarterly' ? 'selected' : ''}>Quarterly</option>
                <option ${frequency === 'Annually' ? 'selected' : ''}>Annually</option>
            </select>
        </td>
        <td><input type="text" class="form-control form-control-sm" data-field="target" value="${target}" placeholder="e.g., >95%"></td>
        <td><input type="text" class="form-control form-control-sm" data-field="result" value="${result}" placeholder="e.g., 97%"></td>
        <td>
            <select class="form-select form-select-sm" data-field="trend">
                <option ${trend === 'Improving' ? 'selected' : ''}>Improving</option>
                <option ${trend === 'Stable' ? 'selected' : ''}>Stable</option>
                <option ${trend === 'Declining' ? 'selected' : ''}>Declining</option>
            </select>
        </td>
        <td><textarea class="form-control form-control-sm" data-field="comments" rows="1">${comments}</textarea></td>
        <td class="d-print-none"><button class="btn btn-danger btn-sm delete-list-item-btn" title="Remove Row">×</button></td>
    `;
    container.appendChild(row);
};

export const addAuditRow = (container, item = {}) => {
    const { type = '', date = '', auditor = '', scope = '', findings = '', status = 'Complete', actions = '' } = item;
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <select class="form-select form-select-sm" data-field="type">
                <option ${type === 'Internal' ? 'selected' : ''}>Internal</option>
                <option ${type === 'External' ? 'selected' : ''}>External</option>
                <option ${type === 'Certification' ? 'selected' : ''}>Certification</option>
                <option ${type === 'Surveillance' ? 'selected' : ''}>Surveillance</option>
            </select>
        </td>
        <td><input type="date" class="form-control form-control-sm" data-field="date" value="${date}"></td>
        <td><input type="text" class="form-control form-control-sm" data-field="auditor" value="${auditor}" placeholder="Auditor/Cert Body"></td>
        <td><input type="text" class="form-control form-control-sm" data-field="scope" value="${scope}" placeholder="Audit scope"></td>
        <td><textarea class="form-control form-control-sm" data-field="findings" rows="1">${findings}</textarea></td>
        <td>
            <select class="form-select form-select-sm" data-field="status">
                <option ${status === 'Complete' ? 'selected' : ''}>Complete</option>
                <option ${status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                <option ${status === 'Planned' ? 'selected' : ''}>Planned</option>
            </select>
        </td>
        <td><textarea class="form-control form-control-sm" data-field="actions" rows="1">${actions}</textarea></td>
        <td class="d-print-none"><button class="btn btn-danger btn-sm delete-list-item-btn" title="Remove Row">×</button></td>
    `;
    container.appendChild(row);
};

export const addSupplierRow = (container, item = {}) => {
    const { name = '', service = '', metric = '', rating = 'Satisfactory', issues = '', action = '' } = item;
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" class="form-control form-control-sm" data-field="name" value="${name}" placeholder="Supplier name"></td>
        <td><input type="text" class="form-control form-control-sm" data-field="service" value="${service}" placeholder="Product/Service"></td>
        <td><input type="text" class="form-control form-control-sm" data-field="metric" value="${metric}" placeholder="e.g., On-time delivery"></td>
        <td>
            <select class="form-select form-select-sm" data-field="rating">
                <option ${rating === 'Excellent' ? 'selected' : ''}>Excellent</option>
                <option ${rating === 'Satisfactory' ? 'selected' : ''}>Satisfactory</option>
                <option ${rating === 'Needs Improvement' ? 'selected' : ''}>Needs Improvement</option>
                <option ${rating === 'Unsatisfactory' ? 'selected' : ''}>Unsatisfactory</option>
            </select>
        </td>
        <td><textarea class="form-control form-control-sm" data-field="issues" rows="1">${issues}</textarea></td>
        <td><textarea class="form-control form-control-sm" data-field="action" rows="1">${action}</textarea></td>
        <td class="d-print-none"><button class="btn btn-danger btn-sm delete-list-item-btn" title="Remove Row">×</button></td>
    `;
    container.appendChild(row);
};

export const addResourceRow = (container, item = {}) => {
    const { type = '', status = '', requirements = '', gap = '', priority = 'Medium', plan = '' } = item;
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <select class="form-select form-select-sm" data-field="type">
                <option ${type === 'Human Resources' ? 'selected' : ''}>Human Resources</option>
                <option ${type === 'Equipment' ? 'selected' : ''}>Equipment</option>
                <option ${type === 'Infrastructure' ? 'selected' : ''}>Infrastructure</option>
                <option ${type === 'Financial' ? 'selected' : ''}>Financial</option>
                <option ${type === 'Technology' ? 'selected' : ''}>Technology</option>
            </select>
        </td>
        <td><textarea class="form-control form-control-sm" data-field="status" rows="1">${status}</textarea></td>
        <td><textarea class="form-control form-control-sm" data-field="requirements" rows="1">${requirements}</textarea></td>
        <td><textarea class="form-control form-control-sm" data-field="gap" rows="1">${gap}</textarea></td>
        <td>
            <select class="form-select form-select-sm" data-field="priority">
                <option ${priority === 'High' ? 'selected' : ''}>High</option>
                <option ${priority === 'Medium' ? 'selected' : ''}>Medium</option>
                <option ${priority === 'Low' ? 'selected' : ''}>Low</option>
            </select>
        </td>
        <td><textarea class="form-control form-control-sm" data-field="plan" rows="1">${plan}</textarea></td>
        <td class="d-print-none"><button class="btn btn-danger btn-sm delete-list-item-btn" title="Remove Row">×</button></td>
    `;
    container.appendChild(row);
};

export const addRiskOpportunityRow = (container, item = {}) => {
    const { risk = '', action = '', expected = '', actual = '', effectiveness = 'Effective', next = '' } = item;
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><textarea class="form-control form-control-sm" data-field="risk" rows="1">${risk}</textarea></td>
        <td><textarea class="form-control form-control-sm" data-field="action" rows="1">${action}</textarea></td>
        <td><textarea class="form-control form-control-sm" data-field="expected" rows="1">${expected}</textarea></td>
        <td><textarea class="form-control form-control-sm" data-field="actual" rows="1">${actual}</textarea></td>
        <td>
            <select class="form-select form-select-sm" data-field="effectiveness">
                <option ${effectiveness === 'Highly Effective' ? 'selected' : ''}>Highly Effective</option>
                <option ${effectiveness === 'Effective' ? 'selected' : ''}>Effective</option>
                <option ${effectiveness === 'Partially Effective' ? 'selected' : ''}>Partially Effective</option>
                <option ${effectiveness === 'Not Effective' ? 'selected' : ''}>Not Effective</option>
            </select>
        </td>
        <td><textarea class="form-control form-control-sm" data-field="next" rows="1">${next}</textarea></td>
        <td class="d-print-none"><button class="btn btn-danger btn-sm delete-list-item-btn" title="Remove Row">×</button></td>
    `;
    container.appendChild(row);
};

export const addImprovementRow = (container, item = {}) => {
    const { area = '', current = '', proposed = '', benefits = '', priority = 'Medium', owner = '', timeline = '' } = item;
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" class="form-control form-control-sm" data-field="area" value="${area}" placeholder="Process/Area"></td>
        <td><textarea class="form-control form-control-sm" data-field="current" rows="1">${current}</textarea></td>
        <td><textarea class="form-control form-control-sm" data-field="proposed" rows="1">${proposed}</textarea></td>
        <td><textarea class="form-control form-control-sm" data-field="benefits" rows="1">${benefits}</textarea></td>
        <td>
            <select class="form-select form-select-sm" data-field="priority">
                <option ${priority === 'High' ? 'selected' : ''}>High</option>
                <option ${priority === 'Medium' ? 'selected' : ''}>Medium</option>
                <option ${priority === 'Low' ? 'selected' : ''}>Low</option>
            </select>
        </td>
        <td><input type="text" class="form-control form-control-sm" data-field="owner" value="${owner}"></td>
        <td><input type="text" class="form-control form-control-sm" data-field="timeline" value="${timeline}" placeholder="e.g., Q2 2024"></td>
        <td class="d-print-none"><button class="btn btn-danger btn-sm delete-list-item-btn" title="Remove Row">×</button></td>
    `;
    container.appendChild(row);
};


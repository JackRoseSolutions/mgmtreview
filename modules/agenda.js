// Agenda item creation and management module
export const agendaItems = [
    "Status of Actions from Previous Management Reviews",
    "Changes in External & Internal Issues",
    "Performance & Effectiveness of the QMS",
    "Customer Satisfaction & Feedback",
    "Achievement of Quality Objectives (Global)",
    "Achievement of Quality Objectives (Local)",
    "Process Performance & Product/Service Conformity",
    "Nonconformities & Corrective Actions",
    "Monitoring & Measurement Results (KPIs)",
    "Internal & External Audit Results",
    "Performance of External Providers (Suppliers)",
    "Adequacy of Resources",
    "Effectiveness of Actions Taken to Address Risks & Opportunities",
    "Opportunities for Improvement"
];

export const createAgendaItemHTML = (item, index) => {
    const kebabCaseId = item.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    let specialContent = '';

    if (item === "Customer Satisfaction & Feedback") {
        specialContent = `
            <div class="dynamic-list-container mt-4">
                <label class="form-label"><strong>Feedback Register</strong></label>
                <div class="table-responsive">
                    <table class="table table-bordered table-sm">
                        <thead>
                            <tr>
                                <th>Feedback Source</th>
                                <th>Summary</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th class="d-print-none"></th>
                            </tr>
                        </thead>
                        <tbody id="list-container-${kebabCaseId}"></tbody>
                    </table>
                </div>
                <button class="btn btn-outline-secondary btn-sm add-list-item-btn" data-list-type="feedback" data-target-container="list-container-${kebabCaseId}">+ Add Feedback</button>
            </div>
        `;
    }

    if (item === "Achievement of Quality Objectives (Global)" || item === "Achievement of Quality Objectives (Local)") {
        specialContent = `
            <div class="dynamic-list-container mt-4">
                <label class="form-label"><strong>Objectives Register</strong></label>
                 <div class="table-responsive">
                    <table class="table table-bordered table-sm">
                        <thead>
                            <tr>
                                <th style="width: 30%;">Objective</th>
                                <th style="width: 20%;">Target</th>
                                <th style="width: 20%;">Actual Performance</th>
                                <th style="width: 15%;">Status</th>
                                <th style="width: 15%;">Comments</th>
                                <th class="d-print-none"></th>
                            </tr>
                        </thead>
                        <tbody id="list-container-${kebabCaseId}"></tbody>
                    </table>
                </div>
                <button class="btn btn-outline-secondary btn-sm add-list-item-btn" data-list-type="objective" data-target-container="list-container-${kebabCaseId}">+ Add Objective</button>
            </div>
        `;
    }

    if (item === "Process Performance & Product/Service Conformity") {
        specialContent = `
            <div class="dynamic-list-container mt-4">
                <label class="form-label"><strong>Process Performance Register</strong></label>
                 <div class="table-responsive">
                    <table class="table table-bordered table-sm">
                        <thead>
                            <tr>
                                <th style="width: 20%;">Process/Product</th>
                                <th style="width: 20%;">Metric/KPI</th>
                                <th style="width: 15%;">Target</th>
                                <th style="width: 15%;">Actual</th>
                                <th style="width: 10%;">Status</th>
                                <th style="width: 20%;">Comments</th>
                                <th class="d-print-none"></th>
                            </tr>
                        </thead>
                        <tbody id="list-container-${kebabCaseId}"></tbody>
                    </table>
                </div>
                <button class="btn btn-outline-secondary btn-sm add-list-item-btn" data-list-type="process" data-target-container="list-container-${kebabCaseId}">+ Add Process</button>
            </div>
        `;
    }
    
    if (item === "Nonconformities & Corrective Actions") {
        specialContent = `
            <div class="dynamic-list-container mt-4">
                <label class="form-label"><strong>Nonconformity Register</strong></label>
                 <div class="table-responsive">
                    <table class="table table-bordered table-sm">
                        <thead>
                            <tr>
                                <th>NC Ref #</th>
                                <th>Description</th>
                                <th>Source</th>
                                <th>Date</th>
                                <th>Corrective Action</th>
                                <th>Owner</th>
                                <th>Status</th>
                                <th class="d-print-none"></th>
                            </tr>
                        </thead>
                        <tbody id="list-container-${kebabCaseId}"></tbody>
                    </table>
                </div>
                <button class="btn btn-outline-secondary btn-sm add-list-item-btn" data-list-type="nonconformity" data-target-container="list-container-${kebabCaseId}">+ Add Nonconformity</button>
            </div>
        `;
    }

    if (item === "Monitoring & Measurement Results (KPIs)") {
        specialContent = `
            <div class="dynamic-list-container mt-4">
                <label class="form-label"><strong>KPI Performance Register</strong></label>
                 <div class="table-responsive">
                    <table class="table table-bordered table-sm">
                        <thead>
                            <tr>
                                <th style="width: 25%;">KPI Name</th>
                                <th style="width: 15%;">Frequency</th>
                                <th style="width: 15%;">Target</th>
                                <th style="width: 15%;">Current Result</th>
                                <th style="width: 10%;">Trend</th>
                                <th style="width: 20%;">Comments</th>
                                <th class="d-print-none"></th>
                            </tr>
                        </thead>
                        <tbody id="list-container-${kebabCaseId}"></tbody>
                    </table>
                </div>
                <button class="btn btn-outline-secondary btn-sm add-list-item-btn" data-list-type="kpi" data-target-container="list-container-${kebabCaseId}">+ Add KPI</button>
            </div>
        `;
    }

    if (item === "Internal & External Audit Results") {
        specialContent = `
            <div class="dynamic-list-container mt-4">
                <label class="form-label"><strong>Audit Results Register</strong></label>
                 <div class="table-responsive">
                    <table class="table table-bordered table-sm">
                        <thead>
                            <tr>
                                <th>Audit Type</th>
                                <th>Audit Date</th>
                                <th>Auditor/Body</th>
                                <th>Scope</th>
                                <th>Key Findings</th>
                                <th>Status</th>
                                <th>Follow-up Actions</th>
                                <th class="d-print-none"></th>
                            </tr>
                        </thead>
                        <tbody id="list-container-${kebabCaseId}"></tbody>
                    </table>
                </div>
                <button class="btn btn-outline-secondary btn-sm add-list-item-btn" data-list-type="audit" data-target-container="list-container-${kebabCaseId}">+ Add Audit</button>
            </div>
        `;
    }

    if (item === "Performance of External Providers (Suppliers)") {
        specialContent = `
            <div class="dynamic-list-container mt-4">
                <label class="form-label"><strong>Supplier Performance Register</strong></label>
                 <div class="table-responsive">
                    <table class="table table-bordered table-sm">
                        <thead>
                            <tr>
                                <th>Supplier Name</th>
                                <th>Product/Service</th>
                                <th>Performance Metric</th>
                                <th>Rating</th>
                                <th>Issues</th>
                                <th>Action Required</th>
                                <th class="d-print-none"></th>
                            </tr>
                        </thead>
                        <tbody id="list-container-${kebabCaseId}"></tbody>
                    </table>
                </div>
                <button class="btn btn-outline-secondary btn-sm add-list-item-btn" data-list-type="supplier" data-target-container="list-container-${kebabCaseId}">+ Add Supplier</button>
            </div>
        `;
    }

    if (item === "Adequacy of Resources") {
        specialContent = `
            <div class="dynamic-list-container mt-4">
                <label class="form-label"><strong>Resource Requirements Register</strong></label>
                 <div class="table-responsive">
                    <table class="table table-bordered table-sm">
                        <thead>
                            <tr>
                                <th>Resource Type</th>
                                <th>Current Status</th>
                                <th>Requirements</th>
                                <th>Gap Analysis</th>
                                <th>Priority</th>
                                <th>Action Plan</th>
                                <th class="d-print-none"></th>
                            </tr>
                        </thead>
                        <tbody id="list-container-${kebabCaseId}"></tbody>
                    </table>
                </div>
                <button class="btn btn-outline-secondary btn-sm add-list-item-btn" data-list-type="resource" data-target-container="list-container-${kebabCaseId}">+ Add Resource</button>
            </div>
        `;
    }

    if (item === "Effectiveness of Actions Taken to Address Risks & Opportunities") {
        specialContent = `
            <div class="dynamic-list-container mt-4">
                <label class="form-label"><strong>Risk & Opportunity Actions Register</strong></label>
                 <div class="table-responsive">
                    <table class="table table-bordered table-sm">
                        <thead>
                            <tr>
                                <th>Risk/Opportunity</th>
                                <th>Action Taken</th>
                                <th>Expected Outcome</th>
                                <th>Actual Result</th>
                                <th>Effectiveness</th>
                                <th>Next Steps</th>
                                <th class="d-print-none"></th>
                            </tr>
                        </thead>
                        <tbody id="list-container-${kebabCaseId}"></tbody>
                    </table>
                </div>
                <button class="btn btn-outline-secondary btn-sm add-list-item-btn" data-list-type="risk-opportunity" data-target-container="list-container-${kebabCaseId}">+ Add Action</button>
            </div>
        `;
    }

    if (item === "Opportunities for Improvement") {
        specialContent = `
            <div class="dynamic-list-container mt-4">
                <label class="form-label"><strong>Improvement Opportunities Register</strong></label>
                 <div class="table-responsive">
                    <table class="table table-bordered table-sm">
                        <thead>
                            <tr>
                                <th>Improvement Area</th>
                                <th>Current State</th>
                                <th>Proposed Improvement</th>
                                <th>Benefits</th>
                                <th>Priority</th>
                                <th>Proposed Owner</th>
                                <th>Timeline</th>
                                <th class="d-print-none"></th>
                            </tr>
                        </thead>
                        <tbody id="list-container-${kebabCaseId}"></tbody>
                    </table>
                </div>
                <button class="btn btn-outline-secondary btn-sm add-list-item-btn" data-list-type="improvement" data-target-container="list-container-${kebabCaseId}">+ Add Opportunity</button>
            </div>
        `;
    }

    return `
        <div class="accordion-item" id="item-${kebabCaseId}">
            <h2 class="accordion-header" id="heading-${kebabCaseId}">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${kebabCaseId}" aria-expanded="false" aria-controls="collapse-${kebabCaseId}">
                    <span contenteditable="true">${index + 1}. ${item}</span>
                </button>
            </h2>
            <div id="collapse-${kebabCaseId}" class="accordion-collapse collapse" aria-labelledby="heading-${kebabCaseId}" data-bs-parent="#management-review-agenda">
                <div class="accordion-body">
                    <div class="mb-3">
                        <label for="minutes-${kebabCaseId}" class="form-label"><strong>Minutes & Notes</strong></label>
                        <textarea class="form-control" id="minutes-${kebabCaseId}" rows="5" placeholder="Record discussion points, decisions, and observations here..."></textarea>
                    </div>
                    ${specialContent}
                    <div class="mt-4">
                        <label class="form-label"><strong>Action Items</strong></label>
                        <div id="action-items-container-${kebabCaseId}" class="mb-2"></div>
                        <button class="btn btn-outline-secondary btn-sm add-action-item-btn" data-target-container="action-items-container-${kebabCaseId}">+ Add Action Item</button>
                    </div>
                </div>
            </div>
        </div>
    `;
};
// This module handles the creation and display of the Release Notes modal.

const MODAL_ID = 'releaseNotesModal';

const modalHTML = `
<div class="modal fade" id="${MODAL_ID}" tabindex="-1" aria-labelledby="releaseNotesModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="releaseNotesModalLabel">📋 ISO 9001:2015 Management Review - Features & Functionality</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="mb-4">
                    <h6 class="text-primary">🎯 Core Features</h6>
                    <ul class="list-unstyled ms-3">
                        <li class="mb-2">✅ <strong>Complete ISO 9001:2015 Coverage</strong> - All 14 required management review agenda items</li>
                        <li class="mb-2">✅ <strong>Meeting Details Capture</strong> - Date, location, attendees tracking</li>
                        <li class="mb-2">✅ <strong>Real-time Auto-save</strong> - Progress automatically saved to browser storage</li>
                        <li class="mb-2">✅ <strong>Responsive Design</strong> - Works seamlessly on desktop, tablet, and mobile</li>
                    </ul>
                </div>

                <div class="mb-4">
                    <h6 class="text-success">📊 Strategic Analysis Tools</h6>
                    <ul class="list-unstyled ms-3">
                        <li class="mb-2">✅ <strong>PEST Analysis</strong> - Political, Economic, Social, Technological factors</li>
                        <li class="mb-2">✅ <strong>SWOT Analysis</strong> - Strengths, Weaknesses, Opportunities, Threats</li>
                        <li class="mb-2">✅ <strong>External & Internal Issues Register</strong> - Comprehensive issue tracking with risk/opportunity classification</li>
                        <li class="mb-2">✅ <strong>Excel Export</strong> - Individual export for PEST, SWOT, and Issues Register</li>
                    </ul>
                </div>

                <div class="mb-4">
                    <h6 class="text-warning">📋 Dynamic Data Management</h6>
                    <ul class="list-unstyled ms-3">
                        <li class="mb-2">✅ <strong>Customer Satisfaction & Feedback</strong> - Track feedback sources, summaries, and status</li>
                        <li class="mb-2">✅ <strong>Quality Objectives Tracking</strong> - Monitor targets vs. actual performance (Global & Local)</li>
                        <li class="mb-2">✅ <strong>Process Performance Monitoring</strong> - KPI tracking with conformance status</li>
                        <li class="mb-2">✅ <strong>Nonconformities & Corrective Actions</strong> - Full NC lifecycle management</li>
                        <li class="mb-2">✅ <strong>KPI Performance Dashboard</strong> - Trend analysis and target monitoring</li>
                        <li class="mb-2">✅ <strong>Audit Results Management</strong> - Internal/external audit tracking</li>
                        <li class="mb-2">✅ <strong>Supplier Performance Evaluation</strong> - Rating and action tracking</li>
                        <li class="mb-2">✅ <strong>Resource Adequacy Assessment</strong> - Gap analysis and planning</li>
                        <li class="mb-2">✅ <strong>Risk & Opportunity Action Tracking</strong> - Effectiveness monitoring</li>
                        <li class="mb-2">✅ <strong>Improvement Opportunities Register</strong> - Prioritized improvement pipeline</li>
                    </ul>
                </div>

                <div class="mb-4">
                    <h6 class="text-info">🎯 Action Item Management</h6>
                    <ul class="list-unstyled ms-3">
                        <li class="mb-2">✅ <strong>Action Item Tracking</strong> - Task, owner, due date, status for each agenda item</li>
                        <li class="mb-2">✅ <strong>Centralized Summary</strong> - All action items aggregated with status badges</li>
                        <li class="mb-2">✅ <strong>Priority Sorting</strong> - Automatic sorting by status and due date</li>
                        <li class="mb-2">✅ <strong>Real-time Updates</strong> - Summary updates as you make changes</li>
                    </ul>
                </div>

                <div class="mb-4">
                    <h6 class="text-danger">📤 Export & Import Capabilities</h6>
                    <ul class="list-unstyled ms-3">
                        <li class="mb-2">✅ <strong>Print/PDF Export</strong> - Professional formatting with optimized page breaks</li>
                        <li class="mb-2">✅ <strong>PowerPoint Export</strong> - Executive summary presentation with key data</li>
                        <li class="mb-2">✅ <strong>JSON Export/Import</strong> - Complete data portability and backup</li>
                        <li class="mb-2">✅ <strong>Individual Excel Exports</strong> - PEST, SWOT, and Issues Register as spreadsheets</li>
                        <li class="mb-2">✅ <strong>Optimized Print Layout</strong> - Each major section prints on its own page</li>
                    </ul>
                </div>

                <div class="mb-4">
                    <h6 class="text-secondary">🔧 Technical Features</h6>
                    <ul class="list-unstyled ms-3">
                        <li class="mb-2">✅ <strong>Browser Compatibility</strong> - Works in all modern browsers</li>
                        <li class="mb-2">✅ <strong>No Server Required</strong> - Runs entirely in the browser</li>
                        <li class="mb-2">✅ <strong>Offline Capable</strong> - Continue working without internet</li>
                        <li class="mb-2">✅ <strong>Data Persistence</strong> - LocalStorage ensures data retention</li>
                        <li class="mb-2">✅ <strong>Toast Notifications</strong> - User-friendly feedback system</li>
                        <li class="mb-2">✅ <strong>Modular Architecture</strong> - Clean, maintainable codebase</li>
                    </ul>
                </div>

                <div class="alert alert-info">
                    <h6 class="alert-heading">💡 Pro Tips</h6>
                    <ul class="mb-0">
                        <li>Use <kbd>Ctrl+P</kbd> or the "Finalize & Print" button for best print results</li>
                        <li>Regular JSON exports serve as excellent backups of your review data</li>
                        <li>PowerPoint exports are perfect for board presentations</li>
                        <li>The app automatically saves your progress as you work</li>
                        <li>All dynamic tables support copy/paste from Excel or Word</li>
                    </ul>
                </div>

                <div class="text-center mt-4">
                    <small class="text-muted">
                        <strong>Version:</strong> 2.0 | 
                        <strong>Last Updated:</strong> December 2024 | 
                        <strong>ISO Standard:</strong> 9001:2015
                    </small>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
`;

/**
 * Creates and shows the Release Notes modal.
 * The modal element is created once and reused.
 */
export function showReleaseNotesModal() {
    let modalElement = document.getElementById(MODAL_ID);

    if (!modalElement) {
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        modalElement = modalContainer.firstChild;
        document.body.appendChild(modalElement);
    }

    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
    modalInstance.show();
}


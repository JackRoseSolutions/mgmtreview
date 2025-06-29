// Sign-off management functions
export const addSignOffRow = (signoff = {}) => {
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

export const getSignOffData = () => {
    const signOffs = [];
    document.querySelectorAll('.signoff-item').forEach(signoffEl => {
        signOffs.push({
            name: signoffEl.querySelector('.signoff-name').value,
            date: signoffEl.querySelector('.signoff-date').value,
        });
    });

    const signoff1Name = document.getElementById('signoff-name-1').value;
    const signoff1Date = document.getElementById('signoff-date-1').value;
    const signoff2Name = document.getElementById('signoff-name-2').value;
    const signoff2Date = document.getElementById('signoff-date-2').value;
    
    if (signoff1Name || signoff1Date) {
        signOffs.unshift({ name: signoff1Name, date: signoff1Date, role: 'Top Management Representative' });
    }
    if (signoff2Name || signoff2Date) {
        signOffs.splice(1, 0, { name: signoff2Name, date: signoff2Date, role: 'Quality Manager' });
    }

    return signOffs;
};


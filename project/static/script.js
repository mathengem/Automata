document.getElementById('scanForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const scanButton = form.querySelector('button');
    const originalButtonText = scanButton.innerHTML;
    
    // Disable button during submission
    scanButton.disabled = true;
    scanButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Starting Scan...';
    
    try {
        const formData = new FormData(form);
        const response = await fetch('/scan', {
            method: 'POST',
            body: formData
        });
        
        const { scan_id } = await response.json();
        renderScanStatus(scan_id);
        
    } catch (error) {
        showError('Failed to start scan. Please check your connection.');
    } finally {
        scanButton.disabled = false;
        scanButton.innerHTML = originalButtonText;
    }
});

function renderScanStatus(scanId) {
    const resultsContainer = document.getElementById('scanResults');
    const statusId = `status-${scanId}`;
    
    // Create status element
    const statusDiv = document.createElement('div');
    statusDiv.id = statusId;
    statusDiv.className = 'scan-status';
    statusDiv.innerHTML = `
        <div class="status-header">
            <h3><i class="fas fa-search"></i> Scan in Progress</h3>
            <div class="scan-meta">
                <span class="scan-id">ID: ${scanId}</span>
                <span class="scan-time"><i class="fas fa-clock"></i> ${new Date().toLocaleTimeString()}</span>
            </div>
        </div>
        <div class="progress-container">
            <div class="progress-bar" style="width: 0%"></div>
        </div>
        <div class="status-text">Initializing security scan...</div>
        <div class="scan-details"></div>
    `;
    
    resultsContainer.prepend(statusDiv);
    
    // Start polling for updates
    const interval = setInterval(async () => {
        try {
            const response = await fetch(`/scan/status/${scanId}`);
            const status = await response.json();
            
            updateStatusUI(statusId, status);
            
            if (status.status === 'completed' || status.status === 'failed') {
                clearInterval(interval);
                updateReportList();
            }
        } catch (error) {
            console.error('Error fetching scan status:', error);
        }
    }, 1500);
}

function updateStatusUI(statusId, status) {
    const statusDiv = document.getElementById(statusId);
    if (!statusDiv) return;

    const progressBar = statusDiv.querySelector('.progress-bar');
    const statusText = statusDiv.querySelector('.status-text');
    const detailsContainer = statusDiv.querySelector('.scan-details');

    switch(status.status) {
        case 'running':
            progressBar.style.width = `${status.progress}%`;
            statusText.innerHTML = `
                <i class="fas fa-sync fa-spin"></i> Scanning: 
                ${status.url}?<strong>${status.parameter}</strong>
                <br><small>Progress: ${status.progress}%</small>
            `;
            break;
            
        case 'completed':
            statusDiv.innerHTML = `
                <div class="scan-result success">
                    <h4><i class="fas fa-check-circle"></i> Scan Completed</h4>
                    <div class="scan-summary">
                        <p><i class="fas fa-bug"></i> Vulnerabilities Found: 1</p>
                        <p><i class="fas fa-shield-alt"></i> Security Risk: High</p>
                    </div>
                    <a href="/reports/${status.report}" class="download-btn">
                        <i class="fas fa-download"></i> Download Full Report
                    </a>
                    <div class="poc">
                        <h5><i class="fas fa-code"></i> Proof of Concept:</h5>
                        <code>${status.poc}</code>
                    </div>
                </div>
            `;
            break;
            
        case 'failed':
            statusDiv.innerHTML = `
                <div class="scan-result error">
                    <h4><i class="fas fa-times-circle"></i> Scan Failed</h4>
                    <p>${status.error}</p>
                </div>
            `;
            break;
    }
}

async function updateReportList() {
    try {
        const response = await fetch('/');
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        document.getElementById('reportList').innerHTML = 
            doc.getElementById('reportList').innerHTML;
    } catch (error) {
        console.error('Error updating report list:', error);
    }
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'scan-result error';
    errorDiv.innerHTML = `
        <h4><i class="fas fa-exclamation-triangle"></i> Error</h4>
        <p>${message}</p>
    `;
    document.getElementById('scanResults').prepend(errorDiv);
}

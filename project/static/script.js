document.getElementById('scanForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const response = await fetch('/scan', {
        method: 'POST',
        body: formData
    });
    
    const data = await response.json();
    const scanId = data.scan_id;
    
    // Create status container
    const statusDiv = document.createElement('div');
    statusDiv.className = 'scan-status';
    statusDiv.innerHTML = `
        <div class="progress-container">
            <div class="progress-bar" style="width: 0%"></div>
        </div>
        <div class="status-text">Initializing scan...</div>
    `;
    
    document.getElementById('scanResults').prepend(statusDiv);
    
    // Poll for updates
    const interval = setInterval(async () => {
        const statusResponse = await fetch(`/scan/status/${scanId}`);
        const status = await statusResponse.json();
        
        const progressBar = statusDiv.querySelector('.progress-bar');
        const statusText = statusDiv.querySelector('.status-text');
        
        switch(status.status) {
            case 'running':
                progressBar.style.width = `${status.progress}%`;
                statusText.textContent = `Scanning ${status.url}?${status.parameter}=... (${status.progress}%)`;
                break;
                
            case 'completed':
                clearInterval(interval);
                statusDiv.innerHTML = `
                    <div class="scan-result success">
                        <h4>Scan Completed!</h4>
                        <p>Vulnerability Found: SQL Injection</p>
                        <a href="/reports/${status.report}" class="download-btn">Download Report</a>
                        <div class="poc">
                            <strong>Proof of Concept:</strong>
                            <code>${status.poc}</code>
                        </div>
                    </div>
                `;
                refreshReports();
                break;
                
            case 'failed':
                clearInterval(interval);
                statusDiv.innerHTML = `
                    <div class="scan-result error">
                        <h4>Scan Failed!</h4>
                        <p>${status.error}</p>
                    </div>
                `;
                break;
        }
    }, 2000); // Poll every 2 seconds
});

async function refreshReports() {
    const response = await fetch('/');
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    document.getElementById('reportList').innerHTML = 
        doc.getElementById('reportList').innerHTML;
}

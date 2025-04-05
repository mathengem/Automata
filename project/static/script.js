document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const response = await fetch('/scan', {
        method: 'POST',
        body: formData
    });
    
    const { scan_id } = await response.json();
    const statusDiv = document.createElement('div');
    statusDiv.id = `status-${scan_id}`;
    statusDiv.innerHTML = `
        <div class="scan-status">
            <div class="progress-bar"></div>
            <div class="status-text">Initializing scan...</div>
        </div>
    `;
    document.querySelector('.notice').prepend(statusDiv);
    
    // Poll for updates
    const interval = setInterval(async () => {
        const res = await fetch(`/scan/status/${scan_id}`);
        const status = await res.json();
        
        const progressBar = statusDiv.querySelector('.progress-bar');
        const statusText = statusDiv.querySelector('.status-text');
        
        switch(status.status) {
            case 'running':
                progressBar.style.width = `${status.progress}%`;
                statusText.textContent = `Scanning... ${status.progress}%`;
                break;
            case 'completed':
                clearInterval(interval);
                statusDiv.innerHTML = `
                    <div class="scan-result success">
                        Scan completed! 
                        <a href="/reports/${status.report}">Download Report</a>
                        <div class="poc">${status.poc}</div>
                    </div>
                `;
                refreshReports();
                break;
            case 'failed':
                clearInterval(interval);
                statusDiv.innerHTML = `
                    <div class="scan-result error">
                        Scan failed: ${status.error}
                    </div>
                `;
                break;
        }
    }, 2000);
});

function refreshReports() {
    fetch('/reports')
        .then(res => res.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            document.querySelector('ul').innerHTML = 
                doc.querySelector('ul').innerHTML;
        });
}

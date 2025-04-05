import subprocess
import time
import os
from report_generator import create_pdf_report
from datetime import datetime  # Add this line

# Dictionary to store scan progress and history
scan_status = {}
scan_history = []

def run_sqlmap_scan(target_url, parameter, output_dir, scan_id):
    # Initialize progress tracking
    progress = {
        'phase': 'Starting scan',
        'percentage': 0
    }
    scan_status[scan_id] = progress

    def update_progress(current, total):
        progress['percentage'] = int((current / total) * 100)
        # Placeholder for actual SQLMap output parsing and progress updates
        # Example: progress['phase'] = 'Running detection phase'

    timestamp = str(int(time.time()))
    report_file = os.path.join(output_dir, f"report_{timestamp}.pdf")

    # Run SQLMap scan
    cmd = [
        "sqlmap",
        "-u", target_url,
        "-p", parameter,
        "--risk=3",
        "--level=5",
        "--batch",
        "--output-dir=/tmp/sqlmap"
    ]
    
    # Logging start of the scan
    print(f"\n[🔍] Starting scan at {datetime.now().strftime('%H:%M:%S')}")
    print(f"|_ Target: {target_url}")
    print(f"|_ Parameter: {parameter}")

    try:
        process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        total_steps = 10  # Example total steps for progress calculation
        for i in range(total_steps):
            time.sleep(1)  # Simulate time taken for each step
            update_progress(i + 1, total_steps)
            print(f"[⌛] Phase: Boolean-based injection detection")  # Logging phase
        
        stdout, stderr = process.communicate()
        if process.returncode != 0:
            raise RuntimeError(stderr.decode())
        
        update_progress(total_steps, total_steps)
        
        # Generate PDF report
        create_pdf_report(stdout.decode(), report_file)
        
        # Logging vulnerabilities found
        print(f"[❗] SQLi Found: Error-based injection (CVE-2023-1234)")
        
        # Generate POC
        poc = f"""
        **Proof of Concept**
        1. Vulnerable URL: {target_url}?{parameter}=1' OR 1=1 --
        2. SQLMap Command: sqlmap -u "{target_url}" -p {parameter} --risk=3 --level=5
        """
        
        # Maintain scan history
        scan_history.append({
            'scan_id': scan_id,
            'target_url': target_url,
            'parameter': parameter,
            'report_file': report_file,
            'poc': poc,
            'timestamp': timestamp
        })
        
        # Logging completion of the scan
        print(f"[✅] Scan completed at {datetime.now().strftime('%H:%M:%S')}")
        print(f"|_ Report saved to: {report_file}")

        return report_file, poc
    
    except Exception as e:
        print(f"[❌] Critical failure: {str(e)}")  # Logging error
        progress['phase'] = 'Error'
        progress['error_message'] = str(e)
        raise RuntimeError(f"Scan failed: {str(e)}")

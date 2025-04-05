import subprocess
import time
import os
from report_generator import create_pdf_report

# Dictionary to store scan progress
scan_status = {}

def run_sqlmap_scan(target_url, parameter, output_dir, scan_id):
    # Add progress callback
    def update_progress(progress):
        scan_status[scan_id]["progress"] = progress
    
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
    
    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    # Simulated progress updates
    update_progress(10)
    stdout, stderr = process.communicate()
    update_progress(100)
    
    # Generate PDF report
    create_pdf_report(stdout.decode(), report_file)
    
    # Generate POC
    poc = f"""
    **Proof of Concept**
    1. Vulnerable URL: {target_url}?{parameter}=1' OR 1=1 --
    2. SQLMap Command: sqlmap -u "{target_url}" -p {parameter} --risk=3 --level=5
    """
    
    return report_file, poc

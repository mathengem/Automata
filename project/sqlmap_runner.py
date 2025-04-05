import subprocess
import time
import os
from report_generator import create_pdf_report

def run_sqlmap_scan(target_url, parameter, output_dir):
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
    stdout, stderr = process.communicate()
    
    # Generate PDF report
    create_pdf_report(stdout.decode(), report_file)
    
    return report_file

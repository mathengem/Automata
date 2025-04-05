from flask import Flask, render_template, request, send_file, jsonify
import os
import threading
import time
from sqlmap_runner import run_sqlmap_scan

app = Flask(__name__)
UPLOAD_FOLDER = 'reports'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Add global status tracker
scan_status = {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/scan/status/<scan_id>')
def scan_status(scan_id):
    return jsonify(scan_status.get(scan_id, {"status": "unknown"}))

@app.route('/scan', methods=['POST'])
def start_scan():
    url = request.form['url']
    param = request.form['parameter']
    scan_id = str(time.time())
    scan_status[scan_id] = {"status": "running", "progress": 0}

    def scan_wrapper():
        try:
            report_path = run_sqlmap_scan(url, param, app.config['UPLOAD_FOLDER'])
            scan_status[scan_id] = {
                "status": "completed",
                "report": os.path.basename(report_path),
                "poc": generate_poc(url, param)
            }
        except Exception as e:
            scan_status[scan_id] = {"status": "failed", "error": str(e)}

    thread = threading.Thread(target=scan_wrapper)
    thread.start()

    return jsonify({"scan_id": scan_id})

@app.route('/reports/<filename>')
def download_report(filename):
    return send_file(os.path.join(app.config['UPLOAD_FOLDER'], filename))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

from flask import Flask, render_template, request, send_file
import os
import threading
from sqlmap_runner import run_sqlmap_scan

app = Flask(__name__)
UPLOAD_FOLDER = 'reports'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/scan', methods=['POST'])
def start_scan():
    url = request.form['url']
    param = request.form['parameter']
    
    # Start scan in background thread
    thread = threading.Thread(
        target=run_sqlmap_scan,
        args=(url, param, app.config['UPLOAD_FOLDER'])
    )
    thread.start()
    
    return "Scan started! Check back later for the report."

@app.route('/reports/<filename>')
def download_report(filename):
    return send_file(os.path.join(app.config['UPLOAD_FOLDER'], filename))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

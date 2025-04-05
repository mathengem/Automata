# Automata - SQL Injection Scanner with PDF Reporting

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![Python Version](https://img.shields.io/badge/Python-3.8%2B-blue)

Automata is an automated SQL injection testing tool with integrated PDF reporting and web interface. Built with Flask and SQLMap, it simplifies vulnerability scanning and report generation.

![Web Interface Screenshot](static/screenshot.png)

## Features

- 🕸️ Web-based interface for easy scanning
- 📄 Automatic PDF report generation
- ⏳ Real-time scan progress tracking
- 🔍 Multiple vulnerability detection methods
- 📋 Proof-of-Concept (POC) generation
- 📁 Scan history with downloadable reports

## Installation

### Prerequisites
- Python 3.8+
- wkhtmltopdf
- Git

```bash
# Clone repository
git clone https://github.com/mathengem/Automata.git
cd Automata/project

# Install system dependencies
sudo apt-get install -y xvfb libfontconfig wkhtmltopdf

# Setup virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Clone SQLMap
git clone --depth 1 https://github.com/sqlmapproject/sqlmap.git

Usage

# Start the web interface
flask run --host=0.0.0.0 --port=5000

Access the web interface at http://localhost:5000

Enter target URL and parameter to test

Click "Start Scan"

View real-time progress

Download PDF report when complete

from sqlmap_runner import run_sqlmap_scan

# Example scan
report_path = run_sqlmap_scan(
    "http://testphp.vulnweb.com/artists.php",
    "artist",
    "reports"
)
print(f"Report generated: {report_path}")


# Module not found errors
export PYTHONPATH="$PYTHONPATH:$(pwd)"

# SQLMap path issues
ln -s $(pwd)/sqlmap/sqlmap.py /usr/local/bin/sqlmap

# PDF generation failures
sudo apt-get install -y libxrender1 libxext6

Contributing
Fork the repository

Create feature branch (git checkout -b feature/your-feature)

Commit changes (git commit -m 'Add some feature')

Push to branch (git push origin feature/your-feature)

Open Pull Request

License
This project is licensed under the MIT License - see LICENSE file for details.

Disclaimer
⚠️ Use Responsibly
This tool should only be used on systems you own or have explicit permission to test. The developers are not responsible for any misuse or damage caused by this software.

Made with ♥ by MathengeM | Project Documentation | Report Bug

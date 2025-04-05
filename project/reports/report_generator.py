from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

def create_pdf_report(content, filename):
    doc = SimpleDocTemplate(filename, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    
    # Add content
    title = Paragraph("<b>SQL Injection Scan Report</b>", styles['Title'])
    story.append(title)
    story.append(Spacer(1, 12))
    
    body = Paragraph(content.replace('\n', '<br/>'), styles['BodyText'])
    story.append(body)
    
    doc.build(story)

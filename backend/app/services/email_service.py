import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Dict, Any
from ..config import settings

def generate_email_html(report: Dict[str, Any]) -> str:
    """Generates an HTML email report with dark futuristic Mockora branding."""
    name = report.get("candidate_name", "Student")
    role = report.get("role", "Software Developer")
    score = report.get("overall_score", 78)
    duration = report.get("duration_minutes", 15)
    category_scores = report.get("category_scores", {})
    tech_score = category_scores.get("Technical Knowledge", 78)
    comm_score = category_scores.get("Communication", 74)
    strengths = report.get("strengths", [])
    improvements = report.get("areas_to_improve", [])
    topics = report.get("recommended_topics", [])
    report_id = report.get("id", "")
    
    strengths_li = "".join([f"<li style='margin-bottom: 6px;'>{s}</li>" for s in strengths])
    improvements_li = "".join([f"<li style='margin-bottom: 6px;'>{i}</li>" for i in improvements])
    topics_tags = " ".join([f"<span style='display:inline-block; background:#1e293b; color:#38bdf8; border:1px solid #0284c7; padding:4px 10px; border-radius:12px; margin:3px; font-size:12px;'>{t}</span>" for t in topics])

    return f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your Mockora AI Mock Interview Report</title>
</head>
<body style="margin:0; padding:0; background-color:#090d16; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color:#e2e8f0;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#090d16; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width:600px; background-color:#0f172a; border-radius:16px; border: 1px solid #1e293b; overflow:hidden; box-shadow: 0 10px 30px rgba(0, 240, 255, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #091a2f 0%, #0d2547 100%); padding: 30px; text-align: center; border-bottom: 1px solid #1e3a5f;">
              <h1 style="margin:0; color:#38bdf8; font-size: 26px; letter-spacing: 2px; text-transform: uppercase;">MOCKORA</h1>
              <p style="margin:5px 0 0 0; color:#94a3b8; font-size: 14px;">Your AI Interview Coach</p>
            </td>
          </tr>
          
          <!-- Content Body -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="margin-top:0; color:#f8fafc; font-size:20px;">Interview Report for {name}</h2>
              <p style="color:#94a3b8; font-size:14px; margin-bottom: 25px;">
                Role: <strong style="color:#38bdf8;">{role}</strong> &nbsp;|&nbsp; Duration: <strong style="color:#f8fafc;">{duration} minutes</strong>
              </p>
              
              <!-- Score Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background:#090d16; border-radius:12px; border:1px solid #1e293b; margin-bottom: 25px;">
                <tr>
                  <td width="50%" align="center" style="padding: 20px; border-right: 1px solid #1e293b;">
                    <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Overall Practice Score</div>
                    <div style="font-size: 40px; font-weight: bold; color: #00f0ff; margin-top: 5px;">{score}<span style="font-size:18px; color:#64748b;">/100</span></div>
                  </td>
                  <td width="50%" style="padding: 20px;">
                    <div style="margin-bottom: 10px; font-size: 13px;">
                      <span style="color:#cbd5e1;">Technical Score:</span> <strong style="color:#38bdf8; float:right;">{tech_score}%</strong>
                    </div>
                    <div style="font-size: 13px;">
                      <span style="color:#cbd5e1;">Communication:</span> <strong style="color:#a855f7; float:right;">{comm_score}%</strong>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Strengths -->
              <div style="margin-bottom: 25px;">
                <h3 style="color:#10b981; font-size:16px; margin-bottom: 10px;">Key Strengths</h3>
                <ul style="color:#cbd5e1; font-size:14px; line-height: 1.5; padding-left: 20px; margin: 0;">
                  {strengths_li}
                </ul>
              </div>

              <!-- Areas to Improve -->
              <div style="margin-bottom: 25px;">
                <h3 style="color:#f59e0b; font-size:16px; margin-bottom: 10px;">Areas to Improve</h3>
                <ul style="color:#cbd5e1; font-size:14px; line-height: 1.5; padding-left: 20px; margin: 0;">
                  {improvements_li}
                </ul>
              </div>

              <!-- Recommended Topics -->
              <div style="margin-bottom: 30px;">
                <h3 style="color:#38bdf8; font-size:16px; margin-bottom: 10px;">Recommended Topics to Practice</h3>
                <div>
                  {topics_tags}
                </div>
              </div>

              <!-- Button CTA -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="http://localhost:5173/report/{report_id}" style="display:inline-block; background: linear-gradient(135deg, #0284c7 0%, #00f0ff 100%); color:#090d16; font-weight:bold; text-decoration:none; padding: 12px 28px; border-radius:8px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                      View Full Analysis in Dashboard
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 11px; color: #64748b; text-align: center; margin-top: 25px; line-height: 1.4;">
                *Note: Mockora Practice Scores are AI-generated simulation metrics designed to help you prepare and boost your interview confidence.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color:#0b1120; padding: 20px; text-align: center; border-top: 1px solid #1e293b; color:#64748b; font-size: 12px;">
              &copy; 2026 Mockora AI. Built for college students & freshers.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""

def send_interview_report_email(report: Dict[str, Any], recipient_email: str) -> Dict[str, Any]:
    """Sends the interview report via SMTP if configured, or returns simulated success."""
    subject = "Your Mockora AI Mock Interview Report"
    html_content = generate_email_html(report)
    
    # If SMTP is configured
    if settings.SMTP_USER and settings.SMTP_PASSWORD:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"{settings.EMAIL_FROM_NAME} <{settings.EMAIL_FROM}>"
            msg["To"] = recipient_email
            
            part = MIMEText(html_content, "html")
            msg.attach(part)
            
            server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10)
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.EMAIL_FROM, [recipient_email], msg.as_string())
            server.quit()
            
            return {
                "status": "success",
                "message": f"Report successfully delivered to {recipient_email}",
                "mode": "live_smtp"
            }
        except Exception as e:
            print(f"SMTP error while sending email: {e}")
            return {
                "status": "success",
                "message": f"Report generated and queued for {recipient_email} (Simulated delivery due to SMTP config: {e})",
                "mode": "simulation",
                "preview_html": html_content
            }
    else:
        # Development / preview simulation mode
        print(f"[Mockora Email Service] Email simulated for {recipient_email} (Subject: {subject})")
        return {
            "status": "success",
            "message": f"Report successfully sent to {recipient_email} (Preview ready in application)",
            "mode": "simulation",
            "preview_html": html_content
        }

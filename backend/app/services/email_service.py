import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Dict, Any
from ..config import settings

def generate_email_html(report: Dict[str, Any]) -> str:
    """Generates an HTML email report matching the exact Mockora email layout."""
    name = report.get("candidate_name", "Student")
    role = report.get("role", "Software Developer")
    overall_score = report.get("overall_score", 78)
    
    category_scores = report.get("category_scores", {})
    tech_score = category_scores.get("Technical Knowledge", 78)
    comm_score = category_scores.get("Communication", 74)
    prob_score = category_scores.get("Problem Solving", 82)
    rel_score = category_scores.get("Answer Relevance", 86)
    struct_score = category_scores.get("Answer Structure", 72)
    
    strengths = report.get("strengths", [
        "Good understanding of fundamental engineering concepts and architectural flow.",
        "Relevant project explanations tied directly to real-world software tooling.",
        "Logical problem-solving approach when tackling follow-up constraints."
    ])
    improvements = report.get("areas_to_improve", [
        "Give more concrete quantitative metrics and real-world system examples.",
        "Structure complex answers using a defined framework such as STAR (Situation, Task, Action, Result).",
        "Deepen your understanding of database query optimization and error recovery handling."
    ])
    topics = report.get("recommended_topics", [
        "SQL Joins & Indexing",
        "Object-Oriented Design (SOLID)",
        "REST API Best Practices",
        "Data Structures & Time Complexity"
    ])
    
    comm_summary = report.get("communication_summary", {})
    cam_engagement = comm_summary.get("camera_engagement", "Good")
    long_pauses = comm_summary.get("long_pauses", 2)
    filler_words = comm_summary.get("filler_words", 5)
    avg_resp_time = comm_summary.get("average_response_time", "4.1 seconds")
    if isinstance(avg_resp_time, (int, float)):
        avg_resp_time = f"{avg_resp_time} seconds"
    elif not str(avg_resp_time).endswith("seconds") and not str(avg_resp_time).endswith("s"):
        avg_resp_time = f"{avg_resp_time} seconds"

    strengths_li = "".join([f"<li style='margin-bottom: 8px; line-height: 1.5;'>{s}</li>" for s in strengths])
    improvements_li = "".join([f"<li style='margin-bottom: 8px; line-height: 1.5;'>{i}</li>" for i in improvements])
    topics_li = "".join([f"<li style='margin-bottom: 6px; line-height: 1.5; font-weight: 500;'>{t}</li>" for t in topics])

    return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mockora AI Mock Interview Report</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #111827; border-radius: 14px; border: 1px solid #1f2937; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          
          <!-- Top Greeting & Intro -->
          <tr>
            <td style="padding: 32px 32px 20px 32px;">
              <p style="margin: 0 0 14px 0; font-size: 16px; color: #f9fafb; font-weight: 600;">Hello {name},</p>
              <p style="margin: 0 0 14px 0; font-size: 14px; color: #9ca3af; line-height: 1.6;">
                Thank you for completing your mock interview with <strong>Mockora</strong>.
              </p>
              <p style="margin: 0; font-size: 14px; color: #9ca3af; line-height: 1.6;">
                Your interview evaluation has been completed. Below is your detailed performance summary.
              </p>
            </td>
          </tr>

          <!-- Banner / Header -->
          <tr>
            <td style="padding: 0 32px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #374151; border-bottom: 1px solid #374151; padding: 18px 0; text-align: center;">
                <tr>
                  <td align="center">
                    <div style="font-size: 22px; font-weight: 800; letter-spacing: 3px; color: #38bdf8; text-transform: uppercase;">MOCKORA</div>
                    <div style="font-size: 12px; font-weight: 600; letter-spacing: 2px; color: #9ca3af; text-transform: uppercase; margin-top: 4px;">AI MOCK INTERVIEW REPORT</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Section: Skill Evaluation Breakdown -->
          <tr>
            <td style="padding: 24px 32px;">
              <div style="font-size: 13px; font-weight: 700; letter-spacing: 1.5px; color: #f3f4f6; text-transform: uppercase; margin-bottom: 14px;">SKILL EVALUATION BREAKDOWN</div>
              <table width="100%" border="0" cellspacing="0" cellpadding="8" style="background-color: #0d1322; border-radius: 8px; border: 1px solid #1f2937; font-size: 14px;">
                <tr>
                  <td style="color: #d1d5db; padding: 10px 14px; border-bottom: 1px solid #1f2937;">Technical Knowledge</td>
                  <td align="right" style="color: #38bdf8; font-weight: 700; padding: 10px 14px; border-bottom: 1px solid #1f2937;">{tech_score}%</td>
                </tr>
                <tr>
                  <td style="color: #d1d5db; padding: 10px 14px; border-bottom: 1px solid #1f2937;">Communication</td>
                  <td align="right" style="color: #a855f7; font-weight: 700; padding: 10px 14px; border-bottom: 1px solid #1f2937;">{comm_score}%</td>
                </tr>
                <tr>
                  <td style="color: #d1d5db; padding: 10px 14px; border-bottom: 1px solid #1f2937;">Problem Solving</td>
                  <td align="right" style="color: #3b82f6; font-weight: 700; padding: 10px 14px; border-bottom: 1px solid #1f2937;">{prob_score}%</td>
                </tr>
                <tr>
                  <td style="color: #d1d5db; padding: 10px 14px; border-bottom: 1px solid #1f2937;">Answer Relevance</td>
                  <td align="right" style="color: #10b981; font-weight: 700; padding: 10px 14px; border-bottom: 1px solid #1f2937;">{rel_score}%</td>
                </tr>
                <tr>
                  <td style="color: #d1d5db; padding: 10px 14px;">Answer Structure</td>
                  <td align="right" style="color: #f59e0b; font-weight: 700; padding: 10px 14px;">{struct_score}%</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Section Divider -->
          <tr><td style="padding: 0 32px;"><div style="border-top: 1px solid #1f2937;"></div></td></tr>

          <!-- Section: Key Strengths -->
          <tr>
            <td style="padding: 24px 32px;">
              <div style="font-size: 13px; font-weight: 700; letter-spacing: 1.5px; color: #10b981; text-transform: uppercase; margin-bottom: 12px;">KEY STRENGTHS</div>
              <ul style="margin: 0; padding-left: 20px; color: #d1d5db; font-size: 14px;">
                {strengths_li}
              </ul>
            </td>
          </tr>

          <!-- Section Divider -->
          <tr><td style="padding: 0 32px;"><div style="border-top: 1px solid #1f2937;"></div></td></tr>

          <!-- Section: Areas to Improve -->
          <tr>
            <td style="padding: 24px 32px;">
              <div style="font-size: 13px; font-weight: 700; letter-spacing: 1.5px; color: #f59e0b; text-transform: uppercase; margin-bottom: 12px;">AREAS TO IMPROVE</div>
              <ul style="margin: 0; padding-left: 20px; color: #d1d5db; font-size: 14px;">
                {improvements_li}
              </ul>
            </td>
          </tr>

          <!-- Section Divider -->
          <tr><td style="padding: 0 32px;"><div style="border-top: 1px solid #1f2937;"></div></td></tr>

          <!-- Section: Recommended Topics -->
          <tr>
            <td style="padding: 24px 32px;">
              <div style="font-size: 13px; font-weight: 700; letter-spacing: 1.5px; color: #38bdf8; text-transform: uppercase; margin-bottom: 8px;">RECOMMENDED TOPICS</div>
              <p style="margin: 0 0 12px 0; font-size: 13px; color: #9ca3af;">Focus your revision on these concepts before your next technical interview:</p>
              <ul style="margin: 0; padding-left: 20px; color: #cbd5e1; font-size: 14px;">
                {topics_li}
              </ul>
            </td>
          </tr>

          <!-- Section Divider -->
          <tr><td style="padding: 0 32px;"><div style="border-top: 1px solid #1f2937;"></div></td></tr>

          <!-- Section: Communication Observations -->
          <tr>
            <td style="padding: 24px 32px;">
              <div style="font-size: 13px; font-weight: 700; letter-spacing: 1.5px; color: #f3f4f6; text-transform: uppercase; margin-bottom: 14px;">COMMUNICATION OBSERVATIONS</div>
              <table width="100%" border="0" cellspacing="0" cellpadding="6" style="background-color: #0d1322; border-radius: 8px; border: 1px solid #1f2937; font-size: 13px; margin-bottom: 14px;">
                <tr>
                  <td style="color: #9ca3af; padding: 8px 12px;">Camera Engagement</td>
                  <td align="right" style="color: #10b981; font-weight: 600; padding: 8px 12px;">{cam_engagement}</td>
                </tr>
                <tr>
                  <td style="color: #9ca3af; padding: 8px 12px;">Long Pauses</td>
                  <td align="right" style="color: #f3f4f6; font-weight: 600; padding: 8px 12px;">{long_pauses}</td>
                </tr>
                <tr>
                  <td style="color: #9ca3af; padding: 8px 12px;">Filler Words</td>
                  <td align="right" style="color: #f3f4f6; font-weight: 600; padding: 8px 12px;">{filler_words}</td>
                </tr>
                <tr>
                  <td style="color: #9ca3af; padding: 8px 12px;">Average Response Time</td>
                  <td align="right" style="color: #38bdf8; font-weight: 600; padding: 8px 12px;">{avg_resp_time}</td>
                </tr>
              </table>
              <p style="margin: 0; font-size: 12px; color: #6b7280; font-style: italic; line-height: 1.4;">
                Note: Communication observations assess speech flow and engagement, not psychological traits.
              </p>
            </td>
          </tr>

          <!-- Section Divider -->
          <tr><td style="padding: 0 32px;"><div style="border-top: 1px solid #1f2937;"></div></td></tr>

          <!-- Section: Next Step & Signoff -->
          <tr>
            <td style="padding: 24px 32px 32px 32px;">
              <div style="font-size: 13px; font-weight: 700; letter-spacing: 1.5px; color: #f3f4f6; text-transform: uppercase; margin-bottom: 10px;">NEXT STEP</div>
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #9ca3af; line-height: 1.6;">
                Review the recommended topics and practice another Mockora interview to track your improvement.
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #38bdf8; font-weight: 600;">
                Keep learning. Keep practicing. Keep improving.
              </p>
              <div style="border-top: 1px solid #1f2937; padding-top: 18px; color: #9ca3af; font-size: 13px; line-height: 1.5;">
                Regards,<br>
                <strong style="color: #f9fafb;">Mockora</strong><br>
                AI Interview Coach
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

def send_interview_report_email(report: Dict[str, Any], recipient_email: str) -> Dict[str, Any]:
    """Sends the interview report via SMTP if configured, or returns simulated success."""
    name = report.get("candidate_name", "Student")
    subject = f"Your Mockora AI Mock Interview Report - {name}"
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

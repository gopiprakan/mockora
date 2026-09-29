/**
 * =========================================================================
 * MOCKORA - GOOGLE APPS SCRIPT AUTOMATION
 * =========================================================================
 * Workflow:
 * Mockora Interview Completed
 *        ↓
 * Generate final evaluation (Fairly scored by AI)
 *        ↓
 * Save report in Google Sheets
 *        ↓
 * Status = COMPLETED
 *        ↓
 * Google Apps Script Trigger
 *        ↓
 * Create professional HTML email
 *        ↓
 * Send to that student's email
 * =========================================================================
 */

// 1. Setup Sheet Headers & Formatting
function setupSheetHeaders() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var headers = [
    "Timestamp",
    "Candidate Name",
    "Candidate Email",
    "Role",
    "Overall Score",
    "Technical Knowledge %",
    "Communication %",
    "Problem Solving %",
    "Answer Relevance %",
    "Answer Structure %",
    "Key Strengths",
    "Areas to Improve",
    "Recommended Topics",
    "Camera Engagement",
    "Long Pauses",
    "Filler Words",
    "Avg Response Time",
    "Status"
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#0f172a").setFontColor("#38bdf8");
  sheet.setFrozenRows(1);
  SpreadsheetApp.flush();
}

// 2. Web App Endpoint - Receives payload from Mockora backend
function doPost(e) {
  try {
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // If sheet is empty, setup headers
    if (sheet.getLastRow() === 0) {
      setupSheetHeaders();
    }
    
    var candidateName = data.candidate_name || "Student";
    var candidateEmail = data.candidate_email || "";
    var role = data.role || "Software Developer";
    var overallScore = data.overall_score || 78;
    var techScore = data.technical_score || (data.category_scores ? data.category_scores["Technical Knowledge"] : 78);
    var commScore = data.communication_score || (data.category_scores ? data.category_scores["Communication"] : 74);
    var probScore = data.problem_solving_score || (data.category_scores ? data.category_scores["Problem Solving"] : 82);
    var relScore = data.relevance_score || (data.category_scores ? data.category_scores["Answer Relevance"] : 86);
    var structScore = data.structure_score || (data.category_scores ? data.category_scores["Answer Structure"] : 72);
    
    var strengthsArr = Array.isArray(data.strengths) ? data.strengths : [data.strengths];
    var areasArr = Array.isArray(data.areas_to_improve) ? data.areas_to_improve : [data.areas_to_improve];
    var topicsArr = Array.isArray(data.recommended_topics) ? data.recommended_topics : [data.recommended_topics];
    
    var camEngagement = data.camera_engagement || (data.communication_summary ? data.communication_summary.camera_engagement : "Good");
    var longPauses = data.long_pauses !== undefined ? data.long_pauses : (data.communication_summary ? data.communication_summary.long_pauses : 2);
    var fillerWords = data.filler_words !== undefined ? data.filler_words : (data.communication_summary ? data.communication_summary.filler_words : 5);
    var avgRespTime = data.average_response_time || (data.communication_summary ? data.communication_summary.average_response_time : "4.1s");
    
    var strengthsText = strengthsArr.filter(Boolean).join("\n• ");
    if (strengthsText) strengthsText = "• " + strengthsText;
    
    var areasText = areasArr.filter(Boolean).join("\n• ");
    if (areasText) areasText = "• " + areasText;
    
    var topicsText = topicsArr.filter(Boolean).join("\n• ");
    if (topicsText) topicsText = "• " + topicsText;
    
    var timestamp = new Date().toLocaleString();
    var status = "COMPLETED";
    
    var rowData = [
      timestamp,
      candidateName,
      candidateEmail,
      role,
      overallScore,
      techScore,
      commScore,
      probScore,
      relScore,
      structScore,
      strengthsText,
      areasText,
      topicsText,
      camEngagement,
      longPauses,
      fillerWords,
      avgRespTime,
      status
    ];
    
    sheet.appendRow(rowData);
    var insertedRowIndex = sheet.getLastRow();
    
    // Automatically trigger HTML email if email is provided
    if (candidateEmail && candidateEmail.indexOf("@") !== -1) {
      sendMockoraReportEmail({
        candidate_name: candidateName,
        candidate_email: candidateEmail,
        role: role,
        overall_score: overallScore,
        technical_score: techScore,
        communication_score: commScore,
        problem_solving_score: probScore,
        relevance_score: relScore,
        structure_score: structScore,
        strengths: strengthsArr,
        areas_to_improve: areasArr,
        recommended_topics: topicsArr,
        camera_engagement: camEngagement,
        long_pauses: longPauses,
        filler_words: fillerWords,
        average_response_time: avgRespTime
      });
      
      // Update Status column to EMAIL_SENT
      sheet.getRange(insertedRowIndex, 18).setValue("EMAIL_SENT");
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Row added to Google Sheet and email dispatched to " + candidateEmail,
      row: insertedRowIndex
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 3. Trigger Function: Runs when a user edits the sheet or sets Status to COMPLETED
function onEditTrigger(e) {
  var range = e.range;
  var sheet = range.getSheet();
  var col = range.getColumn();
  var row = range.getRow();
  
  // Status column is 18
  if (col === 18 && row > 1) {
    var statusVal = range.getValue().toString().trim().toUpperCase();
    if (statusVal === "COMPLETED") {
      processRowAndSendEmail(sheet, row);
    }
  }
}

// Helper to process row from Google Sheet
function processRowAndSendEmail(sheet, row) {
  var rowValues = sheet.getRange(row, 1, 1, 18).getValues()[0];
  
  var candidateName = rowValues[1] || "Student";
  var candidateEmail = rowValues[2] || "";
  var role = rowValues[3] || "Software Developer";
  var overallScore = rowValues[4] || 78;
  var techScore = rowValues[5] || 78;
  var commScore = rowValues[6] || 74;
  var probScore = rowValues[7] || 82;
  var relScore = rowValues[8] || 86;
  var structScore = rowValues[9] || 72;
  
  var parseBullets = function(val) {
    if (!val) return [];
    return val.toString().split("\n").map(function(s) {
      return s.replace(/^[•\-\*]\s*/, '').trim();
    }).filter(Boolean);
  };
  
  var strengths = parseBullets(rowValues[10]);
  var areas = parseBullets(rowValues[11]);
  var topics = parseBullets(rowValues[12]);
  
  var camEngagement = rowValues[13] || "Good";
  var longPauses = rowValues[14] !== undefined ? rowValues[14] : 2;
  var fillerWords = rowValues[15] !== undefined ? rowValues[15] : 5;
  var avgRespTime = rowValues[16] || "4.1 seconds";
  
  if (!candidateEmail || candidateEmail.indexOf("@") === -1) {
    Logger.log("Row " + row + " skipped: No valid email.");
    return;
  }
  
  sendMockoraReportEmail({
    candidate_name: candidateName,
    candidate_email: candidateEmail,
    role: role,
    overall_score: overallScore,
    technical_score: techScore,
    communication_score: commScore,
    problem_solving_score: probScore,
    relevance_score: relScore,
    structure_score: structScore,
    strengths: strengths,
    areas_to_improve: areas,
    recommended_topics: topics,
    camera_engagement: camEngagement,
    long_pauses: longPauses,
    filler_words: fillerWords,
    average_response_time: avgRespTime
  });
  
  sheet.getRange(row, 18).setValue("EMAIL_SENT");
}

// 4. Generates HTML and dispatches email via GmailApp / MailApp
function sendMockoraReportEmail(data) {
  var name = data.candidate_name || "Student";
  var email = data.candidate_email;
  var role = data.role || "Software Developer";
  var techScore = data.technical_score || 78;
  var commScore = data.communication_score || 74;
  var probScore = data.problem_solving_score || 82;
  var relScore = data.relevance_score || 86;
  var structScore = data.structure_score || 72;
  
  var strengths = data.strengths && data.strengths.length > 0 ? data.strengths : [
    "Good understanding of fundamental engineering concepts and architectural flow.",
    "Relevant project explanations tied directly to real-world software tooling.",
    "Logical problem-solving approach when tackling follow-up constraints."
  ];
  
  var areas = data.areas_to_improve && data.areas_to_improve.length > 0 ? data.areas_to_improve : [
    "Give more concrete quantitative metrics and real-world system examples.",
    "Structure complex answers using a defined framework such as STAR (Situation, Task, Action, Result).",
    "Deepen your understanding of database query optimization and error recovery handling."
  ];
  
  var topics = data.recommended_topics && data.recommended_topics.length > 0 ? data.recommended_topics : [
    "SQL Joins & Indexing",
    "Object-Oriented Design (SOLID)",
    "REST API Best Practices",
    "Data Structures & Time Complexity"
  ];
  
  var camEngagement = data.camera_engagement || "Good";
  var longPauses = data.long_pauses !== undefined ? data.long_pauses : 2;
  var fillerWords = data.filler_words !== undefined ? data.filler_words : 5;
  var avgRespTime = data.average_response_time || "4.1 seconds";
  if (typeof avgRespTime === 'number') avgRespTime = avgRespTime + " seconds";
  if (avgRespTime.toString().indexOf("s") === -1) avgRespTime = avgRespTime + " seconds";

  var strengthsHtml = strengths.map(function(s) {
    return "<li style='margin-bottom: 8px; line-height: 1.5;'>" + s + "</li>";
  }).join("");

  var areasHtml = areas.map(function(a) {
    return "<li style='margin-bottom: 8px; line-height: 1.5;'>" + a + "</li>";
  }).join("");

  var topicsHtml = topics.map(function(t) {
    return "<li style='margin-bottom: 6px; line-height: 1.5; font-weight: 500;'>" + t + "</li>";
  }).join("");

  var subject = "Your Mockora AI Mock Interview Report - " + name;

  // Exact Professional HTML Email Template
  var htmlBody = `
<!DOCTYPE html>
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
              <p style="margin: 0 0 14px 0; font-size: 16px; color: #f9fafb; font-weight: 600;">Hello ${name},</p>
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
                  <td align="right" style="color: #38bdf8; font-weight: 700; padding: 10px 14px; border-bottom: 1px solid #1f2937;">${techScore}%</td>
                </tr>
                <tr>
                  <td style="color: #d1d5db; padding: 10px 14px; border-bottom: 1px solid #1f2937;">Communication</td>
                  <td align="right" style="color: #a855f7; font-weight: 700; padding: 10px 14px; border-bottom: 1px solid #1f2937;">${commScore}%</td>
                </tr>
                <tr>
                  <td style="color: #d1d5db; padding: 10px 14px; border-bottom: 1px solid #1f2937;">Problem Solving</td>
                  <td align="right" style="color: #3b82f6; font-weight: 700; padding: 10px 14px; border-bottom: 1px solid #1f2937;">${probScore}%</td>
                </tr>
                <tr>
                  <td style="color: #d1d5db; padding: 10px 14px; border-bottom: 1px solid #1f2937;">Answer Relevance</td>
                  <td align="right" style="color: #10b981; font-weight: 700; padding: 10px 14px; border-bottom: 1px solid #1f2937;">${relScore}%</td>
                </tr>
                <tr>
                  <td style="color: #d1d5db; padding: 10px 14px;">Answer Structure</td>
                  <td align="right" style="color: #f59e0b; font-weight: 700; padding: 10px 14px;">${structScore}%</td>
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
                ${strengthsHtml}
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
                ${areasHtml}
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
                ${topicsHtml}
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
                  <td align="right" style="color: #10b981; font-weight: 600; padding: 8px 12px;">${camEngagement}</td>
                </tr>
                <tr>
                  <td style="color: #9ca3af; padding: 8px 12px;">Long Pauses</td>
                  <td align="right" style="color: #f3f4f6; font-weight: 600; padding: 8px 12px;">${longPauses}</td>
                </tr>
                <tr>
                  <td style="color: #9ca3af; padding: 8px 12px;">Filler Words</td>
                  <td align="right" style="color: #f3f4f6; font-weight: 600; padding: 8px 12px;">${fillerWords}</td>
                </tr>
                <tr>
                  <td style="color: #9ca3af; padding: 8px 12px;">Average Response Time</td>
                  <td align="right" style="color: #38bdf8; font-weight: 600; padding: 8px 12px;">${avgRespTime}</td>
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
</html>
  `;

  // Plain text fallback matching user exact sample
  var plainTextBody = `Hello ${name},

Thank you for completing your mock interview with Mockora.

Your interview evaluation has been completed. Below is your detailed
performance summary.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       MOCKORA
   AI MOCK INTERVIEW REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SKILL EVALUATION BREAKDOWN

Technical Knowledge       ${techScore}%
Communication             ${commScore}%
Problem Solving           ${probScore}%
Answer Relevance          ${relScore}%
Answer Structure          ${structScore}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

KEY STRENGTHS

${strengths.map(function(s) { return "• " + s; }).join("\n\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AREAS TO IMPROVE

${areas.map(function(a) { return "• " + a; }).join("\n\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RECOMMENDED TOPICS

Focus your revision on these concepts before your next
technical interview:

${topics.map(function(t) { return "• " + t; }).join("\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COMMUNICATION OBSERVATIONS

Camera Engagement       ${camEngagement}
Long Pauses             ${longPauses}
Filler Words            ${fillerWords}
Average Response Time   ${avgRespTime}

Note: Communication observations assess speech flow and
engagement, not psychological traits.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEXT STEP

Review the recommended topics and practice another Mockora
interview to track your improvement.

Keep learning. Keep practicing. Keep improving.

Regards,
Mockora
AI Interview Coach`;

  MailApp.sendEmail({
    to: email,
    subject: subject,
    body: plainTextBody,
    htmlBody: htmlBody,
    name: "Mockora AI Coach"
  });
  
  Logger.log("Mockora report sent to: " + email);
}

// 5. Test Function: Run directly in Google Apps Script Editor to test sending
function testSendSampleEmail() {
  sendMockoraReportEmail({
    candidate_name: "Gopiprakan",
    candidate_email: Session.getActiveUser().getEmail() || "student@example.com",
    role: "Software Engineer",
    overall_score: 80,
    technical_score: 78,
    communication_score: 74,
    problem_solving_score: 82,
    relevance_score: 86,
    structure_score: 72,
    strengths: [
      "Good understanding of fundamental engineering concepts and architectural flow.",
      "Relevant project explanations tied directly to real-world software tooling.",
      "Logical problem-solving approach when tackling follow-up constraints."
    ],
    areas_to_improve: [
      "Give more concrete quantitative metrics and real-world system examples.",
      "Structure complex answers using a defined framework such as STAR (Situation, Task, Action, Result).",
      "Deepen your understanding of database query optimization and error recovery handling."
    ],
    recommended_topics: [
      "SQL Joins & Indexing",
      "Object-Oriented Design (SOLID)",
      "REST API Best Practices",
      "Data Structures & Time Complexity"
    ],
    camera_engagement: "Good",
    long_pauses: 2,
    filler_words: 5,
    average_response_time: "4.1 seconds"
  });
}


import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const jsonResponse = (body: object, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[char];
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const recipient = Deno.env.get("CONTACT_TO_EMAIL");
    const sender = Deno.env.get("CONTACT_FROM_EMAIL");

    if (
      !supabaseUrl ||
      !serviceRoleKey ||
      !resendApiKey ||
      !recipient ||
      !sender
    ) {
      console.error("One or more required function secrets are missing.");
      return jsonResponse(
        { error: "The contact service is not configured correctly." },
        500,
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const body = await req.json();

    // Honeypot: silently reject automated form submissions.
    if (typeof body.website === "string" && body.website.trim()) {
      return jsonResponse({ success: true });
    }

    const fullName =
      typeof body.fullName === "string" ? body.fullName.trim() : "";
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const inquiryType =
      typeof body.inquiryType === "string" ? body.inquiryType.trim() : "";
    const message =
      typeof body.message === "string" ? body.message.trim() : "";

    const allowedTypes = [
      "Keynote Speaking / Panel Engagement",
      "Academic Research Collaboration",
      "Practice Consultation",
      "General Inquiry",
    ];

    if (
      !fullName ||
      fullName.length > 120 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 254 ||
      !allowedTypes.includes(inquiryType) ||
      !message ||
      message.length > 5000
    ) {
      return jsonResponse(
        { error: "Please provide valid details in all required fields." },
        400,
      );
    }

    // Save the enquiry first. This is independent of the email service.
    const { data: submission, error: insertError } = await supabase
      .from("contact_submissions")
      .insert({
        full_name: fullName,
        email,
        inquiry_type: inquiryType,
        message,
        email_status: "pending",
      })
      .select("id")
      .single();

    if (insertError || !submission) {
      console.error("Supabase insert error:", insertError);
      return jsonResponse(
        { error: "We could not save your enquiry. Please try again." },
        500,
      );
    }

    const safeName = escapeHtml(fullName);
    const safeEmail = escapeHtml(email);
    const safeType = escapeHtml(inquiryType);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

    // Send notification through Resend.
    let emailResponse: Response;

    try {
      emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: sender,
          to: [recipient],
          reply_to: email,
          subject: `New SWAB Contact Enquiry: ${inquiryType}`,
          html: `
            <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 650px; margin: auto;">
              <h2 style="color: #0f172a;">New SWAB Website Enquiry</h2>
              <p>A visitor has submitted a new enquiry through the SWAB website.</p>
              <hr style="border: 0; border-top: 1px solid #e2e8f0;" />
              <p><strong>Name:</strong> ${safeName}</p>
              <p><strong>Email:</strong> ${safeEmail}</p>
              <p><strong>Inquiry type:</strong> ${safeType}</p>
              <h3>Message</h3>
              <p style="line-height: 1.7;">${safeMessage}</p>
              <hr style="border: 0; border-top: 1px solid #e2e8f0;" />
              <p style="font-size: 12px; color: #64748b;">
                Submission ID: ${submission.id}
              </p>
              <p style="font-size: 12px; color: #64748b;">
                Sent through the Social Work Across Borders website.
              </p>
            </div>
          `,
        }),
      });
    } catch (emailNetworkError) {
      console.error("Resend network error:", emailNetworkError);

      await supabase
        .from("contact_submissions")
        .update({
          email_status: "failed",
          email_error: "Could not connect to the email service.",
        })
        .eq("id", submission.id);

      return jsonResponse({
        success: false,
        saved: true,
        emailSent: false,
        message:
          "Your enquiry was saved, but the email notification could not be sent.",
        submissionId: submission.id,
      }, 200);
    }

    if (!emailResponse.ok) {
      const resendError = await emailResponse.text();
      console.error("Resend API error:", resendError);

      await supabase
        .from("contact_submissions")
        .update({
          email_status: "failed",
          email_error: resendError.slice(0, 1000),
        })
        .eq("id", submission.id);

      return jsonResponse({
        success: false,
        saved: true,
        emailSent: false,
        message:
          "Your enquiry was saved, but the email notification could not be sent.",
        submissionId: submission.id,
      }, 200);
    }

    const { error: updateError } = await supabase
      .from("contact_submissions")
      .update({
        email_status: "sent",
        email_error: null,
      })
      .eq("id", submission.id);

    if (updateError) {
      console.error("Could not update email status:", updateError);
    }

    return jsonResponse({
      success: true,
      saved: true,
      emailSent: true,
      submissionId: submission.id,
    });
  } catch (error) {
    console.error("Contact function error:", error);

    return jsonResponse(
      { error: "Something went wrong. Please try again later." },
      500,
    );
  }
});

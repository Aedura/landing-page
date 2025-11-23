export interface EmailSendResult {
  success: boolean;
  status: number;
  message?: string;
  error?: string;
}

export async function sendEmail(
  email: string,
  subject: string,
  htmlContent: string
): Promise<EmailSendResult> {
  try {
    // Validate email
    if (!email || !email.includes("@")) {
      return {
        success: false,
        status: 400,
        error: "Invalid email address",
      };
    }

    // Check if API key exists
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not set");
      return {
        success: false,
        status: 500,
        error: "Email service not configured",
      };
    }

    // Send email via Resend
    console.log("Sending email to:", email);
    console.log("Using API key:", apiKey.substring(0, 10) + "...");

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "Aedura <onboarding@resend.dev>",
        to: email,
        subject: subject,
        html: htmlContent,
      }),
    });

    const responseText = await response.text();
    console.log("Resend response status:", response.status);
    console.log("Resend response body:", responseText);

    if (!response.ok) {
      let errorData: { message?: string } = {};
      try {
        errorData = JSON.parse(responseText);
      } catch {
        // ignore parse errors and fall back to empty object
      }
      console.error("Resend API error:", response.status, errorData);

      // Check if it's a domain verification error
      if (
        response.status === 403 &&
        errorData.message?.includes("verify a domain")
      ) {
        return {
          success: false,
          status: 403,
          error:
            "Email domain not verified. Please verify your domain at resend.com/domains first.",
        };
      }

      return {
        success: false,
        status: 500,
        error: "Failed to send email. Please try again later.",
      };
    }

    return {
      success: true,
      status: 200,
      message: "Successfully subscribed! Check your email for confirmation.",
    };
  } catch (error) {
    console.error("API error:", error);
    return {
      success: false,
      status: 500,
      error: "Internal server error. Please try again.",
    };
  }
}

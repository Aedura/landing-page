import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Send email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Aedura <onboarding@resend.dev>', // Change this after verifying domain
        to: email,
        subject: '🎓 Welcome to Aedura - You\'re on the Waitlist!',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #000; margin-bottom: 16px;">🎓 Welcome to Aedura!</h1>
            <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 16px;">
              Thank you for joining our waitlist. We're building the future of personalized education with AI, and we're excited to have you on this journey.
            </p>
            
            <div style="background: linear-gradient(135deg, #0066ff 0%, #00ccff 100%); padding: 24px; border-radius: 8px; margin: 24px 0; color: white;">
              <h2 style="margin: 0 0 12px 0;">What's Coming</h2>
              <ul style="margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">✨ Smart AI-powered note generation</li>
                <li style="margin-bottom: 8px;">🎮 Gamified learning experiences</li>
                <li style="margin-bottom: 8px;">📊 Predictive analytics for success</li>
              </ul>
            </div>

            <p style="color: #666; font-size: 14px; line-height: 1.5; margin-bottom: 16px;">
              <strong>Launching Q1 2026</strong> with exclusive early access for our community members.
            </p>

            <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 24px 0;">
              <p style="color: #666; margin: 0; font-size: 14px;">
                <strong>Stay updated:</strong> Follow our journey and get notified when we launch. Check your email for future updates.
              </p>
            </div>

            <p style="color: #999; font-size: 12px; margin-top: 32px; border-top: 1px solid #eee; padding-top: 16px;">
              © 2025 Aedura. All rights reserved.<br/>
              <a href="https://aedura.in" style="color: #0066ff; text-decoration: none;">Visit our website</a>
            </p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    // Optionally: Save email to database (implement later)
    // await db.subscribers.create({ email });

    return NextResponse.json(
      { message: 'Successfully subscribed! Check your email for confirmation.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

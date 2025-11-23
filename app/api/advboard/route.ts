import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connector";
import { sendEmail } from "@/lib/email";
import advisor from "@/models/advisor";

export async function POST(request: NextRequest) {
  const { name, email, expertise } = await request.json();

  try {
    await connectDB();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const existingAdvisor = await advisor.findOne({
      email: email,
    });
    if (existingAdvisor) {
      return new NextResponse("Advisor already exists", { status: 409 });
    }

    const newAdvisor = new advisor({ email, name, expertise });
    await newAdvisor.save();
    console.log("Created advisor", newAdvisor);

    // Send email notification to the advisor
    const emailResult = await sendEmail(
      email,
      "Thank you for joining our advisory board",
      `<p>Dear ${name},</p><p>Thank you for joining our advisory board. We appreciate your expertise in ${expertise}.</p>`
    );

    if (!emailResult.success) {
      console.error("Failed to send email to advisor:", emailResult.error);
    }

    return new NextResponse("Advisor created successfully", {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating advisor:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Failed to create advisor",
      { status: 500 }
    );
  }
}

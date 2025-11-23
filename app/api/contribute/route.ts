import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connector";
import { sendEmail } from "@/lib/email";
import contributor from "@/models/contributor";

export async function POST(request: NextRequest) {
  const { name, email } = await request.json();

  try {
    await connectDB();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const existingContributor = await contributor.findOne({
      email: email,
    });
    if (existingContributor) {
      return new NextResponse("Contributor already exists", { status: 409 });
    }

    const newContributor = new contributor({ email, name });
    await newContributor.save();

    // Send email notification to the contributor
    const emailResult = await sendEmail(
      email,
      "Thank you for your contribution",
      `<p>Dear ${name},</p><p>Thank you for your contribution. We appreciate your support.</p>`
    );

    if (!emailResult.success) {
      console.error("Failed to send email to contributor:", emailResult.error);
    }

    console.log("Created contributor", newContributor);
    return new NextResponse("Contributor created successfully", {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating contributor:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Failed to create contributor",
      { status: 500 }
    );
  }
}

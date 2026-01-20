import { sendEmail } from "@/lib/mailer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, subject, body } = await request.json();

    if (!email || !subject || !body) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    await sendEmail({
      to: email,
      subject: subject,
      text: body,
    });

    return NextResponse.json({ message: "Reply sent successfully" });
  } catch (error: any) {
    console.error("Email reply error:", error);
    return NextResponse.json({ error: "Failed to send email reply" }, { status: 500 });
  }
}

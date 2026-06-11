import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: process.env.CONTACT_EMAIL || 'sargarapremrajesh@gmail.com',
      subject: `[Portfolio Contact] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <div style="font-family: monospace; background: #0a0a0b; color: #e0e0e0; padding: 24px; border-radius: 8px;">
          <div style="border-bottom: 1px solid #333; padding-bottom: 12px; margin-bottom: 16px;">
            <span style="color: #00ffff; font-weight: bold;">PRS-MAIL</span>
            <span style="color: #666;"> v1.0 — Transmission</span>
          </div>
          <table style="font-size: 13px; line-height: 1.8;">
            <tr><td style="color: #888; padding-right: 16px;">From</td><td style="color: #fff;">${name}</td></tr>
            <tr><td style="color: #888; padding-right: 16px;">Email</td><td style="color: #00ffff;">${email}</td></tr>
            <tr><td style="color: #888; padding-right: 16px;">Subject</td><td style="color: #fff;">${subject}</td></tr>
          </table>
          <div style="border-top: 1px solid #333; margin-top: 16px; padding-top: 16px; color: #ccc; font-size: 13px; white-space: pre-wrap;">${message}</div>
          <div style="border-top: 1px solid #222; margin-top: 24px; padding-top: 12px; font-size: 11px; color: #555;">
            Encrypted via PRS-MAIL Protocol | AES-256
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to send email:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}

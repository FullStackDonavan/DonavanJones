import { Resend } from 'resend'
import * as dotenv from 'dotenv'
dotenv.config()

// onboarding@resend.dev works for testing; set MAIL_FROM once the
// donavanjones.com domain is verified in Resend
const FROM = process.env.MAIL_FROM || 'Donavan Jones <onboarding@resend.dev>'

export interface MailOptions {
    to: string
    subject: string
    html: string
}

export async function sendMail(options: MailOptions): Promise<boolean> {
    if (!process.env.RESEND_API_KEY) {
        console.error('Mailer not configured: set the RESEND_API_KEY env var')
        return false
    }
    try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        const { error } = await resend.emails.send({
            from: FROM,
            to: options.to,
            subject: options.subject,
            html: options.html,
        })
        if (error) {
            console.error('Error sending mail:', error)
            return false
        }
        return true
    } catch (error) {
        console.error('Error sending mail:', error)
        return false
    }
}

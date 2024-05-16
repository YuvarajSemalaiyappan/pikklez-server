import nodemailer from 'nodemailer';

export async function sendEmail(options) {
    const transport = {
        host: process.env.SMTP_HOST,
        secure: true,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER, // Your Gmail email address
            pass: process.env.SMTP_PASS  // Your Gmail password or an app-specific password
        }
    };

    const transporter = nodemailer.createTransport(transport);

    const message = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`, // Use your Gmail email address
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transporter.sendMail(message);
}

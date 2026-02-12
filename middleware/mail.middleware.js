require('dotenv').config();

const nodemailer = require('nodemailer');
const db = require('../db');

async function getEmail(user_id) {
    const [result] = await db.query(
        'SELECT user_email FROM user WHERE user_id = ?',
        [user_id]
    );

    if (result.length === 0) {
        throw new Error('USER_NOT_FOUND');
    }

    return result[0].user_email;
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
})

module.exports = async (req, res, next) => {
    if (!req.mail) return next();

    const { user_id, title, message, link } = req.mail;

    let email;

    try {
        email = await getEmail(user_id);
    } catch (err) {
        console.warn("Email not sent, user not found:", user_id);
        return next();
    }

    try {
        const info = await transporter.sendMail({
            from: '"Animate Well Task Management" animatewell@gmail.com',
            to: email,
            subject: title,
            text: message,
            html: `
            <div style="background-color:#f4f5f7; padding:40px 0; font-family: Arial, Helvetica, sans-serif;">
                <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:auto;">
                <tr>
                    <td style="background-color:#ffffff; border-radius:8px; padding:24px; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                    
                        <h2 style="margin:0 0 16px; color:#172b4d; font-size:20px;">
                            ${title}
                        </h2>

                        <p style="margin:0 0 20px; color:#44546f; font-size:15px; line-height:1.6;">
                            ${message}
                        </p>

                        <a href="https://${link}" style="display:inline-block; padding:12px 18px; background:#0052cc; color:#ffffff; text-decoration:none; border-radius:6px; font-size:14px;">
                            Open in Animate Well
                        </a>

                        <hr style="border:none; border-top:1px solid #e4e6ea; margin:24px 0;" />

                        <p style="margin:0; font-size:12px; color:#7a869a;">
                            This notification was sent by <b>Animate Well Task Management</b>.
                            <br />
                            Please do not reply to this email.
                        </p>

                    </td>
                </tr>

                    <tr>
                        <td style="height:20px;"></td>
                    </tr>   
                </table>
            </div>`,
        })

        req.emailSent = true;
        next();
    } catch (err) {
        console.warn("Email middleware error:", err);
        next();
    }
}
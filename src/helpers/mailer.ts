import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

interface EmailParams {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
}

export const sendEmail = async ({ email, emailType, userId }: EmailParams) => {
  try {
    // create a hashed token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000, // 1 hour
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000, // 1 hour
      });
    }

    let transport = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST || "sandbox.smtp.mailtrap.io",
      port: parseInt(process.env.MAILTRAP_PORT || "2525"),
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const isVerifyEmail = emailType === "VERIFY";
    const actionUrl = isVerifyEmail
      ? `${process.env.DOMAIN}/verifyemail?token=${hashedToken}`
      : `${process.env.DOMAIN}/reset-password?token=${hashedToken}`;

    const mailOptions = {
      from: process.env.FROM_EMAIL || "meet.adlakha@gmail.com",
      to: email,
      subject: isVerifyEmail ? "Verify your email" : "Reset your password",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${
            isVerifyEmail ? "Verify Your Email" : "Reset Your Password"
          }</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">
              ${isVerifyEmail ? "Verify Your Email" : "Reset Your Password"}
            </h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-bottom: 25px;">
              ${
                isVerifyEmail
                  ? "Thank you for signing up! Please verify your email address to complete your registration."
                  : "You requested a password reset. Click the button below to set a new password for your account."
              }
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${actionUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold; 
                        font-size: 16px;
                        display: inline-block;">
                ${isVerifyEmail ? "Verify Email Address" : "Reset Password"}
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            <p style="font-size: 14px; color: #667eea; word-break: break-all; background: #fff; padding: 10px; border-radius: 5px;">
              ${actionUrl}
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="font-size: 12px; color: #888; margin: 0;">
                This link will expire in 1 hour for security reasons.
              </p>
              <p style="font-size: 12px; color: #888; margin: 5px 0 0 0;">
                If you didn't ${
                  isVerifyEmail
                    ? "create an account"
                    : "request a password reset"
                }, please ignore this email.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Email sending failed";
    console.error("Email sending error:", error);
    throw new Error(errorMessage);
  }
};

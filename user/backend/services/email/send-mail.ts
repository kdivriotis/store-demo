import { createTransport } from "nodemailer";

/**
 * Function to send email from website to selected receiver
 * @param {string} receiver Email address of the receiver to send the email to
 * @param {string} subject Subject of the email that will be sent
 * @param {string?} text Plain text for the email's body (should be undefined if HTML is being used for body)
 * @param {string?} html HTML formatted text for the email's body (should be undefined if plain text is being used for body)
 * @returns {boolean} True or false, based on the success of sending the email
 */
export const sendEmail = async (
  receiver: string,
  subject: string,
  text?: string,
  html?: string
): Promise<boolean> => {
  const smtpPort = parseInt(process.env.SMTP_PORT || "25");

  const transporter = createTransport({
    host: process.env.SMTP_SERVER,
    port: smtpPort,
    secure: smtpPort === 465, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      // do not fail for invalid certs
      rejectUnauthorized: false,
    },
  });

  // send mail with defined transport object
  try {
    await transporter.sendMail({
      from: `Store Demo <${process.env.SMTP_EMAIL}>`, // sender address
      to: receiver, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: html, // html body
    });
    return true;
  } catch (error) {
    return false;
  }
};

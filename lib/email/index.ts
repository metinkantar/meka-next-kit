import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// E-posta şablonunu yükle
const loadTemplate = (templatePath: string, variables: { [key: string]: string }) => {
  let template = fs.readFileSync(path.join(process.cwd(), templatePath), 'utf8');
  for (const [key, value] of Object.entries(variables)) {
    template = template.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), value);
  }
  return template;
};

// Nodemailer transporter oluştur
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// E-posta gönderme fonksiyonu
export const sendVerificationEmail = async (email: string, verificationUrl: string) => {
  const templatePath = 'lib/emailtemplates/email-verification.html';
  const emailTemplate = loadTemplate(templatePath, { verificationUrl });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'MeKaCoDe - E-posta Adresinizi Doğrulayın',
    html: emailTemplate,
  };

  await transporter.sendMail(mailOptions);
};

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Parolanızı Sıfırlayın",
    text: `Parolanızı sıfırlamak için aşağıdaki bağlantıyı kullanın: ${resetUrl}`,
    html: `<p>Parolanızı sıfırlamak için <a href="${resetUrl}">bu bağlantıyı</a> kullanın.</p>`,
  };

  await transporter.sendMail(mailOptions);
}
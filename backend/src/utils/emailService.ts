import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // Adjust to your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendDefaultPasswordEmail = async (
  to: string,
  password: string
) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your Default Password',
    text: `Welcome! Your default password is: ${password}. Please log in and change it immediately.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Default password ${password} sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send default password email');
  }
};

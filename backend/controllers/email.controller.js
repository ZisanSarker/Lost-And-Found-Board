const nodemailer = require('nodemailer');

exports.sendEmails = async (req, res) => {
  const { senderEmail, receiverEmail, message } = req.body;
  console.log("test")

  if (!senderEmail || !receiverEmail || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    // Email to receiver
    const receiverMail = {
      from: process.env.NODEMAILER_USER,
      to: receiverEmail,
      subject: '📨 New Message from a User of Lost & Found Board',
      text: `You received a message from ${senderEmail}:\n\n${message}`,
    };

    // Email to sender
    const senderMail = {
      from: process.env.NODEMAILER_USER,
      to: senderEmail,
      subject: '✅ Your message was sent!',
      text: `Hey! Your message was successfully sent to ${receiverEmail}.\n\nYour message:\n${message}`,
    };

    // Send both emails
    await transporter.sendMail(receiverMail);
    await transporter.sendMail(senderMail);

    res.status(200).json({ success: true, message: 'Emails sent to both users.' });
  } catch (error) {
    console.error('Error sending email:', error.message);
    res.status(500).json({ success: false, error: 'Failed to send emails.' });
  }
};
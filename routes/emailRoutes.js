
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');


const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || 'Gbe Igi';

if (!EMAIL_USER || !EMAIL_PASS) {
  console.warn('⚠️ EMAIL_USER ou EMAIL_PASS não configurados — envio de e-mail pode falhar.');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});


router.post('/', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ success: false, message: 'Campos name e email obrigatórios.' });

 
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  const mailOptions = {
    from: `"${EMAIL_FROM_NAME}" <${EMAIL_USER}>`,
    to: email,
    subject: 'Código de acesso - Gbe Igi',
    text: `Olá ${name},\n\nSeu código de acesso ao Gbe Igi é: ${code}\n\nNão compartilhe este código.\n\nAtenciosamente,\nGbe Igi`,
    html: `<p>Olá <strong>${name}</strong>,</p>
           <p>Seu código de acesso ao <strong>Gbe Igi</strong> é: <strong>${code}</strong></p>
           <p>Não compartilhe este código.</p>
           <p>Atenciosamente,<br/><strong>Gbe Igi</strong></p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: 'E-mail enviado', code }); 
  } catch (err) {
    console.error('Erro ao enviar e-mail:', err);
    return res.status(500).json({ success: false, message: 'Erro ao enviar e-mail' });
  }
});

module.exports = router;

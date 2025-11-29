const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const feedbackFile = path.join(__dirname, '../data/feedback.json');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

router.post('/', (req, res) => {
  const { nome, email, mensagem } = req.body;

  if (!nome || !email || !mensagem) {
    return res.status(400).json({ error: 'Preencha todos os campos!' });
  }

  let feedbacks = [];
  if (fs.existsSync(feedbackFile)) {
    const data = fs.readFileSync(feedbackFile);
    feedbacks = JSON.parse(data);
  }

  const novoFeedback = { nome, email, mensagem, data: new Date().toISOString() };
  feedbacks.push(novoFeedback);
  fs.writeFileSync(feedbackFile, JSON.stringify(feedbacks, null, 2));

  const mailOptions = {
    from: `"Gbe Igi" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, 
    subject: `Novo Feedback de ${nome}`,
    text: `Nome: ${nome}\nE-mail: ${email}\nMensagem: ${mensagem}`
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log('Erro ao enviar e-mail:', err);
      return res.status(500).json({ error: 'Erro ao enviar feedback por e-mail.' });
    } else {
      console.log('Feedback enviado:', info.response);
      return res.json({ message: 'Feedback enviado com sucesso!' });
    }
  });
});

module.exports = router;

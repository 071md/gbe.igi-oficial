const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'seuemail@gmail.com',      
    pass: 'sua-senha-de-aplicativo'   
  }
});

router.post('/', async (req, res) => {
  const { nome, email } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ error: 'Nome e e-mail são obrigatórios.' });
  }

  const mailOptions = {
    from: `"Gbe Igi" <seuemail@gmail.com>`,
    to: email,
    subject: 'Bem-vindo ao Gbe Igi!',
    html: `<p>Olá <strong>${nome}</strong>!</p>
           <p>Obrigado por se conectar ao <strong>Gbe Igi</strong>.</p>
           <p>Você está pronto para explorar nosso site!</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'E-mail enviado com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Não foi possível enviar o e-mail.' });
  }
});

module.exports = router;

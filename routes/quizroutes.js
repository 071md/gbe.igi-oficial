const express = require('express');
const router = express.Router();
//salva a merda da pontuação
router.get('/', (req, res) => {
  res.json({ message: 'Rota de quiz funcionando' });
});

module.exports = router;

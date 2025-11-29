import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';




const app = express();
const PORT = 3000;


app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));


const DATA_DIR = './data';
const RANKING_FILE = path.join(DATA_DIR, 'ranking.json');
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedback.json');


if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(RANKING_FILE)) fs.writeFileSync(RANKING_FILE, '[]');
if (!fs.existsSync(FEEDBACK_FILE)) fs.writeFileSync(FEEDBACK_FILE, '[]');


app.post('/save-score', (req, res) => {
  console.log("Recebido /save-score:", req.body);


  const name = req.body.name || req.body.player || req.body.username;
  const points = req.body.points ?? req.body.score;


  if (!name || points === undefined) {
    return res.status(400).json({ error: 'Dados inválidos', received: req.body });
  }


  const data = JSON.parse(fs.readFileSync(RANKING_FILE, 'utf8'));
  data.push({ name, points });
  data.sort((a, b) => b.points - a.points);
  fs.writeFileSync(RANKING_FILE, JSON.stringify(data, null, 2));


  res.json({ success: true });
});


app.get('/get-ranking', (req, res) => {
  const data = JSON.parse(fs.readFileSync(RANKING_FILE, 'utf8'));
  res.json(data);
});


app.post('/send-feedback', (req, res) => {
  const { name, email, message } = req.body;


  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando', received: req.body });
  }


  const data = JSON.parse(fs.readFileSync(FEEDBACK_FILE, 'utf8'));
  data.push({ name, email, message, date: new Date().toISOString() });
  fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(data, null, 2));


  res.json({ success: true });
});


function readRanking() {
  if (!fs.existsSync(RANKING_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(RANKING_FILE, 'utf8'));
  } catch {
    return [];
  }
}


function saveRanking(ranking) {
  fs.writeFileSync(RANKING_FILE, JSON.stringify(ranking, null, 2));
}


app.listen(PORT, () => {
  console.log(`Servidor Gbè Igi rodando na porta ${PORT} 🌱`);
});



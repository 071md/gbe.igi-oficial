const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "data");

const scoresFile = path.join(dataPath, "scores.json");
const feedbackFile = path.join(dataPath, "feedback.json");

function readJSON(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "[]", "utf8");
    }
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data || "[]");
  } catch (error) {
    console.error("Erro ao ler arquivo:", error);
    return [];
  }
}

function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Erro ao salvar arquivo:", error);
  }
}

function getScores() {
  return readJSON(scoresFile);
}

function addScore(newScore) {
  const scores = readJSON(scoresFile);
  scores.push(newScore);
  writeJSON(scoresFile, scores);
  return newScore;
}


function getFeedbacks() {
  return readJSON(feedbackFile);
}

function addFeedback(newFeedback) {
  const feedbacks = readJSON(feedbackFile);
  feedbacks.push(newFeedback);
  writeJSON(feedbackFile, feedbacks);
  return newFeedback;
}

module.exports = {
  getScores,
  addScore,
  getFeedbacks,
  addFeedback,
};

const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const { startSession } = require('./whatsapp');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// User DB file
const userDB = path.join(__dirname, 'users.json');

// Create user db if missing
if (!fs.existsSync(userDB)) fs.writeFileSync(userDB, JSON.stringify([]));

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/login.html');
});

app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/views/signup.html');
});

app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync(userDB));
  if (users.find(u => u.username === username)) return res.send('Username exists');
  users.push({ username, password });
  fs.writeFileSync(userDB, JSON.stringify(users));
  res.redirect('/');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync(userDB));
  const user = users.find(u => u.username === username && u.password === password);
  if (user) return res.redirect('/dashboard');
  return res.send('Invalid credentials');
});

app.get('/dashboard', (req, res) => {
  res.sendFile(__dirname + '/views/dashboard.html');
});

app.post('/pair', async (req, res) => {
  const { phone } = req.body;
  try {
    const code = await startSession(phone);
    res.json({ code });
  } catch (e) {
    console.log(e);
    res.status(500).send('Error starting session');
  }
});

app.listen(PORT, () => {
  console.log(`TMK site running on http://localhost:${PORT}`);
}); 

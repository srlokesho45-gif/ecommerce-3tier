const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 🔗 Connect MongoDB
mongoose.connect('mongodb://database:27017/devopsDB')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// 🧾 User Schema
const User = mongoose.model('User', {
  username: String,
  password: String
});
const bcrypt = require('bcrypt');
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    password: hashedPassword
  });

  await user.save();

  res.send("User Registered ✅");
});



app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ username }, "secretkey");
    res.json({ message: "Login Success ✅", token });
  } else {
    res.send("Invalid Credentials ❌");
  }
});

app.listen(3000, () => console.log("Server running 🚀"));
app.get('/profile', (req, res) => {
  const token = req.headers['authorization'];

  app.get('/profile', (req, res) => {
  try {
    const data = jwt.verify(token, "secretkey");
    res.send("Welcome " + data.username + " 👋");
  } catch {
    res.send("Unauthorized ");
  }
  });
});

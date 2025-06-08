require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Replace with your connection string
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('Mongo Error:', err));

app.listen(5000, () => console.log('Server running on port 5000'));

const User = require('../models/User');
const bcrypt = require('bcryptjs');



// Create user
app.post('../backend/api/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.json({ message: 'User created!' });
  } catch (err) {
    res.status(400).json({ error: 'User creation failed', details: err.message });
  }
});

app.use(express.static('public'));


const jwt = require('jsonwebtoken');

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) return res.status(400).json({ error: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid password' });

  const token = jwt.sign({ id: user._id }, 'secret123'); // Replace 'secret123' with an env var in real projects
  res.json({ message: 'Login successful', token });
});

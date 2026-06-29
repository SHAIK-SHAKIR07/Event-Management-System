const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const dns = require('dns');

dotenv.config();
dns.setDefaultResultOrder('ipv4first');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://eventhub-frontend.vercel.app',
    /\.vercel\.app$/  // allows all vercel subdomains
  ],
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/tickets', require('./routes/tickets'));

mongoose.connect(process.env.MONGO_URI, {
  family: 4,
  serverSelectionTimeoutMS: 10000,
})
.then(() => console.log('✅ MongoDB Atlas Connected'))
.catch(err => console.log('❌ DB Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
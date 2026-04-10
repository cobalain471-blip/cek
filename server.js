const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// ===== CONFIG =====
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== STATIC FILE =====
app.use(express.static('public'));

// ===== ROUTE TEST (ANTI ERROR) =====
app.get('/test', (req, res) => {
    res.send("SERVER HIDUP 🔥");
});

// ===== HOMEPAGE =====
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== DATABASE CONNECT (ANTI CRASH) =====
mongoose.connect(process.env.MONGO_URL || "")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => {
    console.log("❌ Mongo Error:", err.message);
});

// ===== ERROR HANDLER (WAJIB) =====
process.on('uncaughtException', (err) => {
    console.log('❌ Uncaught Error:', err.message);
});

process.on('unhandledRejection', (err) => {
    console.log('❌ Unhandled Rejection:', err);
});

// ===== START SERVER =====
app.listen(PORT, () => {
    console.log(`🚀 Server jalan di port ${PORT}`);
});

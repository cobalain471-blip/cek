const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'secret123',
    resave: false,
    saveUninitialized: true
}));

mongoose.connect(process.env.MONGO_URL);

// SCHEMA
const Klik = mongoose.model('Klik', {
    type: String,
    waktu: { type: Date, default: Date.now }
});

const Bayar = mongoose.model('Bayar', {
    jumlah: Number,
    waktu: { type: Date, default: Date.now }
});

// API
app.post('/klik-thumbnail', async (req, res) => {
    await Klik.create({ type: "thumbnail" });
    res.send("ok");
});

app.post('/klik-bayar', async (req, res) => {
    await Klik.create({ type: "bayar" });
    res.send("ok");
});

app.post('/bayar', async (req, res) => {
    await Bayar.create({ jumlah: req.body.jumlah });
    res.send("ok");
});

// DASHBOARD
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <title>Video Viral 🔥</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <style>
            body {
                margin:0;
                background:#0f0f0f;
                font-family: Arial;
                color:white;
                text-align:center;
            }
            h1 {
                color:#ff0055;
            }
            .container {
                padding:20px;
            }
            .video {
                background:#1a1a1a;
                margin:15px 0;
                padding:10px;
                border-radius:10px;
                cursor:pointer;
            }
            .video img {
                width:100%;
                border-radius:10px;
            }
            .btn {
                background:#ff0055;
                padding:12px;
                border:none;
                color:white;
                width:100%;
                border-radius:8px;
                margin-top:10px;
                font-size:16px;
            }
            #popup {
                display:none;
                position:fixed;
                top:0;
                left:0;
                width:100%;
                height:100%;
                background:rgba(0,0,0,0.9);
                justify-content:center;
                align-items:center;
            }
            .box {
                background:#1a1a1a;
                padding:20px;
                border-radius:10px;
            }
        </style>
    </head>

    <body>

        <div class="container">
            <h1>🔥 Video Viral Hari Ini</h1>

            <div class="video" onclick="klikVideo()">
                <img src="https://via.placeholder.com/300x200">
                <p>Video 1 - Lagi rame banget 😱</p>
            </div>

            <div class="video" onclick="klikVideo()">
                <img src="https://via.placeholder.com/300x200">
                <p>Video 2 - Jangan ditonton sendirian 😳</p>
            </div>
        </div>

        <!-- POPUP BAYAR -->
        <div id="popup">
            <div class="box">
                <h2>🔒 Akses Premium</h2>
                <p>Bayar Rp5.000 untuk buka video</p>

                <img src="LINK_QRIS_KAMU" width="200"><br><br>

                <button class="btn" onclick="bayar()">Saya Sudah Bayar</button>
            </div>
        </div>

        <script>
            function klikVideo(){
                fetch('/klik-thumbnail', {method:'POST'});
                document.getElementById('popup').style.display='flex';
            }

            function bayar(){
                fetch('/klik-bayar', {method:'POST'});

                fetch('/bayar', {
                    method:'POST',
                    headers:{'Content-Type':'application/json'},
                    body: JSON.stringify({ jumlah: 5000 })
                });

                alert("Pembayaran diterima! 🔥");
                
                // redirect ke video asli
                window.location.href = "https://linkvideokamu.com";
            }
        </script>

    </body>
    </html>
    `);
});

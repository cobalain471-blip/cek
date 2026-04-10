const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// DATABASE FAKE (memory)
const payments = {};

// HOME
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// ADMIN PAGE
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public/admin.html"));
});

// CREATE PAYMENT
app.post("/create-payment", (req, res) => {
  const id = Date.now().toString();

  payments[id] = {
    id,
    status: "pending",
    createdAt: new Date().toISOString()
  };

  res.json({
    paymentId: id,
    qr: "QRIS-DUMMY-" + id
  });
});

// PAYMENT SUCCESS SIMULATION
app.post("/pay-success", (req, res) => {
  const { paymentId } = req.body;

  if (!payments[paymentId]) {
    return res.status(404).json({ success: false });
  }

  payments[paymentId].status = "paid";

  res.json({ success: true });
});

// ADMIN API
app.get("/api/payments", (req, res) => {
  res.json(Object.values(payments));
});

// SUCCESS PAGE
app.get("/success", (req, res) => {
  res.sendFile(path.join(__dirname, "public/success.html"));
});

// PORT RAILWAY
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
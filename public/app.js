let paymentId = null;

async function buy() {
  const res = await fetch("/create-payment", {
    method: "POST"
  });

  const data = await res.json();

  paymentId = data.paymentId;

  document.getElementById("paymentBox").classList.remove("hidden");
  document.getElementById("qr").innerText = data.qr;
}

async function simulatePay() {
  await fetch("/pay-success", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ paymentId })
  });

  window.location.href = "/success";
}
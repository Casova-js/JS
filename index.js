const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Startpunkt
app.get("/", (req, res) => {
  res.send("Casova Proxy är igång.");
});

// POST-endpoint för webhook
app.post("/", (req, res) => {
  console.log("Mottaget body:", req.body); // Logga inkommande data

  const redirectUrl = req.body.redirect_url;

  if (!redirectUrl) {
    return res.status(400).json({ error: "Ingen redirect_url hittades i anropet." });
  }

  res.redirect(302, redirectUrl);
});

// Starta servern
app.listen(port, () => {
  console.log(`Servern körs på port ${port}`);
});

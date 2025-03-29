const express = require('express');
const app = express();

// Gör att servern kan läsa JSON från inkommande POST-anrop
app.use(express.json());

// Root-endpoint för att verifiera att servern är igång (valfritt)
app.get('/', (req, res) => {
  res.send('✅ Proxy-servern är igång!');
});

// Webhook-mottagare: ta emot redirect_url och returnera det
app.post('/', (req, res) => {
  const redirectUrl = req.body.redirect_url;

  if (redirectUrl) {
    res.status(200).json({ redirect_url: redirectUrl });
  } else {
    res.status(400).json({ error: 'Ingen redirect_url hittades i anropet.' });
  }
});

// Kör på Render (Render använder PORT-variabel)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servern körs på port ${PORT}`);
});

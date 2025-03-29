const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 10000;

// Middleware
app.use(cors()); // Tillåter alla origins (du kan anpassa om du vill)
app.use(bodyParser.json());

// Root endpoint för webhook
app.post('/', (req, res) => {
  try {
    const redirectUrl = req.body.customData?.redirect_url;

    if (!redirectUrl) {
      console.warn('⚠️ Ingen redirect_url hittades i anropet:', JSON.stringify(req.body, null, 2));
      return res.status(400).json({ error: 'Ingen redirect_url hittades i anropet.' });
    }

    console.log('✅ Redirect URL mottagen:', redirectUrl);
    res.status(200).json({ redirect_url: redirectUrl });

  } catch (error) {
    console.error('❌ Ett serverfel uppstod:', error);
    res.status(500).json({ error: 'Serverfel vid bearbetning av anropet.' });
  }
});

// Fallback för andra endpoints
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint finns inte.' });
});

app.listen(port, () => {
  console.log(`🚀 Servern körs på port ${port}`);
});

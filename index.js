const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 10000;

// === BYT TILL DIN RIKTIGA API-NYCKEL ===
const GHL_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6ImUyc3VKckp0NEE1OXA0UWFoaDFZIiwiY29tcGFueV9pZCI6IkRHbkVsM1B5c3hHYzQxanZ5MWw4IiwidmVyc2lvbiI6MSwiaWF0IjoxNzAzNzczMzM1NjE5LCJzdWIiOiJ1c2VyX2lkIn0.TAJ03agrZf8SWTOFhMzHk1mqWUa-1LfE50fpgFqOxCg"; // <-- GLÖM INTE citattecken!

app.use(cors());
app.use(bodyParser.json());

app.post('/', async (req, res) => {
  try {
    const email = req.body.email;

    if (!email) {
      return res.status(400).json({ error: 'Ingen e-post mottagen.' });
    }

    console.log(`🔍 Letar efter kontakt med e-post: ${email}`);

    const contactRes = await axios.get(
      `https://rest.gohighlevel.com/v1/contacts/lookup?email=${encodeURIComponent(email)}`,
      {
        headers: {
          Authorization: `Bearer ${GHL_API_KEY}`
        }
      }
    );
    
    console.log('🔎 Fullt kontaktobjekt från GHL:', JSON.stringify(contactRes.data, null, 2));

    const contact = contactRes.data.contact;

    if (!contact || !contact.customField) {
      return res.status(404).json({ error: 'Kontakt hittades inte eller saknar custom fields.' });
    }

    console.log('Alla custom fields från kontakten:', contact.customField);
    const redirectField = contact.customField.find(f => f.name === 'redirect_url');
    const redirectUrl = redirectField?.value;

    if (!redirectUrl) {
      return res.status(404).json({ error: 'Ingen redirect_url hittades i kontakten.' });
    }

    console.log('✅ Redirect-URL hämtad:', redirectUrl);
    res.status(200).json({ redirect_url: redirectUrl });

  } catch (error) {
    console.error('❌ Fel vid API-anrop:', error.response?.data || error.message);
    res.status(500).json({ error: 'Ett fel uppstod vid hämtning.' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servern är igång på port ${port}`);
});

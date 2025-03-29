const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 10000;

// === ÄNDRA TILL DIN API-NYCKEL FRÅN GHL ===
const eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6ImUyc3VKckp0NEE1OXA0UWFoaDFZIiwiY29tcGFueV9pZCI6IkRHbkVsM1B5c3hHYzQxanZ5MWw4IiwidmVyc2lvbiI6MSwiaWF0IjoxNzAzNzczMzM1NjE5LCJzdWIiOiJ1c2VyX2lkIn0.TAJ03agrZf8SWTOFhMzHk1mqWUa-1LfE50fpgFqOxCg = 'din-api-nyckel-här'; // <-- byt ut denna!

app.use(cors());
app.use(bodyParser.json());

app.post('/', async (req, res) => {
  try {
    const email = req.body.email;

    if (!email) {
      console.log('Ingen e-post mottagen:', req.body);
      return res.status(400).json({ error: 'Ingen e-post mottagen.' });
    }

    console.log(`🔍 Söker kontakt för e-post: ${email}`);

    // 1. Hämta kontakt baserat på e-post
    const contactResponse = await axios.get(`https://rest.gohighlevel.com/v1/contacts/lookup?email=${encodeURIComponent(email)}`, {
      headers: {
        Authorization: `Bearer ${GHL_API_KEY}`
      }
    });

    const contact = contactResponse.data.contact;

    if (!contact || !contact.id) {
      return res.status(404).json({ error: 'Kontakt hittades inte.' });
    }

    console.log(`✅ Kontakt hittad: ${contact.id}`);

    // 2. Leta upp redirect_url i custom fields
    const redirectField = contact.customField.find(f => f.name === 'redirect_url');
    const redirectUrl = redirectField?.value;

    if (!redirectUrl) {
      return res.status(404).json({ error: 'Ingen redirect_url hittades i kontakten.' });
    }

    console.log('➡️ Redirect URL:', redirectUrl);

    res.status(200).json({ redirect_url: redirectUrl });

  } catch (error) {
    console.error('❌ Fel vid hämtning:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Serverfel vid hämtning av kontakt eller redirect_url.' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servern körs på port ${port}`);
});

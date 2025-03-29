const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Ersätt detta med din riktiga GHL API-nyckel
const GHL_API_KEY = 'DIN_API_NYCKEL_HÄR';

// Namnet på custom field i GHL
const CUSTOM_FIELD_NAME = 'redirect_url';

// Mellanlagring av custom field ID (för att inte slå upp varje gång)
let cachedCustomFields = [];

app.use(express.json());

app.post('/', async (req, res) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).json({ error: 'Ingen e-postadress angiven' });
  }

  try {
    // 1. Hämta kontakt
    const contactRes = await axios.get(`https://rest.gohighlevel.com/v1/contacts/lookup?email=${email}`, {
      headers: {
        Authorization: `Bearer ${GHL_API_KEY}`
      }
    });

    const contact = contactRes.data.contact;
    if (!contact) {
      return res.status(404).json({ error: 'Kontakt hittades inte' });
    }

    // 2. Hämta custom field ID (en gång)
    if (cachedCustomFields.length === 0) {
      const fieldsRes = await axios.get('https://rest.gohighlevel.com/v1/custom-fields', {
        headers: {
          Authorization: `Bearer ${eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6ImUyc3VKckp0NEE1OXA0UWFoaDFZIiwiY29tcGFueV9pZCI6IkRHbkVsM1B5c3hHYzQxanZ5MWw4IiwidmVyc2lvbiI6MSwiaWF0IjoxNzAzNzczMzM1NjE5LCJzdWIiOiJ1c2VyX2lkIn0.TAJ03agrZf8SWTOFhMzHk1mqWUa-1LfE50fpgFqOxCg}`
        }
      });

      cachedCustomFields = fieldsRes.data.customFields;
    }

    const redirectField = cachedCustomFields.find(f => f.key === CUSTOM_FIELD_NAME);
    if (!redirectField) {
      return res.status(500).json({ error: 'Custom field redirect_url saknas' });
    }

    // 3. Hämta redirect_url från kontaktens fält
    const redirectValue = contact.customField[redirectField.id];

    if (!redirectValue) {
      return res.status(404).json({ error: 'redirect_url saknas för denna kontakt' });
    }

    // 4. Skicka tillbaka redirect_url
    return res.json({ redirect: redirectValue });

  } catch (error) {
    console.error('Fel:', error.message || error);
    return res.status(500).json({ error: 'Ett fel uppstod' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxyservern körs på port ${PORT}`);
});

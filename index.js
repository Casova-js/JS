const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 10000;

app.use(bodyParser.json());

app.post('/', async (req, res) => {
  const email = req.body.email;
  if (!email) {
    return res.status(400).json({ error: 'E-post saknas i anropet.' });
  }

  try {
    const response = await axios.get(
      `https://api.gohighlevel.com/v1/contacts/search?email=${encodeURIComponent(email)}`,
      {
        headers: {
          Authorization: `Bearer DIN_API_NYCKEL`, // byt ut till din faktiska GHL API-nyckel
        },
      }
    );

    const contact = response.data.contacts?.[0];
    if (!contact) {
      return res.status(404).json({ error: 'Kontakt hittades inte.' });
    }

    const redirectField = contact.customField.find(f => f.fieldKey === 'contact.redirect_url');
    const redirectUrl = redirectField?.value;

    if (!redirectUrl) {
      return res.status(404).json({ error: 'Ingen redirect-url hittades i svaret.' });
    }

    console.log('✅ Redirect-url:', redirectUrl);
    res.status(200).json({ redirect_url: redirectUrl });

  } catch (error) {
    console.error('❌ Fel vid hämtning:', error.message);
    res.status(500).json({ error: 'Ett serverfel uppstod.' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servern körs på port ${port}`);
});

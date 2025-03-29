const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 10000;

app.use(bodyParser.json());

app.post('/', async (req, res) => {
  const email = req.body.email;

  if (!email) {
    console.log('Ingen e-post mottagen:', req.body);
    return res.status(400).json({ error: 'Ingen e-postadress mottagen i anropet.' });
  }

  try {
    // Skapa GHL API-anrop
    const apiKey = process.env.GHL_API_KEY; // Lägg till i Render som secret
    const response = await fetch(`https://rest.gohighlevel.com/v1/contacts/search?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const json = await response.json();
    const contact = json.contacts?.[0];

    if (!contact || !contact.customField) {
      console.log('Ingen kontakt eller redirect-url hittades.');
      return res.status(404).json({ error: 'Ingen redirect_url hittades i GHL.' });
    }

    const redirectField = contact.customField.find(f => f.fieldKey === 'contact.redirect_url');
    const redirectUrl = redirectField?.value;

    if (!redirectUrl) {
      console.log('redirect_url-fältet är tomt.');
      return res.status(404).json({ error: 'redirect_url är tomt.' });
    }

    res.json({ redirect_url: redirectUrl });
  } catch (error) {
    console.error('Fel i servern:', error);
    res.status(500).json({ error: 'Ett fel uppstod vid kontakt med GHL.' });
  }
});

app.listen(port, () => {
  console.log(`Proxyservern körs på port ${port}`);
});

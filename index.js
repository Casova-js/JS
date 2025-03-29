const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // <--- viktigt!
const app = express();
const port = process.env.PORT || 10000;

app.use(cors()); // <--- tillåter externa anrop
app.use(bodyParser.json());

app.post('/', (req, res) => {
  try {
    const email = req.body.email;
    if (!email) {
      console.log('Ingen e-post mottagen:', req.body);
      return res.status(400).json({ error: 'Ingen e-post mottagen.' });
    }

    // Test: logga inkommande
    console.log(`Mottagen e-post: ${email}`);

    // Här behöver du lägga in logik för att hämta kontaktens redirect_url via GHL API, t.ex. med access_token
    // Just nu testar vi med ett fejkvärde:
    const redirectUrl = "https://casova.eu/test-sida";

    if (!redirectUrl) {
      return res.status(404).json({ error: 'Ingen redirect_url hittades.' });
    }

    res.status(200).json({ redirect_url: redirectUrl });

  } catch (error) {
    console.error('Serverfel:', error);
    res.status(500).json({ error: 'Serverfel vid bearbetning av anropet.' });
  }
});

app.listen(port, () => {
  console.log(`Servern körs på port ${port}`);
});

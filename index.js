const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 10000;

app.use(bodyParser.json());

app.post('/', (req, res) => {
  try {
    const redirectUrl = req.body.customData?.redirect_url;

    if (!redirectUrl) {
      console.log('Ingen redirect_url hittades i anropet:', req.body);
      return res.status(400).json({ error: 'Ingen redirect_url hittades i anropet.' });
    }

    console.log('Redirect URL mottagen:', redirectUrl);
    res.status(200).json({ redirect_url: redirectUrl });

  } catch (error) {
    console.error('Ett fel uppstod:', error);
    res.status(500).json({ error: 'Serverfel vid bearbetning av anropet.' });
  }
});

app.listen(port, () => {
  console.log(`Servern körs på port ${port}`);
});

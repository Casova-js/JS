const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/proxy", async (req, res) => {
  const { email } = req.body;

  try {
    const response = await axios.post(
      "https://services.leadconnectorhq.com/hooks/e2suJrJt4A59p4Qahh1Y/webhook-trigger/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // <-- byt ut till din riktiga webhook-URL
      { email }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Proxy error:", error.message);
    res.status(500).json({ error: "Proxy-fel" });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy igång på port ${PORT}`);
});

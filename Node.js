const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Endpoint pour valider reCAPTCHA
app.post('/validate-recaptcha', async (req, res) => {
  const { recaptchaResponse } = req.body;

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=6Lf5sfUqAAAAANmKi7Hmqh63Ycjx9KukIyDwxNKI&response=${recaptchaResponse}`
    );

    res.json({ success: response.data.success });
  } catch (error) {
    console.error('Error validating reCAPTCHA:', error);
    res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
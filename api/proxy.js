const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));

app.post('/api/claude', async (req, res) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY?.trim(),
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, format = 'feed' } = req.body;
    const sizeMap = { feed: 'portrait_4_3', story: 'portrait_16_9', square: 'square_hd' };
    const image_size = sizeMap[format] || 'portrait_4_3';

    const response = await fetch('https://fal.run/fal-ai/flux/schnell', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.FAL_KEY?.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, image_size, num_inference_steps: 4, num_images: 1 }),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    anthropic: process.env.ANTHROPIC_API_KEY ? '✅ configurada' : '❌ FALTANDO',
    fal:       process.env.FAL_KEY           ? '✅ configurada' : '❌ FALTANDO',
  });
});

app.listen(process.env.PORT || 3001);

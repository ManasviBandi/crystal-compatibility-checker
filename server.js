import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import OpenAI from 'openai';

dotenv.config();
console.log('Loaded OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✅ Loaded' : '❌ Missing');

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DEV_MODE = false;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/compatibility', async (req, res) => {
  const { crystal1, crystal2, properties1, properties2 } = req.body;

  console.log('🔹 Received request:', { crystal1, crystal2, properties1, properties2 });

  if (DEV_MODE) {
    const compatibilityOptions = ["high", "medium", "low"];
    const randomCompat = compatibilityOptions[Math.floor(Math.random() * compatibilityOptions.length)];
    return res.json({
      compatibility: randomCompat,
      reason: Mock compatibility response for ${crystal1} and ${crystal2}.,
      bestUses: ["Mock use 1", "Mock use 2"]
    });
  }

  const systemPrompt = 
  You are a crystal-healing expert. Return a JSON object with:
  {
    "compatibilityScore": number between 0 and 100,
    "reason": "<2-3 sentence explanation>",
    "bestUses": ["example1", "example2", ...]
  }
  Only respond with JSON.
  ;

  try {
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: Crystal A: ${crystal1} with properties [${properties1.join(", ")}]\nCrystal B: ${crystal2} with properties [${properties2.join(", ")}] }
      ],
      response_format: { type: "json_object" }
    });

    const aiMessage = chatResponse.choices[0].message.content;
    const result = JSON.parse(aiMessage);

    res.json(result);
  } catch (err) {
    console.error('❌ Error with OpenAI request:', err);
    res.status(500).json({ error: "Failed to get AI response", details: err.message });
  }
});

// DALL·E image route
app.post('/api/generate-image', async (req, res) => {
  const { prompt } = req.body;

  try {
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "512x512"
    });

    const imageUrl = imageResponse.data[0].url;
    res.json({ url: imageUrl });

  } catch (error) {
    console.error('❌ Error generating image:', error);
    res.status(500).json({ error: 'Failed to generate image', details: error.message });
  }
});

app.listen(port, () => {
  console.log(Server listening on port ${port});
});

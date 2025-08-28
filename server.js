const express = require('express');
const OpenAI = require('openai');

const app = express();
const port = 3000;

// Configure the OpenAI client to point to the DeepSeek API
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: 'sk-b171cf64b63947e897660915244ddc5e' // User's provided API key
});

// Middleware to serve static files from the 'public' directory
app.use(express.static('public'));
// Middleware to parse JSON bodies
app.use(express.json());

// API endpoint to handle chat requests
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages) {
    return res.status(400).json({ error: 'Messages are required' });
  }

  try {
    // Request a streaming completion from the DeepSeek API
    const stream = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: messages,
      stream: true,
      max_tokens: 4096,
    });

    // Set headers for Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Process the stream
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        // SSE format: data: { ...JSON... } \n\n
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }
    }

    res.end();

  } catch (error) {
    console.error('Error connecting to DeepSeek API:', error);
    res.status(500).json({ error: 'Failed to connect to the AI service.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

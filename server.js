const express = require('express');

const app = express();
const port = 3000;

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
    const deepseekResponse = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // IMPORTANT: Replace with your actual DeepSeek API key
        'Authorization': `Bearer YOUR_DEEPSEEK_API_KEY`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        stream: true,
        max_tokens: 4096,
        temperature: 1.0,
        top_p: 1.0,
      })
    });

    // Check for errors from DeepSeek API
    if (!deepseekResponse.ok) {
        const errorBody = await deepseekResponse.text();
        console.error('DeepSeek API Error:', errorBody);
        return res.status(deepseekResponse.status).send(errorBody);
    }

    // Pipe the streaming response directly to the client
    res.setHeader('Content-Type', 'text/event-stream');
    deepseekResponse.body.pipe(res);

  } catch (error) {
    console.error('Error proxying to DeepSeek API:', error);
    res.status(500).json({ error: 'Failed to connect to the AI service.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

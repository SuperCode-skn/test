document.addEventListener('DOMContentLoaded', () => {
  const chatBox = document.getElementById('chat-box');
  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');

  // Store conversation history
  let conversationHistory = [
    { role: 'assistant', content: '你好！有什么可以帮你的吗？' }
  ];

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    // Add user message to history and display it
    conversationHistory.push({ role: 'user', content: userMessage });
    appendMessage('user', userMessage);
    userInput.value = '';
    userInput.focus();

    // Create a placeholder for the assistant's response
    const assistantMessageElement = appendMessage('assistant', '');
    const assistantTextElement = assistantMessageElement.querySelector('p');
    let fullResponse = '';

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: conversationHistory }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        assistantTextElement.textContent = `Error: ${response.status} ${errorText}`;
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        // The response is a stream of Server-Sent Events (SSE)
        // We need to parse them
        const lines = chunk.split('\n').filter(line => line.trim().startsWith('data: '));

        for (const line of lines) {
          const jsonStr = line.replace('data: ', '');
          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.choices && parsed.choices[0].delta && parsed.choices[0].delta.content) {
              const content = parsed.choices[0].delta.content;
              fullResponse += content;
              assistantTextElement.textContent = fullResponse;
              chatBox.scrollTop = chatBox.scrollHeight;
            }
          } catch (error) {
            // Ignore JSON parsing errors for empty or incomplete chunks
          }
        }
      }

      // Add the final assistant response to the history
      conversationHistory.push({ role: 'assistant', content: fullResponse });

    } catch (error) {
      console.error('Fetch error:', error);
      assistantTextElement.textContent = 'Sorry, something went wrong while connecting to the service.';
    }
  });

  function appendMessage(role, content) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', role);

    const p = document.createElement('p');
    p.textContent = content;

    messageElement.appendChild(p);
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;

    return messageElement;
  }
});

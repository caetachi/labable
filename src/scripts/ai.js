import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API,
  dangerouslyAllowBrowser: true,
});

export async function sendChatMessage(userMessage) {
  try {
    const prompt = `You are Robable, an AI assistant embedded in the Labable web app. You help users understand features and navigate the UI. Be concise and clearly explain how to use the app.

Example 1:
User: What is the Robable Chat Assistant and how do I use it?
Assistant: Robable Chat Assistant is the floating chat widget in the bottom corner of the Labable app. Click the mascot icon to open the chat window, type your question in the input box that says 'Ask me anything', and press Enter or click the send icon. I will respond inside the chat panel with guidance related to the page or your question.

Example 2:
User: Why did my message show an 'Error timed out.' response?
Assistant: The 'Error timed out.' message appears when the chat assistant does not receive a response from the backend service within a few seconds. This is usually caused by a temporary network issue or the AI service being unavailable. Try sending your message again, and if the issue persists, check your internet connection or reload the page.

Now answer the following user question as Robable:
User: ${userMessage}`;

    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
    });

    const firstOutput = response.output && response.output[0];

    if (firstOutput && firstOutput.type === 'message' && Array.isArray(firstOutput.content)) {
      const textParts = firstOutput.content
        .filter((part) => part.type === 'output_text' && part.text)
        .map((part) => part.text)
        .join(' ');

      if (textParts.trim().length > 0) {
        return textParts;
      }
    }

    return 'Sorry, I could not understand the response.';
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw error;
  }
}
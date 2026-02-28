const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

async function diagnose(metrics) {
  const prompt = `
You are an API performance expert. A developer just ran a load test on their API.
Here are the results:

${JSON.stringify(metrics, null, 2)}

Give a short diagnosis (5-6 sentences) covering:
1. What the numbers mean in plain English
2. What is likely causing the problem
3. One specific fix they should try first

Be direct. No bullet points. Talk like you're explaining to a developer, not writing a report.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

module.exports = { diagnose };
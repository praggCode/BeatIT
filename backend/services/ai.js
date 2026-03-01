const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

async function diagnose(metrics) {
  const prompt = `
You are an API performance expert. A developer just ran a load test on their API.
Here are the results:

${JSON.stringify(metrics, null, 2)}

Provide a diagnosis utilizing EXACTLY the following four section headers:
ROOT CAUSE: [Explain what the numbers mean and the likely problem in 1-2 sentences]
SEVERITY: [Critical, High, Medium, or Low]
FIX: [One specific step to try first, actionable]
RISK: [Any risks of leaving this unfixed or edge cases to consider]

Do not include any Markdown bolding like **ROOT CAUSE**. Just write the exact headers followed by a colon.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

module.exports = { diagnose };
const express = require("express");
const app = express();

const { OpenAI } = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function generatePrompt(code) {
  return `Explain what the following code does: hello this is a code snippet. If it is not code, simply say 'not code'.

  Input: var x = 3; 
  Response: This code snippet declares variable whose name is x and initializes its value to 3. 
  Input: function add(x, y) { return x + y; } 
  Response: This function takes in two arguments, namely x and y, and returns the sum of these two values. 
  Input: code 
  Response: not code
  Input: hello I am code 
  Response: not code
  Input: ${code}
  Response:`;
}

app.post("/api/decode", async (req, res) => {
  console.log(req.body);
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: generatePrompt("hello world!"),
        },
      ],
      model: "gpt-3.5-turbo",
    });
    res.header("Access-Control-Allow-Origin", "*");
    res.send({ codeExplanation: completion.choices[0].message.content });
  } catch (e) {
    res.send(e);
  }
});

app.listen(process.env.PORT || 8080, () => {
  console.log("Welcome to decode backend");
});

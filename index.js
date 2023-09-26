const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const { OpenAI } = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function generatePrompt(code) {
  return `Explain what the following code does: ${code}. If it is not code, simply say 'not code'. 
  When describing the code snippet, talk about what it does as well as what its purpose is as a whole.

  Input: var x = 3; 
  Response: This code snippet declares variable whose name is x and initializes its value to 3. 
  Input: function add(x, y) { return x + y; } 
  Response: This function takes in two arguments, namely x and y, and returns the sum of these two values. 
  Input: app.post("/api/decode", async (req, res) => {
    const selectedCode = req.body.selectedCode;
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content: generatePrompt(selectedCode),
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
  Response: This code defines an HTTP POST route at "/api/decode". When a POST request is made to this route, the server will execute the following logic:
  It extracts data from the request body, specifically the selectedCode property.
  It then attempts to create a chat completion using the OpenAI GPT-3.5 Turbo model. The generatePrompt(selectedCode) function appears to generate a prompt or message for the model based on the selectedCode received in the request body. This prompt is structured as a message from the "user" role.
  The server sends this message to the GPT-3.5 Turbo model using OpenAI's API.
  After receiving a response from the model, it extracts the content of the model's reply from completion.choices[0].message.content.
  It sets the HTTP header "Access-Control-Allow-Origin" to "*", which allows cross-origin requests from any domain (this is useful for allowing requests from different websites or origins).
  Finally, it sends a JSON response back to the client with the content of the model's reply, wrapped in a codeExplanation property.
  In summary, this code defines a server endpoint that takes a selectedCode as input, uses it to generate a prompt, sends the prompt to the GPT-3.5 Turbo model for completion, and then sends the model's response back to the client as a JSON object with a codeExplanation property. It also sets the necessary headers to allow cross-origin requests. This code is often used in applications where you want to provide explanations or additional information based on user-provided code snippets.
  Input: code 
  Response: not code
  Input: hello I am code 
  Response: not code
  Input: ${code}
  Response:`;
}

app.post("/api/decode", async (req, res) => {
  const selectedCode = req.body.selectedCode;
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: generatePrompt(selectedCode),
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

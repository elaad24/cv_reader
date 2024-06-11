const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const fs = require("fs");

const aiRequest = async (filePath, botName) => {
  dotenv.config();
  const apiKey = process.env.JIMINY_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

  try {
    const fileText = await fs.promises.readFile(filePath, "utf-8");

    const prompt = `im giving you a text that is a parse cv of useer base on the following text that ill provide you return organize it and sum it so the necessary data will be in the following json format  json format and remove the "\n" and "*" 
    from the output and also every '\n' in the output
    the key "name" in the json format is the name of the person that it his cv,
      {name: "",
      date_of_birth: "",
      location: "",
      phone_number: "",
      frontEnd_Technologies: "",
      backEnd_Technologies: "",
      summery: "",
      email:"",
      specking_language:""}
      by this data - ${fileText}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("ai answer ", text);
    return text;
  } catch (error) {
    console.error("Error:", error.message);
  }
};

module.exports = { aiRequest };

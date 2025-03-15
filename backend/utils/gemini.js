const { GoogleGenerativeAI } = require('@google/generative-ai');

// ✅ Google Gemini API Key (Directly hardcoded)
const GOOGLE_GEMINI_API_KEY = "AIzaSyBsCygCKw5aQu-cPlSuMl08hvuhNvB7FFc";

// ✅ Initialize Google Gemini
const genAI = new GoogleGenerativeAI(GOOGLE_GEMINI_API_KEY);

// ✅ Function to generate chatbot response using Google Gemini API
const generateChatbotResponse = async (message) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // ✅ Use Gemini Pro model
    const result = await model.generateContent(message);
    const response = await result.response;

    return response.text(); // ✅ Extract response properly
  } catch (error) {
    console.error("Error generating chatbot response:", error);
    return "Error: Unable to process the request.";
  }
};

module.exports = { generateChatbotResponse };

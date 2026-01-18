require('dotenv').config();
const express = require('express');
// Import the NEW unified SDK
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Initialize with the new constructor
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY.trim() });

app.post('/generate-recipe', async (req, res) => {
    const { ingredients } = req.body;

    try {
        // USE THE LATEST MODEL: gemini-2.0-flash or gemini-2.5-flash
        // Note: 'gemini-1.5-flash' is often deprecated on newer endpoints
        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ 
                role: 'user', 
                parts: [{ text: `You are a chef. Provide a recipe for: ${ingredients}. Return ONLY JSON with keys: title, time, difficulty, ingredients (array), instructions (array).` }] 
            }]
        });

        // The new SDK uses .text directly from the response
        const text = result.text;
        const cleanJson = text.replace(/```json|```/g, "").trim();
        res.json(JSON.parse(cleanJson));

    } catch (error) {
        console.error("--- CHEF DEBUG ERROR ---");
        console.error("Status:", error.status);
        console.error("Message:", error.message);
        
        res.status(500).json({ error: "AI Connection Failed" });
    }
});

// Diagnostic route to find valid models if 404 persists
app.get('/list-models', async (req, res) => {
    try {
        // In the new SDK, models.list() provides available models
        const models = await ai.models.list();
        res.json(models);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.listen(3000, () => console.log(`🚀 Server on http://localhost:3000`));
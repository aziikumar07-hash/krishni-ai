require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());

// Load Environment Variables
const PORT = process.env.PORT || 3000;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const SYSTEM_PROMPT = `
You are Krishni AI, an advanced agricultural assistant for Indian farmers. 
Your goal is to provide accurate, helpful, and empathetic advice about crop management, diseases, weather, and market prices.
CRITICAL RULES:
1. ALWAYS respond in fluent, easy-to-understand Hindi (Devanagari script). 
2. Use simple agricultural terms that rural Indian farmers understand. Avoid overly complex scientific jargon unless necessary, and if used, explain it simply.
3. Keep responses concise and scannable. WhatsApp messages should not be giant walls of text. Use bullet points where appropriate.
4. If a farmer asks about a crop disease, give actionable steps (e.g., specific pesticides or organic methods to use).
5. Maintain a respectful, helpful, and encouraging tone.
`;

async function processWithGemini(userText) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // We simulate a system prompt by prepending it to the user's input, 
        // or by using systemInstruction if the API version supports it.
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "System Instructions: " + SYSTEM_PROMPT }]
                },
                {
                    role: "model",
                    parts: [{ text: "नमस्ते! मैं कृषनी एआई हूँ। मैं आपकी कैसे मदद कर सकती हूँ?" }]
                }
            ]
        });

        const result = await chat.sendMessage(userText);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Error:", error);
        return "क्षमा करें, मुझे अभी कुछ तकनीकी समस्या हो रही है। कृपया थोड़ी देर बाद पुनः प्रयास करें।";
    }
}

async function sendWhatsAppMessage(to, text) {
    try {
        await axios({
            method: 'POST',
            url: `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
            headers: {
                'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json'
            },
            data: {
                messaging_product: 'whatsapp',
                to: to,
                type: 'text',
                text: { body: text }
            }
        });
        console.log(`Message sent to ${to}`);
    } catch (error) {
        console.error("WhatsApp API Error:", error.response ? error.response.data : error.message);
    }
}

// ==========================================
// WHATSAPP WEBHOOK ROUTES
// ==========================================

// Webhook Verification (Required by Meta)
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

// Receive Messages
app.post('/webhook', async (req, res) => {
    const body = req.body;

    if (body.object) {
        if (body.entry && body.entry[0].changes && body.entry[0].changes[0] && body.entry[0].changes[0].value.messages && body.entry[0].changes[0].value.messages[0]) {
            const message = body.entry[0].changes[0].value.messages[0];
            const from = message.from; // Sender's phone number
            
            // Acknowledge receipt quickly so WhatsApp doesn't retry
            res.sendStatus(200);

            if (message.type === 'text') {
                const userText = message.text.body;
                console.log(`Received message from ${from}: ${userText}`);

                // Process with Gemini AI
                const aiResponseText = await processWithGemini(userText);

                // Send back to WhatsApp
                await sendWhatsAppMessage(from, aiResponseText);
            }
        } else {
            res.sendStatus(200); // Always return 200 for webhook events we don't process
        }
    } else {
        res.sendStatus(404);
    }
});

app.listen(PORT, () => {
    console.log(`Krishni AI Backend is running on port ${PORT}`);
    console.log(`Ready to receive WhatsApp Webhooks on /webhook`);
});

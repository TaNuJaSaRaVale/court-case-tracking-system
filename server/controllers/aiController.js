const axios = require('axios');
const Document = require('../models/Document');

//
// 🔹 EXISTING (UNCHANGED)
//
const explainLegalText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'text is required' });
    }

    const simplified = `Simplified explanation: ${text.substring(0, 300)}...`;

    return res.status(200).json({
      original: text,
      simplified,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

//
// 🔴 AI DOCUMENT RECOMMENDATION (CEREBRAS)
//
const recommendDocuments = async (req, res) => {
  try {
    const { caseType } = req.body;

    if (!caseType) {
      return res.status(400).json({ message: 'caseType is required' });
    }

    const normalizedType = caseType.toLowerCase().trim();

    // ✅ STEP 1: CHECK DATABASE FIRST
    const existing = await Document.findOne({ caseType: normalizedType });

    if (existing && existing.documents.length > 0) {
      return res.status(200).json({
        source: 'database',
        caseType: normalizedType,
        documents: existing.documents,
      });
    }

    // 🔴 STEP 2: CEREBRAS AI CALL

    const prompt = `
You are a legal assistant.

Given a case type, return a list of required legal documents.

Case Type: ${normalizedType}

Return ONLY a JSON array of document names.
Example:
["Document 1", "Document 2"]
`;

    const response = await axios.post(
      'https://api.cerebras.ai/v1/chat/completions',
      {
        model: 'llama3.1-8b',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CEREBRAS_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    let aiText = response.data.choices[0].message.content;

    // ✅ SAFE PARSING
    let documents;
    try {
      documents = JSON.parse(aiText);
    } catch (e) {
      // fallback if AI returns text instead of JSON
      documents = aiText
        .split('\n')
        .map((d) => d.replace(/[-*]/g, '').trim())
        .filter((d) => d.length > 0);
    }

    return res.status(200).json({
      source: 'ai',
      caseType: normalizedType,
      documents,
    });
  } catch (err) {
    console.error('Cerebras AI error:', err.response?.data || err.message);

    return res.status(500).json({
      message: 'AI service error',
    });
  }
};

module.exports = {
  explainLegalText,
  recommendDocuments,
};
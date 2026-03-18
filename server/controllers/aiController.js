// POST /api/ai/explain
const explainLegalText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'text is required' });
    }

    const simplified = `Simplified explanation: ${text.substring(
      0,
      300
    )}...`;

    return res.status(200).json({
      original: text,
      simplified,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { explainLegalText };


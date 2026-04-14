const axios = require('axios');
const cheerio = require('cheerio');

// NEW Hugging Face API URL
const HF_API_URL = 'https://api-inference.huggingface.co/models/';
const HF_TOKEN = process.env.HUGGING_FACE_API_KEY;

// Alternative: Use OpenAI-compatible API
const HUGGING_FACE_INFERENCE_URL = 'https://api-inference.huggingface.co/models/';

// @desc    Summarize article
// @route   POST /api/ai/summarize
// @access  Public

const scrapeArticleText = async (url) => {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    });
    const $ = cheerio.load(response.data);

    // Try Open Graph description — always server-rendered, clean
    const ogDescription = $('meta[property="og:description"]').attr('content') || '';
    const ogTitle = $('meta[property="og:title"]').attr('content') || '';

    // Remove all noisy elements
    $(
      'script, style, nav, footer, header, aside, form, button, ' +
      '[class*="nav"], [class*="menu"], [class*="sidebar"], [class*="social"], ' +
      '[class*="share"], [class*="comment"], [class*="related"], [class*="ad"], ' +
      '[class*="cookie"], [class*="popup"], [class*="modal"], [class*="banner"], ' +
      '[class*="subscribe"], [class*="newsletter"]'
    ).remove();

    // Collect only paragraphs with real sentence content (>100 chars, >12 words)
    const paragraphs = [];
    $('p').each((i, el) => {
      const text = $(el).text().replace(/\s+/g, ' ').trim();
      const wordCount = text.split(' ').length;
      if (text.length > 100 && wordCount > 12 && /[.!?]/.test(text)) {
        paragraphs.push(text);
      }
    });

    if (paragraphs.length >= 2) {
      return paragraphs.join(' ').slice(0, 3000);
    }

    // Fallback: use OG description + title (at least clean structured data)
    if (ogDescription.length > 60) {
      return `${ogTitle}. ${ogDescription}`.slice(0, 3000);
    }

    return null;
  } catch (err) {
    return null;
  }
};


const summarizeText = async (req, res) => {
  try {
    const { text, url } = req.body;
    if (!text && !url) {
      return res.status(400).json({ message: 'Text or URL is required' });
    }
    // Try to get full article content from URL
    let contentToSummarize = text;
    let source = 'description';
    if (url) {
      const scraped = await scrapeArticleText(url);
      if (scraped && scraped.length > 300) {
        contentToSummarize = scraped;
        source = 'full_article';
      }
    }
    // Truncate to fit BART's context window (~1024 tokens ≈ 4000 chars)
    const truncated = contentToSummarize.slice(0, 3000);
    if (!HF_TOKEN) {
      // No HF key — return intelligent excerpt
      const sentences = truncated.match(/[^.!?]+[.!?]/g) || [];
      const summary = sentences.slice(0, 3).join(' ');
      return res.json({ summary: summary || truncated.slice(0, 200) + '...', source: 'excerpt' });
    }
    // Dynamic length: ~30% of word count, min 100 words, max 300 words
const wordCount = truncated.split(/\s+/).length;
const maxLen = Math.min(Math.max(Math.floor(wordCount * 0.3), 120), 350);
const minLen = Math.min(Math.max(Math.floor(wordCount * 0.1), 80), 150);

const response = await axios({
    method: 'post',
    url: HF_URL,
    headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
    },
    data: {
        inputs: truncated,
        parameters: { max_length: maxLen, min_length: minLen, do_sample: false },
    },
    timeout: 60000,
});

    let summary;
    if (Array.isArray(response.data) && response.data.length > 0) {
      summary = response.data[0].summary_text || response.data[0].generated_text;
    } else {
      summary = response.data.summary_text;
    }
    res.json({ summary, source });
  } catch (error) {
    if (error.response?.status === 503 || error.response?.data?.error?.includes('loading')) {
      return res.status(503).json({ message: 'AI model is warming up. Please wait 20-30 seconds and try again.' });
    }
    if (error.response?.status === 429) {
      return res.status(429).json({ message: 'Too many requests. Please wait a moment.' });
    }
    // Fallback — first 3 sentences
    const { text } = req.body;
    const sentences = (text || '').match(/[^.!?]+[.!?]/g) || [];
    const fallback = sentences.slice(0, 3).join(' ');
    res.json({ summary: fallback || (text || '').slice(0, 200) + '...', source: 'fallback' });
  }
};

// @desc    Translate text
// @route   POST /api/ai/translate
// @access  Public


module.exports = {
  summarizeText,
};
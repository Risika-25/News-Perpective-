const axios = require('axios');
const User = require('../models/user.js');

const searchNews = async (req, res) => {
  try {
    const { topic } = req.query;
    if (!topic) {
      return res.status(400).json({ message: 'Topic is required' });
    }
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: topic,
        apiKey: process.env.NEWS_API_KEY,
        pageSize: 10,
        language: 'en'
      }
    });
    const articles = response.data.articles.filter(
      article => article.title && article.title !== '[Removed]'
    );
    res.json({
      totalResults: articles.length,
      articles: articles
    });
  }
  catch (error) {
    res.status(500).json({ message: 'Something is wrong with server' });
  }
};

const saveArticle = async (req, res) => {
  try {
    console.log('💾 Save article function called');
    console.log('User ID:', req.user._id);
    console.log('Article data:', req.body);

    const user = await User.findById(req.user._id);
    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ User found:', user.email);

    const { title, description, url, urlToImage, source, publishedAt } = req.body;

    if (!title || !url) {
      return res.status(400).json({ message: 'Title and URL are required' });
    }

    // Check if already saved
    const alreadySaved = user.savedArticles.some(article => article.url === url);

    if (alreadySaved) {
      return res.status(400).json({ message: 'Article already saved' });
    }


    console.log('📝 Adding article to savedArticles array');

    user.savedArticles.push({
      title: title || 'Untitled',
      description: description || '',
      url: url,
      urlToImage: urlToImage || '',
      source: source || 'Unknown',
      publishedAt: publishedAt || new Date()
    });


    console.log('💾 Saving user to database...');
    await user.save();

    res.json({ message: 'Article saved successfully', savedArticles: user.savedArticles });
  } catch (error) {
    console.error('❌ Save article error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: error.message });
  }
};

const getSavedArticles = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ savedArticles: user.savedArticles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeSavedArticle = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.savedArticles = user.savedArticles.filter(
      article => article._id.toString() !== req.params.articleId
    );

    await user.save();
    res.json({ message: 'Article removed', savedArticles: user.savedArticles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { title, url } = req.body;

    // Keep only last 50 items
    if (user.readingHistory.length >= 50) {
      user.readingHistory.shift();
    }

    user.readingHistory.push({ title, url });
    await user.save();

    res.json({ message: 'Added to history' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToSearchHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { query } = req.body;

    // Keep only last 20 searches
    if (user.searchHistory.length >= 20) {
      user.searchHistory.shift();
    }

    user.searchHistory.push({ query });
    await user.save();

    res.json({ message: 'Added to search history' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reading history
const getHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('readingHistory');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Return most recent first
    const history = [...user.readingHistory].reverse();
    res.json({ readingHistory: history });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  addToSearchHistory, addToHistory, removeSavedArticle, getSavedArticles, saveArticle, searchNews, getHistory
}


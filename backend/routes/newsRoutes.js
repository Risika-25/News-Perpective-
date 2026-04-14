const express = require('express');
const { searchNews, saveArticle, getSavedArticles, removeSavedArticle, addToHistory, getHistory, addToSearchHistory } = require('../controllers/newsControllers.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

console.log("🛠️ News Routes Loading...");
console.log("🛠️ Protect function type:", typeof protect);

router.get('/search', searchNews);
router.post('/save', protect, saveArticle);
router.get('/saved', protect, getSavedArticles);
router.delete('/saved/:articleId', protect, removeSavedArticle);
router.post('/history', protect, addToHistory);
router.get('/history', protect, getHistory);
router.post('/search-history', protect, addToSearchHistory);

module.exports = router;
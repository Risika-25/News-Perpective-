const express = require('express');
const {summarizeText} = require('../controllers/aiControllers.js');

const router = express.Router();

router.post('/summarize', summarizeText);

module.exports = router;
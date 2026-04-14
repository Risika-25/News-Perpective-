const express = require('express');
const {registerUser, loginUser, getUserProfile, updatePreferences} = require ('../controllers/authControllers.js');
const {protect} = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/register',registerUser);
router.post('/login', loginUser);
router.get('/profile',protect, getUserProfile);
router.put('/preferences', protect, updatePreferences);

module.exports = router;
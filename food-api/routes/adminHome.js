const express = require('express');
const router = express.Router();
const adminHomeController = require('../controllers/adminHomeController');
const { isLoggedIn, isAdmin } = require('../middleware/auth');

router.get('/admin', isLoggedIn, isAdmin,adminHomeController.index);

module.exports = router;
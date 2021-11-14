const express = require('express');
const userController = require('../controllers/user.controller');
const checkAuthMiddleware = require('../middleware/check-auth');

const router = express.Router();

router.route('/sign-up')
    .post(userController.signUp)

router.route('/login')
    .post(userController.login)

module.exports = router;
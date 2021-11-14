const express = require('express');
const contactsController = require('../controllers/contacts.controller');
const checkAuthMiddleware = require('../middleware/check-auth');

const router = express.Router();

router.route('/')
    .post(checkAuthMiddleware.checkAuth, contactsController.save)
    .get(checkAuthMiddleware.checkAuth, contactsController.list)

router.route('/search')
    .get(checkAuthMiddleware.checkAuth, contactsController.search)

router.route('/:id')
    .patch(checkAuthMiddleware.checkAuth, contactsController.update)
    .get(checkAuthMiddleware.checkAuth, contactsController.listById)
    .delete(checkAuthMiddleware.checkAuth, contactsController.destroy);




module.exports = router;
const express = require('express');
const router = express.Router();
const validate = require('../../middleware/validation.middleware');
const authController = require('./auth.controller');
const { signupSchema, loginSchema } = require('./auth.validation');

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);

module.exports = router;
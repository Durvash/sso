const express = require('express');
const router = express.Router();
const validate = require('../../middleware/validation.middleware');
const userController = require('./user.controller');
const { companySchema } = require('./user.validation');
const { verifyToken } = require('../../middleware/verifyToken.middleware');

router.post('/add-company', verifyToken, validate(companySchema), userController.addcompany);
router.post('/invite-users', verifyToken, userController.inviteUsers);

module.exports = router;
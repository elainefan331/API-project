const express = require('express');

const { restoreUser, requireAuth } = require('../../utils/auth.js');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.use(restoreUser);



module.exports = router;
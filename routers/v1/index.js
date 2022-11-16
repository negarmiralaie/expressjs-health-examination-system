const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/admin', require('./admin'));
// router.use('/all', require('./all'));

/** Another routes */

module.exports = router;

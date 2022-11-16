const express = require('express');
const router = express.Router();
const authController = require('../../controllers/v1/auth/authController');


/* GET home page. */
router.get('/', (req, res) => {
    res.send('Authentication routes');
});
  
/* Admin Auth Dir */
router.post('/user/login', authController.login);
router.delete('/user/logout', authController.logout);

module.exports = router;

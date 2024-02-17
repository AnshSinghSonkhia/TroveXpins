var express = require('express');
var router = express.Router();

/* GET home page. - This is the login page */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* Get Register Page */
router.get('/register', function(req, res, next) {
  res.render('register');
});

module.exports = router;

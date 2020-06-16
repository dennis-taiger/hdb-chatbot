var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  // disable the chrome cookie warning
  res.setHeader('Set-Cookie', 'HttpOnly;Secure;SameSite=Strict');
  res.render('index', { title: 'HDB Chatbot Demo' });
  //res.render('homepage', { title: 'HDB Chatbot Demo' });
  console.log(res.value);
});

module.exports = router;

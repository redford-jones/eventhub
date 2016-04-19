var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'EventHub',
    description: 'Your global one-stop-shop for internal events. It\'s quick and easy to get started:',
    getStarted: 'Create your first event',
    scripts:[]
  });
});

module.exports = router;

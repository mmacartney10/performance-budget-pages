var express = require('express');
var website = express();
var path = require('path');

website.get('/', function (req, res) {
  res.sendFile(__dirname + '/site/index.html');
});

website.get('/test', function (req, res) {
  res.sendFile(__dirname + '/site/test.html');
});

website.use(express.static(path.join(__dirname, '/site/')));

website.listen(7000, console.log('Listening on port 7000'));

module.exports = website;

const express = require('express');
const app = express();
const router = express.Router();

const path = __dirname + '/';
const port = 8080;

router.use(function (req,res,next) {
  console.log('/' + req.method);
  next();
});

router.get('/', function(req,res){
  res.sendFile(path + 'html/index.html');
});

router.get('/news', function(req,res){
  res.sendFile(path + 'html/news.html');
});

router.get('/leaderboard', function(req,res){
  res.sendFile(path + 'html/leaderboard.html');
});

router.get('/login', function(req,res){
  res.sendFile(path + 'html/login.html');
});

app.use(express.static(path));
app.use('/', router);

app.listen(port, function () {
  console.log('Example app listening on port 8080!')
})
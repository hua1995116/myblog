var express = require('express');
var port = 8000;

var app = express();

var router = express.Router();

app.use(router);

router.get('/',function(req,res,next){
  req.url = './index.html';
  next();
});


app.use(express.static('./'));

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
});
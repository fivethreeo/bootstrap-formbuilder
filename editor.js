var express = require("express");
var app = express();
var path = require('path');

var staticdir = 'static';

app.set('views', path.join(__dirname, 'editor', 'views'));
app.set('view engine', 'jade');
app.locals.pretty = true;

app.use(require('morgan')());

app.use(express.static(path.join(__dirname, 'editor', staticdir)));

app.get('/', function (req, res) {
  res.render('index',
    { title : 'Home' }
  )
})

var port = process.env.PORT || 8080;
var ip = process.env.IP || "127.0.0.1";

app.listen(port, ip, function() {
 
  console.log("Listening on " + ip + ':' + port);

});

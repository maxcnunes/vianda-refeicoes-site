var path = require('path'),
    swig = require('swig'),
    express = require('express'),
    menuMeals = require('./menu-meals'),
    app = express();

var appPath = path.resolve(__dirname, '../app');

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', appPath);
app.use(express.static(appPath));


app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');

  next();
});


app.get('/', function (req, res) {
  res.render('index');
});


app.get('/api/menu-meals', function (req, res) {
  menuMeals.get(function(err, rows, info) {
    if(err) throw err;

    res.json(rows);
  });
});


var host = process.env.HTTP_IP || '127.0.0.1';
var port = process.env.HTTP_PORT || 3000;
app.listen(port, host, function () {
  console.log('Server running at http://' + host + ':' + port);
});
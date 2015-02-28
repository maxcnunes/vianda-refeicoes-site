var path = require('path'),
    swig = require('swig'),
    express = require('express'),
    menuMeals = require('./menu-meals'),
    app = express();

var appPath = path.resolve(__dirname, '../app');
var virtualHost = process.env.VIRTUAL_HOST;

/*
  Static and View Engine
 */
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', appPath);
app.use(express.static(appPath));

/*
  CORS
 */
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');

  next();
});

/*
  Redirect non-www to www
 */
app.use(function (req, res, next) {
  if (!virtualHost) return next();

  var host = req.header('host');
  if (host.match(/^www\..*/i)) return next();

  res.redirect(301, 'http://www.' + host);
});


/*
  Routes
 */
app.get('/', function (req, res) {
  res.render('index');
});


app.get('/api/menu-meals', function (req, res) {
  menuMeals.get(function(err, rows, info) {
    if(err) throw err;

    res.json(rows);
  });
});


/*
  Server
 */
var host = process.env.HTTP_IP || '127.0.0.1';
var port = process.env.HTTP_PORT || 3000;
app.listen(port, host, function () {
  console.log('Server running at http://' + host + ':' + port);
  console.log('Virtual host', virtualHost);
});
var path = require('path'),
    express = require('express'),
    menuMeals = require('./menu-meals'),
    app = express();


var virtualHost = process.env.VIRTUAL_HOST;


/*
  Redirect non-www to www
 */
app.all(/.*/, function (req, res, next) {
  var host = req.header('host');
  if (!virtualHost || host.match(/^www\..*/i)) return next();

  res.redirect(301, 'http://www.' + host);
});

/*
  Static
 */
app.use(express.static(path.resolve(__dirname, '../app')));


/*
  CORS
 */
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');

  next();
});


/*
  Routes
 */
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
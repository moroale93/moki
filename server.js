// modules =================================================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors = require('cors');
var path= require('path');

var utils = require('./src/utils');

// configuration ===========================================
var port = process.env.PORT || 9080; // set our port
// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json
/*app.use(bodyParser.json({
  type: 'application/vnd.api+json'
}));*/ // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({
  extended: true
})); // parse application/x-www-form-urlencoded
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT


app.use("/", express.static(path.resolve(__dirname + "/frontend/build")));

app.use(cors());

// Before any of the relevant routes...
app.use('/mocks', utils.basicAuth('admin', 'admin'));

// routes ==================================================
require('./src/mockServices')(app); // pass our application into our routes
// start app ===============================================

app.listen(port);
console.log('Server started at port ' + port); // shoutout to the user

exports = module.exports = app; // expose app
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var moment = require('moment');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

app.get('/:timestamp', function(req, res, next) {
    if (moment(req.params.timestamp).isValid()) {
      console.log(req.params.timestamp);
        var unixTime = moment(req.params.timestamp).unix();
        var naturalTime = moment(req.params.timestamp).format('dddd Do MMMM YYYY');
        res.json({
            unixTime: unixTime,
            natural: naturalTime
        });
    } else {
        res.json({
            error: 'invalid time',
            unixTime: null,
            natural: null
        });
    }
});

app.get('/', function(req, res, next) {
    console.log('no timestamp');
    res.render('index');
});

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

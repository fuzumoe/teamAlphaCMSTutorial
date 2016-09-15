/**
 * Start of imports
 */
//express node freamework
var express = require('express');
//body parser reqests parser
var bodyParser = require('body-parser');
//morgan req. and res. loger
var morgan = require('morgan');
//server properties|configuration file
var PROP = require('./prop.js');
//monogos  mongoDB schema and api freamework
var mongoose = require('mongoose');

//
var server = express();


//connect to remote mongoDB repository 
mongoose.connect(PROP.database, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log('connected to the database');
    }
});

/**************************************************************************** */
//set bodyParser to parse every url 
// server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json({ limit: '50mb' }));
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

//set bodyParser to parse json based req. and res. 
server.use(bodyParser.json());
//set morgan to log in developer mode
server.use(morgan('dev'));
/**************************************************************************** */

/**************************************************************************** */
//deploy public folder as public
server.use(express.static(__dirname + '/public'));;

//deploy node_module folder as lib
server.use('/lib', express.static(__dirname + '/node_modules'));
//deploy js folder as scripts
server.use('/scripts', express.static(__dirname + '/public/js'));
//depoloy css foler as styles
server.use('/styles', express.static(__dirname + '/public/css'));
//deploy assets folder as assets
server.use('/asstes', express.static(__dirname + '/public/assets'));
//deploy fonts folder ass assets
server.use('/fonts', express.static(__dirname + '/public/fonts'));
/**************************************************************************** */


/**************************************************************************** */
//import,construct and bind webService RESTful service to node server
var restFulService = require('./app/webService.js')(server, express);
server.use('/services', restFulService);
//set index.html as home page
server.get('*', function(req, res) {
    res.sendFile(__dirname + '/public/views/index.html');
});
/**************************************************************************** */


/**************************************************************************** */
//start and deploy app to port 3000
server.listen(PROP.port, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Listening on port 3000");
    }
});
/**************************************************************************** */
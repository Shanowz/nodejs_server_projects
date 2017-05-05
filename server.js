var express = require('express');
var app = express();
var mongoose = require('mongoose');
var parser = require('body-parser');

var omk_db = require('./omk/db');
var fp_users_model = require('./fp/models/user');

app.use(parser.json());
app.use(parser.urlencoded({extended : true}));

app.use(function (error, req, res, next){
    res.status(400);
    res.send("oups, bad json");
});

var mongoUri = 'mongodb://localhost/shared_server';
mongoose.connect(mongoUri);
var fp_db = mongoose.connection;
fp_db.on('error', function () {
  throw new Error('unable to connect to database at ' + mongoUri);
});

console.log("request");

//omk routes
//--users
app.post('/omk/users', omk_db.insert_user);
app.get('/omk/users', omk_db.is_element_exists);

//faceP routes
//--users
var fp_users = require('./fp/controllers/users');
app.get('/users', fp_users.findAll);
app.get('/users/:id', fp_users.findById);
app.post('/user/:email?&password=:password&username=:username', fp_users.add);
app.get('/user/:email?&password=:password', fp_users.isLoginOk);
app.put('/users/:id', fp_users.update);
app.delete('/users/:id', fp_users.delete);

app.listen(8080);
console.log('Listening on port 8080...');
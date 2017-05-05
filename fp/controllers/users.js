var mongoose = require('mongoose'),
User = mongoose.model('User');

exports.findAll = function(req, res){
  User.find({},function(err, results) {
    return res.send(results);
  });
};
exports.findById = function(req, res){
  var id = req.params.id;
  User.findOne({'_id':id},function(err, result) {
    return res.send(result);
  });
};

exports.isLoginOk = function(req, res){
	  var emailValue = req.params.email;
	  var passwordValue = req.params.password;

    User.findOne( {email:emailValue, password: passwordValue} ,function(err, result) {
      if (err) return console.log(err);
        
      return res.send(result);
    });

/*
  User.where('email':emailValue).where('password':passwordValue).callback(function(err, result) {
    return res.send(result);
  } );
*/

  /*
  User.find({email:emailValue, password:passwordValue },function(err, result) {
    return res.send(result);
  });
  */
};



exports.add = function(req, res){
	 var chips = 2000
  var emailValue = req.params.email;
  var passwordValue = req.params.password;
  var usernameValue = req.params.username;
  User.create(
   {"username": usernameValue
    , "email": emailValue
    ,"password": passwordValue}
  , function (err) {
    if (err) return console.log(err);
    return res.send({result : 'accepted'});
  });
};





exports.update = function(req, res) {
  var id = req.params.id;
  var updates = req.body;

  User.update({"_id":id}, req.body,
    function (err, numberAffected) {
      if (err) return console.log(err);
      console.log('Updated %d musicians', numberAffected);
      res.send(202);
  });
}
exports.delete = function(req, res){
  var id = req.params.id;
  Musician.remove({'_id':id},function(result) {
    return res.send(result);
  });
};

exports.import = function(req, res){
  User.create(
    {"username": "Greg"
    , "email":"greg@gmail.com"
    , "adress":"rue de la treille 9"
    , "town": "Liege"
    ,"zipcode":"4000"
    ,"socialnumber":"123456"
    ,"password":"Aa111111"}
  , function (err) {
    if (err) return console.log(err);
    return res.send(202);
  });
};

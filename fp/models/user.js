var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {type : String, unique: true , required: true},
  email: {type : String, unique: true , required: true},
  adress: String,
  town: String,
  chips: Number,
  zipcode: String,
  socialnumber: String,
  password: {type : String, required: true}
});

mongoose.model('User', UserSchema);
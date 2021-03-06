var mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // A native JS bcrypt library for NodeJS
mongoose.Promise = global.Promise;
  var Schema = mongoose.Schema;

  var userSchema = new Schema({
    email:{type:String, required:true},
    password: {type:String, required:true},
    name:  {type:String, required:true}
     });


// Schema Middleware to Encrypt Password
userSchema.pre('save', function(next) {
  // Ensure password is new or modified before applying encryption
  if (!this.isModified('password'))
    return next();

  // Apply encryption
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) return next(err); // Ensure no errors
    this.password = hash; // Apply encryption to password
    next(); // Exit middleware
  });
});
// Methods to compare password to encrypted password upon login
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password); // Return comparison of login password to password in database (true or false)
};

     module.exports = mongoose.model('User', userSchema);
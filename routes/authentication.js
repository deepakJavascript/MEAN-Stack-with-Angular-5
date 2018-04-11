const User = require('../models/user');
var jwt = require('jsonwebtoken');
const config = require('../config/database');


module.exports = (router) =>{

router.post('/register', (req, res)=>{

    if(!req.body.email){
        res.json({success: false, message: 'You must provide an email'})
    }
    else{
        let user = new User({

            email: req.body.email,
            password:req.body.password,
            name:req.body.name
        });

        user.save((err) =>{

            if(err){
                res.json({success:false, message: 'couldnot save the user', err});
            }
            else{
                res.json({success:true, message: 'User saved in database'});
            }
        });
    }
    
});

router.post('/login', (req, res) => {

    if(!req.body.email){
        res.json({success:false, message:'Email should not blank'});
    }
    else if(!req.body.password){
        res.json({success:false, message:'password should not blank'});
    }
    else{
        User.findOne({email:req.body.email}, (err, user) =>{
            if(err){
                res.json({success:false, message:err});
            }
            else if(!user){
                res.json({success:false, message:'Email not found'});
            }
            else{
                const validpassword = user.comparePassword(req.body.password);
                if(!validpassword){
                    res.json({success:false, message:'Not a valid passwprd'});
                }
                else{
                    //const secret = 'fdfdffdfdfrrrtred';
                   const token =  jwt.sign({userId:user._id}, config.secret, {expiresIn:'24h'});
                    res.json({success:true, message:'Successfully logged in', token:token, user: {email:user.email}});
                }
            }
        });
    }
});

/* ================================================
  MIDDLEWARE - Used to grab user's token from headers
  ================================================ */
  router.use((req, res, next) => {
    const token = req.headers['authorization']; // Create token found in headers
    // Check if token was found in headers
    if (!token) {
      res.json({ success: false, message: 'No token provided' }); // Return error
    } else {
        //const secret = 'fdfdffdfdfrrrtred';
      // Verify the token is valid
      jwt.verify(token, config.secret, (err, decoded) => {
        // Check if error is expired or invalid
        if (err) {
          res.json({ success: false, message: 'Token invalid: ' + err }); // Return error for token validation
        } else {
          req.decoded = decoded; // Create global variable to use in any request beyond
          next(); // Exit middleware
        }
      });
    }
  });

router.get('/profile', (req, res) => {
    // Search for user in database
    User.findOne({ _id: req.decoded.userId }).select('name email').exec((err, user) => {
      // Check if error connecting
      if (err) {
        res.json({ success: false, message: err }); // Return error
      } else {
        // Check if user was found in database
        if (!user) {
          res.json({ success: false, message: 'User not found' }); // Return error, user was not found in db
        } else {
          res.json({ success: true, user: user }); // Return success, send user object to frontend for profile
        }
      }
    });
  });
    return router;
}
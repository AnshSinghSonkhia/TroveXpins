var express = require('express');
var router = express.Router();

// Additional Code Starts
const userModel = require("./users");
const passport = require('passport');
const localStrategy = require('passport-local');

passport.use(new localStrategy(userModel.authenticate()));
// Additional Code Ends

/* GET home page. - This is the login page */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* Get Register Page live at "/register" route */
router.get('/register', function(req, res, next) {
  res.render('register');
});

/* Get Profile Page live at "/profile" route */
router.get('/profile', isLoggedIn, function(req, res, next) {
  res.render('profile');
});



/* When user clicks --> Register Button */
/* We will post the form input from /register route using the below code. 
register.ejs se
*/
router.post('/register', function(req, res, next) {
  const data = new userModel({  // to save data from form inputs
    username: req.body.username,  // save username input from form --> to username in database.
    //password: req.body.password,
    email: req.body.email,
    contact: req.body.contact,
  })

  // promise - to verify user with his password
  userModel.register(data, req.body.password)
  .then(function(){
    passport.authenticate("local")(req, res, function(){
      res.redirect("/profile");
    })
  })
});


/* Let's login the user, with his credentials */
router.post('/login', passport.authenticate("local", {
    failureRedirect: "/",
    successRedirect: "/profile",
}), function(req, res, next) { });


// User Logout
router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});


/* protection for checking if user is loggedIn or not for performing certain tasks --> like, comment, etc...

Now, use `isLoggedIn` function in the routes, you want to give additional protection.

It will be used in routes like --> profile

Never Never Never use this function in routes - "/", "/register" and "/login" --> Otherwise, user will be loggedin without authentication.
*/ 
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();      // if user is authenticated --> Do the next task. Don't redirect to login page.
  }
  res.redirect("/");    // if user is not authenticated --> redirect to login page
}

module.exports = router;

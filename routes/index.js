var express = require('express');
var router = express.Router();

// Additional Code Starts
const userModel = require("./users");
const postModel = require("./post");
const passport = require('passport');
const localStrategy = require('passport-local');
const upload = require('./multer');

const axios = require('axios'); // Import axios for making HTTP requests
const https = require('https'); // Import https module
const fs = require('fs'); // Import fs for file system operations

passport.use(new localStrategy(userModel.authenticate()));
// Additional Code Ends

/* GET home page. - This is the login page */
router.get('/', function(req, res, next) {
  res.render('index', {nav: false});   
  
  // nav is false, So navbar will not load on '/' route.
});

/* Get Register Page live at "/register" route */
router.get('/register', function(req, res, next) {
  res.render('register', {nav: false});
});

/* Get Profile Page live at "/profile" route */
router.get('/profile', isLoggedIn, async function(req, res, next) {
  const user =
  await userModel
        .findOne({username: req.session.passport.user})
        .populate("posts");   // populate --> to get all the posts, created by the user.
        
        // console.log(user);
        
  res.render('profile', {user, nav: true});    // data send with name - "user"
});

/* To show all the posts, uploaded by the user. */
router.get('/show/posts', isLoggedIn, async function(req, res, next) {
  const user =
  await userModel
        .findOne({username: req.session.passport.user})
        .populate("posts");

  res.render('show', {user, nav: true});
});


router.get('/feed', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user});

  /* postModel.find().limit(25)  // This is pagination (Posts per page = 25) */

  const posts = await postModel.find().populate("user");
     
  res.render('feed', {user, posts, nav: true});
});


/* To add (create) new pins / images  */
router.get('/add', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user});
  res.render("add", {user, nav: true});
});


/* For creating new post, taking user inputs
We'll use multer here also */
router.post('/createpost', isLoggedIn, upload.single('postimage'), async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user});
  
  let image;
    // Check if the request contains a file uploaded
    if (req.file) {
        // If a file is uploaded, use the uploaded file
        image = req.file.filename;
    } else if (req.body.imageUrl) {
      // If image URL is provided, fetch the image and save it
      try {

          const agent = new https.Agent({  
            rejectUnauthorized: false
          });

          const response = await axios.get(req.body.imageUrl, { responseType: 'arraybuffer', httpsAgent: agent });
          const imageBuffer = Buffer.from(response.data, 'binary');
          const imageName = 'image_' + Date.now() + '.jpg'; // Generate a unique name for the image
          const imagePath = './public/images/uploads/' + imageName; // Set the path where the image will be saved

          fs.writeFileSync(imagePath, imageBuffer); // Write the image buffer to a file
          image = imageName; // Set the image name as the image for the post
      } catch (error) {
          console.error('Error fetching image from URL:', error);
          // Handle error (e.g., image fetch failed)
          res.status(500).send('Error fetching image from URL');
          return;
      }
  }

  const post = await postModel.create({
    user: user._id,
    title: req.body.title,
    description: req.body.description,
    image: image
  });   // to create the post data in postModel

  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});


/* Route for taking user-input profile image using multer 

It will first check, if the user is loggedIn or not
Then, upload the image.
*/
router.post('/fileupload', isLoggedIn, upload.single('image'), async function(req, res, next) {
    // upload.single('image') has 'image' because form has input name = "image"
    const user = await userModel.findOne({username: req.session.passport.user});
    /* When user is loggedin --> req.session.passport.user has his "username".
    
    We are sending the uploaded profile image to the database.*/

    user.profileImage = req.file.filename;  // changing the profileImage address/location to the newly updated image.

    await user.save();    // Since, we have manually did some changes --> We need to manually save the user Details.

    res.redirect("/profile");   // After saving the new details, redirect to /profile page.
});



/* When user clicks --> Register Button */
/* We will post the form input from /register route using the below code. 
register.ejs se
*/
router.post('/register', function(req, res, next) {
  const data = new userModel({  // to save data from form inputs
    username: req.body.username,  // save username input from form --> to username in database.
    //password: req.body.password,
    name: req.body.fullname,
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

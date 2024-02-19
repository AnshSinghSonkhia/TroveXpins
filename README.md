# TroveXpins - Pinpoint your passion. Discover pins that set your soul alight.

## Tech-Stack:
TailwindCSS, JavaScript, Node.js, Express, Multer

## To-Do:

- login & register screen ☑️
- /register ☑️
- /login ☑️
- /profile - profile page with boards
- /feed - page with all different pins
- /save/:pinid - This route will be used to save pin in any board.
- /delete/:pinid - To delete any pin from any board.
- /logout
- /edit
- /upload

# `/views/partials` folder

These include the partials, that are present in all the pages. Example:
- footer
- header (navbar)

## including partials in `index.ejs`

> paste the below in the body of index.ejs

> we'll write the code in middle
```h
<% include ./partials/header.ejs %>
<% include ./partials/footer.ejs %>
```

# Creating the app (program structure) using `express`

```shell
express --view=ejs
```
> To create in the same opened folder

- Install node_modules

```shell
npm i
```

- Install TailwindCSS

```shell
npm install -D tailwindcss
npx tailwindcss init
```

- To Run Live Server

```shell
npx nodemon
```

## How to create a new page / route?

1. In `index.js` --> get the route & render it from `views` folder.

```js
router.get('/register', function(req, res, next) {
  res.render('register');
});
```

2. Make an ejs file with the routes name in `views` folder

- In this case --> `register.ejs`

3. Write the Frontend Code in `register.ejs`

# Setting up `users.js` & creating our database.

1. Install

```shell
npm i mongoose passport passport-local passport-local-mongoose express-session multer
```

2. require mongoose in `users.js`:

```js
const mongoose = require('mongoose');
const plm = require("passport-local-mongoose");
```

3. Connect MongoDB with mongoose:

```js
mongoose.connect("mongodb://127.0.0.1:27017/project_name") // this is setting it up on localhost.
```

3. Creating userSchema:

```js
const userSchema = mongoose.Schema({
  // user schema should be created / defined here.
});

userSchema.plugin(plm);  // this will enable passport to remember users
module.exports = mongoose.model("user", userSchema);

// model() -->  Mongoose compiles a model for you.
// with ("name-of-model", Schema-to-be-followed) as 2 arguments are passed.
```

# Using `Multer` & `uuid` to take user images and save in our server

1. Install Packages

```shell
npm i multer uuid
```

2. Create `multer.js` in routes

3. Add the following code:

```js
const multer = require('multer');
const {v4: uuidv4} = require("uuid");
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/uploads')
    },
    filename: function (req, file, cb) {
      const unique = uuidv4();
      cb(null, unique + path.extname(file.originalname));
    }
})
  
const upload = multer({ storage: storage })

module.exports = upload;
```

4. `./public/images/uploads` is the folder location in `public/images/uploads`
  - The user images will be stored here.
  - So, create the folder.

5. We are Creating unique image id with `uuid`

6. Make a route in `index.js`
```js
const upload = require('./multer');

/* Route for taking user-input profile image using multer. It will first check, if the user is loggedIn or not
Then, upload the image.
*/
router.post('/fileupload', isLoggedIn, upload.single('image'), function(req, res, next) {
    // upload.single('image') has 'image' because form has input name = "image"
    const user = await userModel.findOne({username: req.session.passport.user});
    /* When user is loggedin --> req.session.passport.user has his "username".
    
    We are sending the uploaded profile image to the database.*/

    user.profileImage = req.file.filename;  // changing the profileImage address/location to the newly updated image.

    await user.save();    // Since, we have manually did some changes --> We need to manually save the user Details.
    
    res.redirect("/profile");   // After saving the new details, redirect to /profile page.
});
```

7. Request the user profile image with it's path in the `profile.ejs` file

```html
<img class="object-cover w-full h-full" src="/images/uploads/<%= user.profileImage %>" alt="">
						
```
> There must not be any spaces in the src, otherwise, it will not get the correct path.

## Problems/Challenges I faced:

1. css file was not loading --> then, I solved it using ChatGPT (Took 25 Minutes)
```shell
A 304 Not Modified response means that the browser already has a cached version of the CSS file, and it doesn't need to download it again because it hasn't changed since the last request.

This behavior is expected and indicates that the CSS file is being served correctly by Express. However, if you've made changes to the CSS file and you want to force the browser to fetch the latest version, you can do the following:

Force Refresh: You can force a refresh in your browser, which typically bypasses the cache and fetches the latest version of the CSS file. In most browsers, you can do this by pressing Ctrl + Shift + R or Cmd + Shift + R.
```


# Additional Tasks - My Improvements

1. Default user profile image --> it should be shown for new accounts with no image, or when user wants to delete profile image.

2. Dynamically Adding TroveBoards (Trove) --> User should be able to create new collections.
    - `Create Pin` button ki jagah `Create Trove` button aayega --> new TroveBoard create krne ke liye.
    - Sabhi boards mai button hona chahiye, unke ander new `Create Pin` ka. --> `+ icon`

3. Sabhi boards ko default cover image dena hai (New Pin add krne ke icon ke saath.)

4. Home Page
    - Home Page Navbar will have login & sign up buttons.

5. Feed Page should have a `Search Bar` to search different pins by all the users

6. Working `Edit Profile` button
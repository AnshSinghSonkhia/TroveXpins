# TroveXpins - Pinpoint your Passion. Discover Troves that Set your Soul Alight.

Create Troves & Share your joyful moments with pins

## Tech-Stack:

<code><img height="30" src="https://img.shields.io/badge/Tailwind%20CSS-111111?style=for-the-badge&logo=tailwindcss&logoColor=39bcf7"></code>
<code><img height="30" src="https://img.shields.io/badge/JavaScript-111111?style=for-the-badge&logo=javascript&logoColor=F7DF1E"></code>
  <code><img height="30" src="https://img.shields.io/badge/Node.js-1e4620?style=for-the-badge&logo=nodedotjs&logoColor=white"></code>
  <code><img height="30" src="https://img.shields.io/badge/MongoDB-238636?style=for-the-badge&logo=mongodb&logoColor=white"></code>
  <code><img height="30" src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"></code>
  <br><br>
  <code><img height="30" src="https://img.shields.io/badge/Passportjs-000000?style=for-the-badge&logo=Passportjs&logoColor=white"></code>
  <code><img height="30" src="https://img.shields.io/badge/ejs-a6004f?style=for-the-badge&logo=EJS&logoColor=white"></code>
  <code><img height="30" src="https://img.shields.io/badge/Multer-252525?style=for-the-badge&logo=Multer&logoColor=white"></code>
  <code><img height="30" src="https://img.shields.io/badge/Mongoose-238636?style=for-the-badge&logo=Mongoose&logoColor=white"></code>
  <code><img height="30" src="https://img.shields.io/badge/UUID-252525?style=for-the-badge&logo=uuid&logoColor=white"></code>
<br>

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


# Improvement 1 - Another option to upload images via image url

1. To fetch, install

```shell
npm i axios
npm i https
```

2. In `index.js`

```js
const axios = require('axios'); // Import axios for making HTTP requests
const https = require('https'); // Import https module

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
          });       // Don't add this line for production version. I lost my ssl certificate, that's why I need to bypass this.

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
```

3. If user uploaded the image, he can not give the url to fetch image. So, we handle it in `add.js`

# ToDo: for production deployment

- [ ] Add MongoDB Atlas inplace of mongoDB at localhost

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

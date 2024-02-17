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

## Problems/Challenges I faced:

1. css file was not loading --> then, I solved it using ChatGPT (Took 25 Minutes)
```shell
A 304 Not Modified response means that the browser already has a cached version of the CSS file, and it doesn't need to download it again because it hasn't changed since the last request.

This behavior is expected and indicates that the CSS file is being served correctly by Express. However, if you've made changes to the CSS file and you want to force the browser to fetch the latest version, you can do the following:

Force Refresh: You can force a refresh in your browser, which typically bypasses the cache and fetches the latest version of the CSS file. In most browsers, you can do this by pressing Ctrl + Shift + R or Cmd + Shift + R.
```

### Time-stamp: 54:50 / 2:19:07 of 
"Pinterest Clone"

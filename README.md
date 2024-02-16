# Tech-Stack:
TailwindCSS, JavaScript, Node.js, Express, Multer

## To-Do:

- login & register screen
- /register
- /login
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




### Time-stamp: 11:26 / 2:19:07 of 
"Pinterest Clone"
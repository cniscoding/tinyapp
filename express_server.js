const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const generateRandomString = function(uniqueLength) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < uniqueLength; i++) {
    const randomIndex = (Math.floor(Math.random() * (letters.length - 1)));
    randomString += letters[randomIndex];
  }
  return randomString;
};

// add POST route for /login
app.post("/login", (req, res) => {
  const username = req.body.username;
  res.cookie('username', username);
  res.redirect('/urls');
});

// logout
app.post("/logout", (req,res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});


// takes submitted input and adds to urlDatabase
app.post("/urls", (req, res) => {
  const id = generateRandomString(6); // creates a unique ID
  urlDatabase[id] = req.body.longURL; // stores the newly created ID and long URL
  res.redirect(`/urls/${id}`);
});

// add post to DELETE
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect('/urls');
});

// add post to EDIT
app.post("/urls/:id/", (req, res) => {
  const id = req.params.id;
  // console.log('req.params.id;',req.params.id)
  const updateURL = req.body.longURL;
  urlDatabase[id] = updateURL;
  res.redirect(`/urls`);
});

//edit page
app.post("/urls", (req, res) => {
  const id = req.params.id;
  res.redirect(`/urls/${id}`);
});

// redirects to the long URL based on the short string.
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  if (longURL) {
    res.redirect(longURL);
  }
  //What would happen if a client requests a short URL with a non-existant id?
  // else { need fix this edge case
  //   res.status(400).send('please enter a url'); // send to error page
  // }
});

// // login page - do i even need this?
// app.get("/login", (req,res) => {
//   res.render('login')
// })

// home page that shows the list
app.get("/urls", (req,res) => {
  const templateVars = {
    urls : urlDatabase,
    username : req.cookies['username'],
  };
  res.render('urls_index', templateVars);
});

// create a new URL page
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// page after creating a new URL
app.get("/urls/:id", (req, res) => {
  const templateVars = { 
    id: req.params.id, 
    urls: urlDatabase 
  };
  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


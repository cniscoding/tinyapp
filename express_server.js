const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

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
  const cookies = req.body.username;
  // console.log('cookies, req.body.username;', req.body.username)
  //set cookies??
  res.cookie('username', cookies)
  res.redirect('/urls')
});

// takes submitted input and adds to urlDatabase
app.post("/urls", (req, res) => {
  const id = generateRandomString(6); // creates a unique ID
  urlDatabase[id] = req.body.longURL; // stores the newly created ID and long URL
  res.redirect(`/urls/${id}`);
  // console.log(req.body); // Log the POST request body to the console gives { longURL : 'address.com'}
  // console.log(urlDatabase[id]) // gives 'address.com'
  // res.send("Ok"); // Respond with 'Ok' (we will replace this)
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
  console.log('req.params.id;',req.params.id)
  const updateURL = req.body.longURL;
  urlDatabase[id] = updateURL;
  res.redirect(`/urls`);
});

//not going to the edit page.
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

  // console.log('longURL', longURL)
  // console.log('urlDatabase', urlDatabase); // returns the urlDatabase object
  // console.log(urlDatabase[req.params.id]) // www.yahoo.ca
  // console.log('req.params', req.param) //req.params [Function: param]
  
});

// // login page - do i even need this?
// app.get("/login", (req,res) => {
//   res.render('login')
// })

// home page that shows the list
app.get("/urls", (req,res) => {
  const templateVars = { urls : urlDatabase };
  res.render('urls_index', templateVars);
});

// create a new URL page
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// page after creating a new URL
app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, urls: urlDatabase };
  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


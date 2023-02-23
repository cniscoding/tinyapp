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

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};
// helper functions
const generateRandomString = function(uniqueLength) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < uniqueLength; i++) {
    const randomIndex = (Math.floor(Math.random() * (letters.length - 1)));
    randomString += letters[randomIndex];
  }
  return randomString;
};


const userLookUp = function(email) {
  for (let user of Object.keys(users)) {
    if (email !== users[user].email) {
      return null;
    }
    return users;
  }
};
// POST login page?
// won't work beacuse the conditional is not completed
app.post("/login", (req,res) => {
  console.log('one login post');
  const email = req.body.email;
  const password = req.body.password;
  // if statement for wrong password and/or account does not exist

  // res.cookie('user_id', user_Id);
  res.redirect('/urls/');
});

// GET login page
//does not have the the email and password match yet
app.get("/login", (req, res)=> {
  console.log('two login get');
  const templateVars = {
    user_Id : req.cookies.user_Id,
  };
  res.render('login', templateVars);
});

// register new user
app.post('/register', (req,res) =>{
  console.log('three register post');
  if (req.body.email === '' || req.body.password === '') {
    return res.status(400).send('error 400 - please enter an email and/or password');
  }
  
  for (let user of Object.keys(users)) {
    if (req.body.email === users[user].email) {
      return res.status(400).send('error 400 - email already exist');
    }
  }
  
  const email = req.body.email;
  const password = req.body.password;
  const id = generateRandomString(6);
  const newUser = {
    id,
    email,
    password
  };
  users[id] = newUser;
  console.log('users', users);
  res.cookie('user_Id', newUser);
  res.redirect('/urls');
  res.redirect('register');
});

// add GET /register
app.get("/register", (req, res)=> {
  console.log('four /register GET');
  const templateVars = {
    user_Id : req.cookies.user_Id,
  };
  res.render('register', templateVars);
});

// add POST route for /login
app.post("/login", (req, res) => {
  const user_Id = req.body.username;
  res.cookie('user_Id', user_Id);
  res.redirect('logins');
});

// logout
app.post("/logout", (req,res) => {
  res.clearCookie('user_Id');
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


// home page that shows the list
app.get("/urls", (req,res) => {
  const templateVars = {
    urls : urlDatabase,
    user_Id : req.cookies.user_Id,
  };
  res.render('urls_index', templateVars);
});

// create a new URL page
app.get("/urls/new", (req, res) => {
  const templateVars = {
    user_Id : req.cookies.user_Id,
  };
  res.render("urls_new", templateVars);
});

// page after creating a new URL
app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    urls: urlDatabase,
    user_Id : req.cookies.user_Id,
  };
  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


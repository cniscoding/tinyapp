// const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bcrypt = require("bcryptjs");

app.set("view engine", "ejs");

//middleware
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use(cookieSession({
  name: 'cookiemonster',
  keys: ['secretket']
}));

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};
const users = {
  // userRandomID: {
  //   id: "userRandomID",
  //   email: "user@example.com",
  //   password: "purple-monkey-dinosaur",
  // },
  // user2RandomID: {
  //   id: "user2RandomID",
  //   email: "user2@example.com",
  //   password: "dishwasher-funk",
  // },
  // test1: {
  //   id: "tester1",
  //   email: "tester1@test.ca",
  //   password: "testme",
  // },
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

const userPass = function(inputEmail) {
  for (let user in users) {
    if (users[user].email === inputEmail) {
      return users[user].password;
    }
  }
};

const userLookUp = function(input, search) {
  for (let user of Object.keys(users)) {
    if (search === 'id') {
      if (input === users[user].email)
        return users[user].id;
    }
    if (input === users[user][search]) {
      return true;
    }
  }
  return false;
};

const urlsForUser = function(id) {
  let userUrl = {};
  for (let key in urlDatabase) {
    if (urlDatabase[key].userID === id) {
      userUrl[key] = urlDatabase[key].longURL;
    }
  }
  return userUrl;
};

// POST login
app.post("/login", (req,res) => {
  const inputEmail = req.body.email;
  const inputPassword = req.body.password;
  // const hashedPassword = bcrypt.hashSync(inputPassword, 10);

  if (!userLookUp(inputEmail, 'email')) {
    return res.status(403).send('error 403 - please enter a valid email and/or password');
  }
  
  // if (!userLookUp(inputPassword, 'password')) {
  //   return res.status(403).send('error 403 - please enter a valid email and/or password');
  // }



  if (bcrypt.compareSync(inputPassword, userPass(inputEmail))) {
    const user = userLookUp(inputEmail, 'id');
    // res.cookie('user_Id', user);
    req.session.user_Id = user;
    res.redirect('/urls/');
  } else {
    return res.status(403).send('error 403 - please enter a valid email and/or password');
  }

});

// GET login page
app.get("/login", (req, res)=> {
  // if (req.cookies.user_Id){
  if (req.session.user_Id) {
    return res.redirect('/urls');
  }
  const templateVars = {
    // user_Id : req.cookies.user_Id,
    user_Id : req.session.user_id,
  };
  res.render('login', templateVars);
});

// register new user
app.post('/register', (req,res) =>{
  const id = generateRandomString(6);
  const inputEmail = req.body.email;
  const inputPassword = req.body.password;
  const hashedPassword = bcrypt.hashSync(inputPassword, 10);
  
  if (inputEmail === '' || inputPassword === '') {
    return res.status(400).send('error 400 - please enter an email and/or password');
  }
  
  if (userLookUp(inputEmail, 'email')) {
    return res.status(400).send('error 400 - email already exist');
  }

  const newUser = {
    id : inputEmail,
    email : inputEmail,
    password : hashedPassword
  };
  users[id] = newUser;
  // console.log('hashedPassword',hashedPassword)
  // console.log('users',users)
  // res.cookie('user_Id', newUser.email);
  req.session.user_Id = newUser.email;
  res.redirect('/urls');
});

// add GET /register
app.get("/register", (req, res)=> {
  // if (req.cookies.user_Id){
  if (req.session.user_id) {
    return res.redirect('/urls');
  }
  const templateVars = {
    // user_Id : req.cookies.user_Id,
    user_Id : req.session.user_Id,
  };
  res.render('register', templateVars);
});

// add POST route for /login
app.post("/login", (req, res) => {
  const user_Id = req.body.username;
  // res.cookie('user_Id', user_Id);
  res.session.user_Id = user_Id;
  res.redirect('logins');
});

// logout
app.post("/logout", (req,res) => {
  // res.clearCookie(req.session.user_Id);
  req.session = null;
  res.redirect('/login');
});

// takes submitted input and adds to urlDatabase
app.post("/urls", (req, res) => {
  // if (!req.cookies.user_Id){
  if (!req.session.user_Id) {
    return res.status(401).send('401 - Unauthorized access. Please login.');
  }
  const id = generateRandomString(6);
  // const newUserId = req.cookies.user_Id
  const newUserId = req.session.user_Id;
  const inputUrl = req.body.longURL;

  const addLink = {
    longURL : inputUrl,
    userID : newUserId,
  };

  urlDatabase[id] = addLink;
  res.redirect(`/urls/${id}`);
});

// add post to DELETE
app.post("/urls/:id/delete", (req, res) => {
  // if (!req.cookies.user_Id){
  if (!req.session.user_Id) {
    return res.status(401).send('401 - Unauthorized access. Please login.');
  }
  if (!urlDatabase[req.params.id]) {
    return res.status(404).send('404 - Page not found.');
  }
  if (urlDatabase[req.params.id].userID !== req.session.user_Id) {
    return res.status(401).send('401 - Unauthorized access. Please login to view');
  }
 
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect('/urls');
});

// add post to EDIT
app.post("/urls/:id/", (req, res) => {
  // if (!req.cookies.user_Id){
  if (!req.session.user_Id) {
    return res.status(401).send('401 - Unauthorized access. Please login.');
  }

  const id = req.params.id;
  const updateURL = req.body.longURL;
  urlDatabase[id].longURL = updateURL;
  res.redirect(`/urls`);
  console.log(urlDatabase);
});

//edit page
app.post("/urls", (req, res) => {
  // if (!req.cookies.user_Id){
  if (!req.session.user_Id) {
    return res.status(401).send('401 - Unauthorized access. Please login.');
  }
  const id = req.params.id;
  res.redirect(`/urls/${id}`);
});

// redirects to the long URL based on the short string.
app.get("/u/:id", (req, res) => {
  const linkLongUrl = urlDatabase[req.params.id].longURL;
  if (linkLongUrl) {
    res.redirect(linkLongUrl);
  }
});

// home page that shows the list
app.get("/urls", (req,res) => {
  // if (!req.cookies.user_Id){
  if (!req.session.user_Id) {
    return res.status(401).send('401 - Unauthorized access. Please login to view');
  }
  const templateVars = {
    // urls : urlsForUser(req.cookies.user_Id),
    // user_Id : req.cookies.user_Id,
    urls : urlsForUser(req.session.user_Id),
    user_Id : req.session.user_Id,
  };
  res.render('urls_index', templateVars);
});

// create a new URL page
app.get("/urls/new", (req, res) => {
  // if (!req.cookies.user_Id){
  if (!req.session.user_Id) {
    return res.redirect('/login');
  }
  const templateVars = {
    // user_Id : req.cookies.user_Id,
    user_Id : req.session.user_Id,
  };
  res.render("urls_new", templateVars);
});

// page after creating a new URL
app.get("/urls/:id", (req, res) => {
  // if (!req.cookies.user_Id){
  if (!req.session.user_Id) {
    return res.status(401).send('401 - Unauthorized access. Please login to view');
  }
  if (!urlDatabase[req.params.id].longURL) {
    return res.status(404).send('404 - Page not found.');
  }
  // if (urlDatabase[req.params.id].userID !== req.cookies.user_Id){
  if (urlDatabase[req.params.id].userID !== req.session.user_Id) {
    return res.status(401).send('401 - Unauthorized access. Please login to view');
  }

  const templateVars = {
    id: req.params.id,
    urls: urlDatabase,
    // user_Id : req.cookies.user_Id,
    user_Id : req.session.user_Id,
  };
  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


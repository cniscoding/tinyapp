const {
  generateRandomString,
  userLookUp,
  urlsForUser,
  } = require('./helpers');

const cookieSession = require("cookie-session");
const express = require("express");
const app = express();
const PORT = 8080; 
const bcrypt = require("bcryptjs");

app.set("view engine", "ejs");

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'cookiemonster',
  keys: ['secretkey']
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
    yL6lvj: {
    id: 'yL6lvj',
    email: '1@1.ca',
    password: '$2a$10$wxMJyyddGu2jRhqq0o1qIuyH4Mtb.2Tb0XKuZ8pRq8irQEGlGm9ei' // 123
  },
};

// POST login
app.post("/login", (req,res) => {
  const inputEmail = req.body.email;
  const inputPassword = req.body.password;

  if (!userLookUp(inputEmail, 'email', users)) {
    return res.status(403).send('error 403 - please enter a valid email and/or password');
  }
  // console.log('userLookUp(inputEmail, password users', userLookUp(inputEmail, 'password', users))
  // console.log('userPass(inputEmail, users)', userPass(inputEmail, users))

  if (bcrypt.compareSync(inputPassword, userLookUp(inputEmail, 'password', users))) {
    const user = userLookUp(inputEmail, 'id', users);  
    req.session.user_Id = user;
    res.redirect('/urls/');
  } else {
    return res.status(403).send('error 403 - please enter a valid email and/or password');
  }
});

// GET login page
app.get("/login", (req, res)=> {
  if (req.session.user_Id) {
    return res.redirect('/urls');
  }
  const templateVars = {
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
  
  if (userLookUp(inputEmail, 'email', users)) {
    return res.status(400).send('error 400 - email already exist');
  }

  const newUser = {
    id : id,
    email : inputEmail,
    password : hashedPassword
  };
  users[id] = newUser;
  req.session.user_Id = newUser.email;
  console.log('users',users) // remove this when done testing
  res.redirect('/urls');
});

// add GET /register
app.get("/register", (req, res)=> {
  if (req.session.user_id) {
    return res.redirect('/urls');
  }
  const templateVars = {
    user_Id : req.session.user_Id,
  };
  res.render('register', templateVars);
});

// add POST route for /login
app.post("/login", (req, res) => {
  const user_Id = req.body.username;
  res.session.user_Id = user_Id;
  res.redirect('logins');
});

// logout
app.post("/logout", (req,res) => {
  req.session = null;
  res.redirect('/login');
});

// takes submitted input and adds to urlDatabase
app.post("/urls", (req, res) => {
  if (!req.session.user_Id) {
    return res.status(401).send('401 - Unauthorized access. Please login. ON URL PAGE');
  }
  const id = generateRandomString(6);
  const newUserId = req.session.user_Id;
  const inputUrl = req.body.longURL;

  const addLink = {
    longURL : inputUrl,
    userID : newUserId,
  };

  console.log('urlDatabase', urlDatabase)
  urlDatabase[id] = addLink;
  res.redirect(`/urls/${id}`);
});

// add post to DELETE
app.post("/urls/:id/delete", (req, res) => {
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
  if (!req.session.user_Id) {
    return res.status(401).send('401 - Unauthorized access. Please login.');
  }

  const id = req.params.id;
  const updateURL = req.body.longURL;
  urlDatabase[id].longURL = updateURL;
  res.redirect(`/urls`);
});

//edit page
app.post("/urls", (req, res) => {
  if (!req.session.user_Id) {
    return res.status(401).send('401 - Unauthorized access. Please login. ON EDIT PAGE?');
  }
  const id = req.params.id;
  res.redirect(`/urls/${id}`);
});

app.get("/u/:id", (req, res) => {
  const linkLongUrl = urlDatabase[req.params.id].longURL;
  if (linkLongUrl) {
    res.redirect(linkLongUrl);
  }
});

// home page that shows the list
app.get("/urls", (req,res) => {
  if (!req.session.user_Id) {
    return res.status(401).send('401 - Unauthorized access. Please login to view ON HOME PAGE');
  }
  const templateVars = {
    urls : urlsForUser(req.session.user_Id, urlDatabase),
    user_Id : req.session.user_Id,
  };
  console.log('req.session.user_Id',req.session.user_Id)
  res.render('urls_index', templateVars);
});

// create a new URL page
app.get("/urls/new", (req, res) => {
  if (!req.session.user_Id) {
    return res.redirect('/login');
  }
  const templateVars = {
    user_Id : req.session.user_Id,
  };
  res.render("urls_new", templateVars);
});

// page after creating a new URL
app.get("/urls/:id", (req, res) => {
  if (!req.session.user_Id) {
    return res.status(401).send('401 - Unauthorized access. Please login to view');
  }
  if (!urlDatabase[req.params.id].longURL) {
    return res.status(404).send('404 - Page not found.');
  }
  if (urlDatabase[req.params.id].userID !== req.session.user_Id) {
    return res.status(401).send('401 - Unauthorized access. Please login to view');
  }

  const templateVars = {
    id: req.params.id,
    urls: urlDatabase,
    user_Id : req.session.user_Id,
  };
  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const generateRandomString = function(uniqueLength){
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < uniqueLength; i++){
    const randomIndex = (Math.floor(Math.random()*(letters.length-1)));
    randomString += letters[randomIndex]
  }
  return randomString
}

app.post("/urls", (req, res) => {
  const id = generateRandomString(6) // creates a unique ID
  urlDatabase[id] = req.body.longURL; // stores the newly created ID and long URL
  res.redirect(`/urls/${id}`)
  // console.log(req.body); // Log the POST request body to the console gives { longURL : 'address.com'}
  // console.log(urlDatabase[id]) // gives 'address.com'
  // res.send("Ok"); // Respond with 'Ok' (we will replace this)
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  console.log('longURL', longURL)
  // console.log('urlDatabase', urlDatabase); // returns the urlDatabase object
  // console.log(urlDatabase[req.params.id]) // www.yahoo.ca
  // console.log('req.params', req.param) //req.params [Function: param]
  // question - how come when i do https://www.yahoo.ca/ it works but when i go www.yahoo.ca it does not
  res.redirect(longURL);
});

app.get("/urls", (req,res) => {
  const templateVars = { urls : urlDatabase };
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, urls: urlDatabase };
  res.render("urls_show", templateVars);
});

 
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

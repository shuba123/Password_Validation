var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var passwordHash = require("password-hash/lib/password-hash");
const port = 3003;
const url = "mongodb://localhost:27017";
var mongodb = require("mongodb");
var mongoClient = mongodb.MongoClient;
const db = null;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Getting all pages
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/loginuser", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.get("/home", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

/* Redirect to Login Page
 */

var ippass;
mongoClient.connect(url, function(err, client) {
  db = client.db("NewUsers");
  app.post("/adduser", (req, res) => {
    ippass = passwordHash.generate(req.body["Password"]);
    var user = {
      name: req.body["First Name"],
      passwordhash: ippass,
      lastname: req.body["Last Name"],
      emailid: req.body["Email Address"],
    };
   
    createDocuments(user, db, res, function(err, res) {
      if (err) {
        res.status(400);
        res.sendFile(__dirname + "/error.html");
      } else {
        res.status(200);
        res.sendFile(__dirname + "/login.html");
      }
    });
  });

  /* Redirect to Home Page
   */
  app.post("/home", (req, res) => {
    const collection = db.collection("adduser");
    const emailid = req.body["Email Address"];
    var pass = req.body["Password"];
    var ip = " ";
    collection.findOne({ emailid: emailid }, function(err, result) {
      if (err) throw err;
      else {
        ip = result["passwordhash"];

        if (passwordHash.verify(pass, ippass)) {
          res.status(200);
          res.sendFile(__dirname + "/home.html");
        } else {
          res.status(400);
          res.sendFile(__dirname + "/error.html");
        }
        client.close();
      }
    });

  });
  
});
var createDocuments = function(user, db, res, callback) {
  const collection = db.collection("adduser");
  collection.insertOne(user, function(err, doc) {
    callback(err, res);
  });
};

app.listen(port, () => {
  console.log("Server listening on port " + port);
});

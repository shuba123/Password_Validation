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
    // if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body["Email Address"])) {

    //     user.emailid = req.body["Email Address"];
    // }
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

//var temp = collection.findOne("Password : ");

//var query = { emailid: JSON.stringify(req.body.emailid)};

// collection.find(query).toArray(function(err, result){
//     if(err){
//         throw err;
//     }
//     else {
//         if(passwordHash.verify(JSON.stringify(req.body.Password),result.Password))
//         res.send("Name saved to database"+JSON.stringify(req.body.Password));

//     }

// });

//   res.send("Password ");
//   //if(passwordHash.verify(JSON.stringify(req.body.Password),))
//   dbConn.catch(function(err){
//     res.send("Not able to save to database");
//     throw err;
// });
//if(JSON.stringify(req.body.Password) === temp)
//res.send(JSON.stringify(req.body.Password));
//res.status(200);

//res.sendFile(__dirname+"/home.html");

//});

/*
// Connecting to the localhost mongo db and create Documents
mongoClient.connect(url, function(err, client) {
  const db = client.db("userDB");

  createDocuments(db, function() {
    client.close();
  });
  retrieveDocuments(db, () => {
    client.close();
  });
});


// Create Users and store it in database
var createDocuments = function(db, callback) {
  var collection = db.collection("users");
  collection.insertMany(
    [
      {
        firstname: "Rams",
        lastname: "Posa",
        emailid: "rams@journaldev.com",
        password: passwordHash.generate("welcome123")
      },
      {
        firstname: "Mani",
        lastname: "Nulu",
        emailid: "mani@journaldev.com",
        password: passwordHash.generate("12345678")
      },
      {
        firstname: "Bhargs",
        lastname: "Nulu",
        emailid: "Bhargs@journaldev.com",
        password: passwordHash.generate("1a*")
      }
    ],
    function(err, result) {
      if (err) {
        console.log(err);
      } else {
        callback(result);
        console.log(result);
      }
    }
  );
};*/
/*
// Retrieve Users
var retrieveDocuments = function(db, callback) {
  var collection = db.collection("users");
  collection.findOne({ emailid: "mani@journaldev.com" }, (err, r) => {
    if (err) {
      console.log(err);
    } else {
      callback(r);
      console.log("Hiii "+ r.firstname);
      checkPassword(r);
     
    }
  });
};

//Check Password
function checkPassword(s) {

  read({ prompt: "Enter password: ", silent: true }, function(er, ippass) {
    if (passwordHash.verify(ippass,s.password)) {
      console.log("Correct!");
    } else {
      console.log("Wrong password!");
    }
  });

}
*/

app.listen(port, () => {
  console.log("Server listening on port " + port);
});

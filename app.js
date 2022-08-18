const { User } = require("./models/user");
const { Event } = require("./models/event");

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mysql = require("mysql");

var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "ems",
});

conn.connect(function (err) {
  if (err) throw err;
  console.log("MYSQL server connected.");
});

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));

const users = [];

app.get("/", function (req, res) {
  res.redirect("/register");
});

app.get("/register", function (req, res) {
  res.sendFile(__dirname + "/pages/register.html", function (err) {
    if (err) console.log("Error: ", err);
  });
});

app.post("/register", function (req, res) {
  username = req.body.username;

  conn.query(
    `INSERT INTO users(username) VALUES("${username}")`,
    function (err, result) {
      if (err) throw err;
      console.log(result);
    }
  );

  res.redirect("/login");
});

app.get("/login", function (req, res) {
  res.redirect("/register");
});

app.post("/login", function (req, res) {
  if (req.body.username) {
    let user = new User(conn, req.body.username);
    res.cookie("ems-id", user.id);
    console.log(user, user.id);
    res.redirect("/event");
  } else {
    res.write("Error");
    res.send();
  }
});

app.get("/event", function (req, res) {
  if (req.query.eventName) {
    conn.query(
      `SELECT * FROM events WHERE name="${req.query.eventName}"`,
      function (err, result) {
        if (err) throw err;
        res.header({ "content-type": "application/json" });
        res.write(JSON.stringify(result));
        res.send();
      }
    );
  } else {
    conn.query(`SELECT * FROM events`, function (err, result) {
      if (err) throw err;
      res.header({ "content-type": "application/json" });
      res.write(JSON.stringify(result));
      res.send();
    });
  }
});

app.get("/event/:userid", function (req, res) {
  let userId = req.params.userid;
  // use userid to find events registered by the user
  // let user = new User(userId);
  res.send();
});

app.listen(3000, function () {
  console.log("Server running at port 3000.");
});

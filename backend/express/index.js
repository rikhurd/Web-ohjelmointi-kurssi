const mysql = require("mysql");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// default route
app.get("/", function (req, res) {
  return res.send({ error: true, message: "hello" });
});

app.listen(5050, function () {
  console.log("Node app is running on port 5050");
});

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "sql123",
  database: "urheilijatdb",
  multipleStatements: true, //out parametria varten aliohjelmassa
});
con.connect((err) => {
  if (err) {
    console.log("Error connecting to Db");
    return;
  }
  console.log("Connection established");
});

// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});


// Hae kaikki urheijilat
app.get("/urheilijat", (req, res) => {
  con.query("SELECT * FROM urheilijat", (error, rows) => {
    if (error) throw error;

    res.json(rows);
    //return res.send({ error: false, data: results, message: 'henkilot list.' });
  });
});

// Retrieve urheilijat with id
app.get("/urheilijat/:id", (req, res) => {
  let urheilijat_id = req.params.id;
  if (!urheilijat_id) {
    return res
      .status(400)
      .send({ error: true, message: "Please provide urheilija" });
  }
  con.query(
    "SELECT * FROM urheilijat where id=?",
    urheilijat_id,
    (error, rows) => {
      if (error) throw error;

      res.json(rows);

      //return res.send({ error: false, data: results[0], message: 'henkilot list.' });
    }
  );
});

//Add a new henkilo
app.post("/lisaa", (req, res) => {
  const urheilija = req.body;


  con.query(
    "INSERT INTO urheilijat SET ?",
    urheilija,
    (error, results, rows) => {
      if (error) throw error;
      return res.send({
        error: false,
        data: results,
        message: "New user has been created successfully.",
      });
    }
  );
});

//  Update urheilijat with id
app.put("/urheilijat", (req, res) => {
  let urheilijat_id = req.body.id;
  let urheilija = req.body;

  con.query(
    "UPDATE urheilijat SET ? WHERE id = ?",
    [urheilija, urheilijat_id],
    (error, results, fields) => {
      if (error) throw error;
      return res.send({
        error: false,
        data: results,
        message: "urheilijat has been updated successfully.",
      });
    }
  );
});

//  Delete urheilijat
app.delete("/urheilijat/:id", (req, res) => {
  const urheilijat_id = Number(req.params.id);
  if (!urheilijat_id) {
    return res
      .status(400)
      .send({ error: true, message: "Please provide urheilijat_id" });
  }
  con.query(
    "DELETE FROM urheilijat WHERE id = ?",
    [urheilijat_id],
    (error, results, fields) => {
      if (error) throw error;
      return res.send({
        error: false,
        data: results,
        message: "Urheilija has been updated successfully.",
      });
    }
  );
});

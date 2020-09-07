//REST API demo in Node.js
var express = require("express"); // requre the express framework
var app = express();
var fs = require("fs"); //require file system object
var mongoose = require("mongoose");
var cors = require("cors");
var path = require("path");

app.set("port", process.env.PORT || 8000);
var port = app.get("port");

//now i can usepublic folder ke content anywhere in the node project
app.use(express.static(path.join(__dirname, "./new/assets")));

//middlewares
app.use(express.json());
app.use(cors());

//DB config-mongo stuff
const connectionurl =
  "mongodb+srv://sahil:Sahil@97@cluster0.itgiu.mongodb.net/ramayandb?retryWrites=true&w=majority";
mongoose.connect(connectionurl, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Schema = mongoose.Schema;

//db schema
var userDataSchema = new Schema(
  {
    _id: Number,
    character: String,
    quote: String,
  },
  { collection: "user-data" }
);

var UserData = mongoose.model("User-data", userDataSchema);

//Put the API data
app.get("/putdata", function (req, res, next) {
  var item = {
    _id: 35,
    character: "Laxman",
    quote:
      "I am but a dependent, as long as you are there, may it be for innumerable years, I am your adherent, Ram, therefore you yourself tell me to build hermitage in such and such delightful place.",
  };

  var data = new UserData(item);
  data.save();
  res.send(data);
});

//Get all the quotes
app.get("/", function (req, res, next) {
  res.sendFile("index.html", {
    root: path.join(__dirname, "./new"),
  });
});

//Get all the quotes
app.get("/quotes", function (req, res, next) {
  UserData.find().then(function (datacame) {
    console.log(datacame);
    res.send(datacame);
  });
});

//Get random quotes
app.get("/quotes/random", function (req, res, next) {
  UserData.find()
    .limit(-1)
    .skip(Math.floor(Math.random() * 10 + 1))
    .then(function (datacame) {
      console.log(datacame);
      res.send(datacame);
    });
});

//Get quotes by id
app.get("/quotes/specific/:id", function (req, res, next) {
  UserData.findOne({
    _id: req.params.id,
  }).then(function (data) {
    res.send(data);
  });
});

//Get quotes by character
app.get("/quotes/:character", function (req, res, next) {
  UserData.find({
    character: req.params.character,
  }).then(function (data) {
    res.send(data);
    console.log(data);
  });
});

// Create a server to listen at port 8080
var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("REST API demo app listening at http://%s:%s", host, port);
});

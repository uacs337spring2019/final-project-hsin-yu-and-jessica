"use strict";
const path = require('path');
const express = require("express");
const app = express();
const io = require("socket.io")();
io.origins("*:*");

const fs = require("fs");

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
               "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

/*
This sends back the file of scene.json containing all of the objects for the scene and
coordinates for viewPosition.
*/
app.get('/scene', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");

  res.header("Content-Type", "application/json");

  res.sendFile(path.join(__dirname, "scene.json"));
});

io.on('connection', function(socket) {
  console.log("VR user connected");
});

/*
This receives JSON objects to parse and check to make sure JSON has all of the correct
information necessary to store into scene.json file.
*/
app.post('/object', jsonParser, function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");

  let type = req.body.type;
  let position = req.body.position;
  let color = req.body.color;
  let id = req.body.id;

  if (type !== "" && position !== "" && color !== "" && id !== "") {
    // get "objects" (which is an array of objects) to append json to that array of objects
    let json = fs.readFileSync(__dirname + "/scene.json", 'utf8');
    let scene = JSON.parse(json);
    scene["objects"].push({"type" : type, "position" : position, "color" : color, "id" : id});

    fs.writeFileSync(__dirname + "/scene.json", JSON.stringify(scene));
    console.log("Object saved!");
    res.send("Object saved!");
    io.emit('update', { for: 'everyone'});
  }
});

/*
This receives a JSON object containing the viewPosition. The JSON object received is checked
to make sure it is not emppty and then appended to scene.json under viewPosition.
*/
app.post('/view', jsonParser, function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");

  let view = req.body.viewPosition;

  if (view !== "") {
    let json = fs.readFileSync(__dirname + "/scene.json", 'utf8');
    let scene = JSON.parse(json);
    let viewPosition = scene["viewPosition"];
    viewPosition = view;

    fs.writeFileSync(__dirname + "/scene.json", JSON.stringify(scene));
    console.log("Position saved!");
    res.send("Position saved!");
    io.emit('update', {for: 'everyone'});
  }
});

app.use('/', express.static(__dirname));

app.listen(process.env.PORT);
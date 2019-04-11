"use strict";

const express = require("express");
const app = express();

const fs = require("fs");

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
               "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(express.static('public'));

/*

function getComponents(rawData) {
  let object = {};

  let components = rawData.split(":");
  if (components != '') {
    object["type"] = components[0];
    object["position"] = components[1];
    object["color"] = components[2];
    object["id"] = components[3];
  }

  return object;
}

function getObjects(objectsFromData) {
  let arrOfObjects = [];

  for (let o = 0; o < objectsFromData.length; o++) {
    let object = getComponents(objectsFromData[o]);
    arrOfObjects.push(object);
  }

  return allObjects;
}

*/

app.get('/', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");

  res.header("Content-Type", "application/json");

  res.send(fs.readFileSync("scene.json", 'utf8'));

  /*

  let allObjects = {};

  // if getting from a file...
  let file = "objects.txt";
  let data = fs.readFileSync(file, 'utf8');

  let objectsFromData = data.split("\n");

  let arrOfObjects = getObjects(objectsFromData.slice(1, objectsFromData.length));
  allObjects["objects"] = arrOfObjects;

  allObjects["viewPosition"] = objectsFromData[0];
  res.send(JSON.stringify(allObjects));

  */
})

/*
This receives JSON objects to parse and check to make sure JSON has all of the correct
information necessary to store into scene.json file
*/
app.post('/object', jsonParser, function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");

  let type = req.body.type;
  let position = req.body.position;
  let color = req.body.color;
  let id = req.body.id;

  if (type !== "" && position !== "" && color !== "" && id !== "") {
    // get "objects" (which is an array of objects) to append to that array of objects
    let json = fs.readFileSync("scene.json", 'utf8');
    let scene = JSON.parse(json);
    let objects = scene["objects"];
    objects.push(req.body);

    console.log("Object saved!");
    res.send("Object saved!");

    /*

    fs.appendFile("scene.json", req, function(error) {
      if (error) {
        console.log(error);
        res.send(error);
      }
      console.log("Object saved successfully!");
      res.send("Object saved!");
    });

    */
  }
})

app.post('/view', jsonParser, function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");

  let view = req.body.viewPosition;

  if (view !== "") {
    let json = fs.readFileSync("scene.json", 'utf8');
    let scene = JSON.parse(json);
    let viewPosition = scene["viewPosition"];
    viewPosition = view;

    console.log("Position saved!");
    res.send("Position saved!");
  }

})

app.listen(3000);

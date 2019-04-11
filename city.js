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

app.get('/', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  let allObjects = {};

  // if getting from a file...
  let file = "objects.txt";
  let data = fs.readFileSync(file, 'utf8');

  let objectsFromData = data.split("\n");

  let arrOfObjects = getObjects(objectsFromData.slice(1, objectsFromData.length));
  allObjects["objects"] = arrOfObjects;
  
  allObjects["viewPosition"] = objectsFromData[0];
  res.send(JSON.stringify(allObjects));
})

/* for reciving JSON to parse and format as a string to place into a text file
app.post('/', jsonParser, function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");

})
*/

app.listen(3000);

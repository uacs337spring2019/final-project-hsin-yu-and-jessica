"use strict";
const path = require('path');
const express = require("express");
const app = express();
//socket.io used here to update the VR view immediately after an update to the scene
const io = require("socket.io")();
io.origins("*:*");

const fs = require("fs");

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//Avoiding CORS errors is always fun.
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Create the scene if it doesn't already exist
if (!fs.existsSync(path.join(__dirname, "scene.json"))) {
  fs.writeFileSync(path.join(__dirname, "scene.json"));
}

/*
This sends back the file of scene.json containing all of the objects for the scene and
coordinates for viewPosition.
*/
app.get('/scene', function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");

  res.header("Content-Type", "application/json");

  res.sendFile(path.join(__dirname, "scene.json"));
});

io.on('connection', function (socket) {
  console.log("VR user connected");
});

/*
This receives JSON objects to parse and check to make sure JSON has all of the correct
information necessary to store into scene.json file.
*/
app.post('/object', jsonParser, function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");

  let type = req.body.type;
  let position = req.body.position;
  let color = req.body.color;
  let id = req.body.id;

  if (type !== "" && position !== "" && color !== "" && id !== "") {
    // get "objects" (which is an array of objects) to append json to that array of objects
    let json = fs.readFileSync(__dirname + "/scene.json", 'utf8');
    let scene = JSON.parse(json);
    let scenePos = getScenePosition(scene, id);
    //Update the object if its id is already in the scene
    if (scenePos != -1) {
      scene.objects[scenePos].position = position;
      scene.objects[scenePos].color = color;
      scene.objects[scenePos].type = type;
    }
    //Otherwise, add it to the scene
    else {
      scene.objects.push({
        "type": type,
        "position": position,
        "color": color,
        "id": id
      });
    }

    fs.writeFileSync(__dirname + "/scene.json", JSON.stringify(scene));
    console.log("Object saved!");
    res.send("Object saved!\n");
    io.emit('update', {
      for: 'everyone'
    });
  }
});

/**
 * Returns the index in the scene's objects array of the specified id, -1 if it doesn't exist
 * @param {Scene} scene 
 * @param {String} id 
 */
function getScenePosition(scene, id) {
  let retVal = -1;
  for (let i = 0; i < scene.objects.length; i++) {
    if (scene.objects[i].id === id) {
      retVal = i;
      break;
    }
  }
  return retVal;
}

/*
This receives a JSON object containing the viewPosition. The JSON object received is checked
to make sure it is not emppty and then appended to scene.json under viewPosition.
*/
app.post('/view', jsonParser, function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");

  let view = req.body.viewPosition;

  if (view !== "") {
    let json = fs.readFileSync(__dirname + "/scene.json", 'utf8');
    let scene = JSON.parse(json);
    scene.viewPosition[0] = view[0];
    scene.viewPosition[1] = view[1];

    fs.writeFileSync(__dirname + "/scene.json", JSON.stringify(scene));
    console.log("Position saved!");
    res.send("Position saved!\n");
    io.emit('update', {
      for: 'everyone'
    });
  }
});

//Using express to serve our HTML files.
app.use('/', express.static(__dirname));

//Initiate the app
io.listen(app.listen(process.env.PORT));
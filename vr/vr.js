/* eslint-disable semi */
(function () {
  var AFRAME = require('aframe');
  var socket = require('socket.io-client')("http://localhost:3000");

  socket.on('update', function () {
    getScene();
  });

  window.addEventListener('load', getScene);

  /**
   * Initiates the GET request to get the scene
   */
  function getScene() {
    console.log("getting world");
    fetch("http://localhost:3000/scene")
      .then(checkStatus)
      .then(updateScene);
  }

  /**
   * Updates the scene based on new data. Inserts new objects in if needed, otherwise updates current objects.
   * @param {String} data Data recieved from the server representing the scene
   */
  function updateScene(data) {
    let json = JSON.parse(data);
    document.getElementById("viewer").object3D.position.set(json.viewPosition[0], 2, json.viewPosition[1]);

    if (json.objects.length == 0) {
      document.getElementById("level-buildings").innerHTML = "";
    }

    for (let i = 0; i < json.objects.length; i++) {
      let item = document.getElementById(json.objects[i].id)
      if (item === null) {
        item = newBuilding = document.createElement("a-entity");
        item.id = json.objects[i].id;
        document.getElementById("level-buildings").appendChild(item);
      }

      item.setAttribute('mixin', json.objects[i].type);
      item.object3D.position.set(json.objects[i].position[0], 0, json.objects[i].position[1]);
      item.setAttribute('material', 'color', json.objects[i].color);
    }
  }

  /**
   * Verifies that the response from the server is a good one
   * @param {Response} response A response from the server
   */
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response.text();
    } else {
      return Promise.reject(new Error(response.status + ": " + response.statusText));
    }
  }
})();
/*
  Authors: Jessica Coan and Hsin-Yu Chen
  File: vr.js
  Description: Provides the functionality for a VR city viewing app
*/
(function () {
  "use strict";
  let url = "http://city-builder.herokuapp.com";
  let socket;

  window.addEventListener('load', function() {
    socket = io(url);
    socket.on('update', function () {
      getScene();
    });
    getScene();
  });

  /**
   * Initiates the GET request to get the scene
   */
  function getScene() {
    console.log("getting world");
    fetch(url + "/scene")
      .then(checkStatus)
      .then(updateScene);
  }

  /**
   * Updates the scene based on new data. 
   * Inserts new objects in if needed, otherwise updates current objects.
   * @param {String} data Data recieved from the server representing the scene
   */
  function updateScene(data) {
    let json = JSON.parse(data);
    document.getElementById("viewer").object3D.position.set(json.viewPosition[0], 2, json.viewPosition[1]);

    if (json.objects.length == 0) {
      document.getElementById("level-buildings").innerHTML = "";
    }

    for (let i = 0; i < json.objects.length; i++) {
      let item = document.getElementById(json.objects[i].id);
      if (item === null) {
        item = document.createElement("a-entity");
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
   * @returns {String} the good response
   */
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response.text();
    } else {
      return Promise.reject(new Error(response.status + ": " + response.statusText));
    }
  }
})();
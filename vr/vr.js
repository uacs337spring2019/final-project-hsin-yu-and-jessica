/* eslint-disable semi */
(function () {
  var AFRAME = require('aframe');
  var socket = require('socket.io-client')("http://localhost:3000");

  require('aframe-animation-timeline-component');
  require('aframe-billboard-component');
  require('aframe-event-set-component');
  require('aframe-fps-counter-component');
  require('aframe-look-at-component');
  require('aframe-particle-system-component');
  require('aframe-physics-system');
  require('aframe-physics-extras');
  require('aframe-randomizer-components');
  require('aframe-text-geometry-component');

  socket.on('update', function () {
    getWorld();
  });

  function start() {
    getWorld();
  }

  function getWorld() {
    console.log("getting world");
    fetch("http://localhost:3000/scene")
      .then(checkStatus)
      .then(updateWorld);
  }

  function updateWorld(data) {
     let json = JSON.parse(data);

     for (let i = 0; i < json.objects.length; i++) {
       if (document.getElementById(json.objects[i].id) !== null) {
         continue;
       }

       let newBuilding = document.createElement("a-entity");
       newBuilding.id = json.objects[i].id;
       newBuilding.setAttribute('mixin', json.objects[i].type);
       newBuilding.object3D.position.set(json.objects[i].position[0], 0, json.objects[i].position[1]);
       newBuilding.setAttribute('material', 'color', json.objects[i].color);
       document.getElementById("level").appendChild(newBuilding);
     }

     document.getElementById("viewer").object3D.position = new THREE.Vector3(json.viewPosition[0], 2, json.viewPosition[1]);
  }

  function getRandomInt(min, max) {
    return Math.floor((Math.random() * max) + min);
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

  window.addEventListener('load', start);
})();
/* eslint-disable semi */
(function () {
  var AFRAME = require('aframe');

  require('aframe-animation-component');
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
  require('aframe-gltf-part-component');

  AFRAME.registerComponent('destroy', {
    schema: {
      active: {
        type: 'boolean',
        default: 'false'
      }
    },
    init: function () {

    },
    update: function (oldData) {
      if (!oldData && this.data.active) {
        let time = document.querySelector('a-scene').time;
        this.data.randomDeathTime = getRandomInt(time, time + 120);
      }
    },
    tick: function (time, deltaTime) {
      if (time >= this.data.randomDeathTime) {

      }
    }
  });

  AFRAME.registerComponent('load-children', {
    schema: {
      model: {
        type: 'string',
        defualt: 'null'
      }
    },
    init: function () {
      
    }
  });

  function start () {

  }

  function getRandomInt (min, max) {
    return Math.floor((Math.random() * max) + min);
  }

  window.addEventListener('load', start);
})();
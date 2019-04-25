/**
Author: Jessica Coan and Hsin-Yu Chen

This program helps to make the city-building app interactive with the user
where they can click and drag objects around to build their desired city.
When the user clicks on an object that they want to include, a new HTML
element will appear on the page that they can then drag and drop wherever onto
the page to build their city.
*/

"use strict";

(function() {

  let idNum = 0;
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  let url = "http://city-builder.herokuapp.com/";

  window.onload = function() {
    getCurrScene();

    document.getElementById("ogLB").onclick = createObject;
    document.getElementById("ogMB").onclick = createObject;
    document.getElementById("ogSB").onclick = createObject;
    document.getElementById("ogTree").onclick = createObject;
    document.getElementById("ogBush").onclick = createObject;
    document.getElementById("person").onmousedown = dragging;
  };

  /**
   * This function creates the current scene of the environment based on the
   * get request for a JSON file that contains all of the objects the user
   * had previously placed before. This makes sure that when the user refreshes
   * the environment that the objects they had created before had are still there.
   */
  function getCurrScene() {

    fetch(url + "scene")
    .then(checkStatus)
    .then(function(responseText) {
      let json = JSON.parse(responseText);
      let objects = json["objects"];

      if (objects.length !== 0) {
        for (let o = 0; o < objects.length; o++) {
          placeObj(objects[o]);
        }

        idNum = objects.length;
      }
    })

    .catch(function() {
      console.log("Error");
    });
  }

  /**
   * This function places the objects from a given JSON file into the scene
   * so then when the user refreshes the page, the city that they built before
   * will still be there.
   *
   * @param {json} rawObj - This is a json object containing characters of an object.
   */
  function placeObj(rawObj) {
    let objToPlace = document.createElement("p");

    let type = rawObj["type"];
    let position = rawObj["position"];
    let color = rawObj["color"];
    let id = rawObj["id"];

    objToPlace.id = id;
    objToPlace.classList.add(type);
    objToPlace.classList.add("object");
    objToPlace.style.position = "absolute";
    objToPlace.style.left = position[0] + "px";
    objToPlace.style.top = position[1] + "px";
    objToPlace.style.backgroundColor = color;
    objToPlace.onmousedown = dragging;

    document.getElementById("environment").append(objToPlace);
  }

  /**
   * This function helps to delete the beginning prompt.
   */
  function deletePrompt() {
    document.getElementById("prompt").innerHTML = "";
  }

  /**
   * This function helps to create HTML elements that will represent different
   * objects that the user decides to include in building their desired city.
   */
  function createObject() {
    if (idNum === 0) {
      document.getElementById("prompt").innerHTML = "Drag object to start building!";
      setTimeout(deletePrompt, 5000);
    }

    // create same object as clicked on and pop-up in middle of page
    let newObj = this.cloneNode(true);
    newObj.id = "obj" + idNum;
    newObj.style.position = "absolute";
    newObj.style.left = "50%";
    newObj.style.top = "50%";
    newObj.style.transform = "translate(-50%, -50%)";
    newObj.style.backgroundColor =
            window.getComputedStyle(this, null).getPropertyValue("background-color");
    newObj.onmousedown = dragging;

    document.getElementById("environment").append(newObj);
    idNum++;

    postObject(newObj);
  }

  /**
   * This posts the object that was created as well as the person when object is created.
   *
   * @param {html element} newObj - This is an html element of the current object being placed.
   */
  function postObject(newObj) {
    let type = newObj.classList[0];
    let pos = [];
    pos.push(newObj.offsetLeft);
    pos.push(newObj.offsetTop);
    let color = newObj.style.backgroundColor;
    let id = newObj.id;

    postPerson(document.getElementById("person"));

    // create json object
    const obj = {type: type, position: pos, color: color, id: id};
    const fetchOptions = {
      method: 'POST',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify(obj)
    };

    // send JSON to server and check if received by server successfully
    fetch(url + "object", fetchOptions)
      .then(checkStatus)
      .then(function(responseText) {
        if (responseText === "Object saved!") {
          console.log("Object saved!");
        }
      })

      .catch(function(error) {
        console.log(error);
      });
  }

 /**
   * This function gets the position of the person once they are done being dragged.
   *
   * @param {html element} person - This the html element of the person in the environment.
   */
  function postPerson(person) {
    let posX = person.offsetLeft;
    let posY = person.offsetTop;

    let posXY = [];
    posXY.push(posX, posY);

    const personPos = {viewPosition: posXY};
    const fetchOptions = {
      method: 'POST',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify(personPos)
    };

    // send object to server and check if received by server successfully
    fetch(url + "view", fetchOptions)
      .then(checkStatus)
      .then(function(responseText) {
        if (responseText === "Position saved!") {
          console.log("Position saved!");
        }
      })

      .catch(function(error) {
        console.log(error);
      });
  }

  /**
   * This function allows the user to drag the objects around that they want
   * to include in their city.
   *
   * @param {event} event - This is an event to trigger this function for dragging an html element.
   */
  function dragging(event) {
    let obj = this;
    pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    dragMouseDown(event);

    /**
     * This function captures the position of the mouse to help position
     * the object once it is done being dragged.
     *
     * @param {event} event - This is an event to help drag an html element.
     */
    function dragMouseDown(event) {
      pos3 = event.clientX;
      pos4 = event.clientY;
      document.onmouseup = stopDragging;   // "drop" the object
      document.onmousemove = dragElement;  // object follows mouse's position
    }

    /**
     * This function helps to drag objects around by reassigning the ojbect's
     * position to the mouse position.
     *
     * @param {event} event - This is an event to help drag an html element.
     */
    function dragElement(event) {
      pos1 = pos3 - event.clientX;
      pos2 = pos4 - event.clientY;
      pos3 = event.clientX;
      pos4 = event.clientY;
      // reset object's position to mouse's position
      obj.style.top = (obj.offsetTop - pos2) + "px";
      obj.style.left = (obj.offsetLeft - pos1) + "px";
    }

    /**
     * This function forces the object to stop following the mouse once the
     * mouse is not clicking down on the object anymore.
     *
     * @param {event} event - This is an event to help stop dragging an html element.
     */
    function stopDragging() {
      document.onmouseup = null;
      document.onmousemove = null;

      // executes appropriate post request depending on element being dragged
      if (obj.id === "person") {
        postPerson(obj);
      }
      else if (obj.classList.length > 1) {
        postObject(obj);
      }
    }
  }

  /**
   * This checks the status of the requests to the server and prints out any
   * appropriate error messages.
   *
   * @param {response} response - This is a response text from a server request.
   * @returns {Promise} return a promise message
   */
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response.text();
    // special reject message for page not found
    } else if(response.status === 404) {
      return Promise.reject(new Error("Sorry we do not have any data"));
    } else {
      return Promise.reject(new Error(response.status + ": " + response.statusText));
    }
  }

})();

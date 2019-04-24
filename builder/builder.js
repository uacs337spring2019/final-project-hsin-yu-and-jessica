/**
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
  let shown = false;

  window.onload = function() {
    document.getElementById("ogLB").onclick = createObject;
    document.getElementById("ogMB").onclick = createObject;
    document.getElementById("ogSB").onclick = createObject;
    document.getElementById("ogTree").onclick = createObject;
    document.getElementById("ogBush").onclick = createObject;
  };

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
    console.log(this.classList[0]);
    if (shown === false) {
      document.getElementById("prompt").innerHTML = "Drag object to start building!";
      setTimeout(deletePrompt, 5000);
      shown = true;
    }

    // create same object as clicked on and pop-up in middle of page
    let newObj = this.cloneNode(true);
    newObj.id = "obj" + idNum;
    newObj.style.position = "absolute";
    newObj.style.left = "50%";
    newObj.style.top = "50%";
    newObj.style.transform = "translate(-50%, -50%)";
    newObj.onmousedown = dragging;

    document.getElementById("environment").append(newObj);
    idNum++;
  }

  /**
   * This function allows the user to drag the objects around that they want
   * to include in their city.
   */
  function dragging(event) {
    let obj = this;
    pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    dragMouseDown(event);

    /**
     * This function captures the position of the mouse to help position
     * the object once it is done being dragged.
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
     */
    function stopDragging() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

})();

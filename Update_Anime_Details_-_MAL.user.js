// ==UserScript==
// @name         Update Anime Details - MAL
// @namespace    https://openuserjs.org/users/shaggyze/
// @updateURL    https://openuserjs.org/install/shaggyze/Update_Anime_Details_-_MAL.meta.js
// @version      0.3
// @description  Click update in Edit Details of Anime/Manga then Submit and Close tab.
// @author       ShaggyZE
// @match        https://myanimelist.net/ownlist/*/*/edit
// @icon         https://dl.dropboxusercontent.com/s/yics96pcxixujd1/MAL.png
// @run-at       document-begin
// @grant        window.close
// @license      MIT; https://opensource.org/licenses/MIT
// ==/UserScript==

(function() {
  'use strict';
  var Close = setTimeout(function() { //Starts the settimeout function
    if (document.body.innerText.search("Successfully") > -1) //If the text "Successfully" is found on the script page
    { //Starts the if condition
      window.top.close(); //Close the actual tab
    } //Finishes the if condition
    else { //Starts the if condition
      document.querySelector("#top-submit-buttons > input").click(); //Click Submit
    } //Finishes the else condition
  }, 3000); //Run the script after 3 secs

  document.querySelector("#main-form > table.advanced > tbody > tr:nth-child(1) > td:nth-child(1) > a").click() //Click update link

  document.body.insertAdjacentHTML('beforeend', '<div id="Close" style="width: 100vw; height: 100vh; z-index: 2147483647; background: rgb(0 0 0 / 86%); position: fixed; top: 0px; font-size: 40px; color: white;"><center>You\'ve 3 secs to click Anywhere if you don\'t want the page to auto update/close</center></div>'); //Show an option to the user

  document.querySelector("#Close").onclick = function() { //If anywhere is clicked
    clearTimeout(Close); //Stop the auto Updating/Closing process
    document.querySelector("#Close").style.display = 'none'; //Hide the option
  } //Stop the Closing process if the user clicks anywhere
})();
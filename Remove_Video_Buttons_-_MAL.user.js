// ==UserScript==
// @name         Remove Video Buttons - MAL
// @namespace    https://openuserjs.org/users/shaggyze/scripts
// @updateURL    https://openuserjs.org/meta/shaggyze/Remove_Video_Buttons_-_MAL.meta.js
// @downloadURL  https://openuserjs.org/install/shaggyze/Remove_Video_Buttons_-_MAL.user.js
// @copyright    2022, shaggyze (https://openuserjs.org/users/shaggyze)
// @version      1.0
// @description  Remove Video Buttons on MAL
// @author       ShaggyZE
// @match        https://myanimelist.net/*
// @icon         https://shaggyze.website/MAL.png
// @run-at       document-end
// @grant        none
// @license      MIT; https://opensource.org/licenses/MIT
// ==/UserScript==

(function() {
    'use strict';
     document.querySelectorAll(`div.oped-video-button,i[class*="malicon-movie-episode"],i[class*="malicon-movie-pv"],i[class*="malicon-streaming"]`).forEach(a => a.parentNode.remove()); //Remove all video buttons
    window.onscroll = async function() { //Creates a new function to run when the page is scrolled
		document.querySelectorAll(`div[class*="oped-preview-button"]`).forEach(a => a.parentNode.style.display = 'block'); //Show all audio buttons
    }; //Finishes the onscroll event listener
})();
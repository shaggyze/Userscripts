// ==UserScript==
// @name         Remove Video Buttons - MAL
// @namespace    https://openuserjs.org/users/shaggyze/scripts
// @updateURL    https://openuserjs.org/meta/shaggyze/Remove_Video_Buttons_-_MAL.meta.js
// @downloadURL  https://openuserjs.org/install/shaggyze/Remove_Video_Buttons_-_MAL.user.js
// @copyright    2022, shaggyze (https://openuserjs.org/users/shaggyze)
// @version      0.7
// @description  Remove Video Buttons on MAL
// @author       ShaggyZE
// @match        *://myanimelist.net/*
// @icon         https://dl.dropboxusercontent.com/s/yics96pcxixujd1/MAL.png
// @run-at       document-end
// @grant        none
// @license      MIT; https://opensource.org/licenses/MIT
// ==/UserScript==

(function() {
    'use strict';

        document.querySelectorAll("div.oped-video-button").forEach(a => a.parentNode.remove()); //Remove all video buttons
        document.querySelectorAll('div[class*="oped-preview-button"]').forEach(a => a.parentNode.remove());
        document.querySelectorAll('i[class*="malicon"]').forEach(a => a.parentNode.remove());
})();
// ==UserScript==
// @name         Remove Video Buttons - MAL
// @namespace   https://openuserjs.org/meta/shaggyze/
// @updateURL   https://openuserjs.org/meta/shaggyze/Remove%20Video%20Buttons%20-%20MAL.js
// @downloadURL https://openuserjs.org/meta/shaggyze/Remove%20Video%20Buttons%20-%20MAL.js
// @version      0.2
// @description  Remove Video Buttons on MAL
// @author       ShaggyZE
// @match        https://myanimelist.net/*
// @icon         https://www.google.com/s2/favicons?domain=myanimelist.net
// @run-at       document-end
// @grant        none
// @license      MIT License
// ==/UserScript==

(function() {
    'use strict';

        document.querySelectorAll("div.oped-video-button").forEach(a => a.parentNode.remove()); //Remove all video buttons
        document.querySelectorAll('div[class*="oped-preview-button"]').forEach(a => a.parentNode.remove());
        document.querySelectorAll('i[class*="malicon"]').forEach(a => a.parentNode.remove());
})();
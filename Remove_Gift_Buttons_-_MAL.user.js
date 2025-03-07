// ==UserScript==
// @name         Remove Gift Buttons - MAL
// @namespace    https://openuserjs.org/users/shaggyze/scripts
// @updateURL    https://openuserjs.org/meta/shaggyze/Remove_Gift_Buttons_-_MAL.meta.js
// @downloadURL  https://openuserjs.org/install/shaggyze/Remove_Gift_Buttons_-_MAL.user.js
// @copyright    2022, shaggyze (https://openuserjs.org/users/shaggyze)
// @version      0.4
// @description  Remove Gift Buttons on MAL
// @author       ShaggyZE
// @match        *://myanimelist.net/*
// @exclude      *://myanimelist.net/account/membership/*
// @icon         https://shaggyze.website/MAL.png
// @run-at       document-begin
// @grant        none
// @license      MIT; https://opensource.org/licenses/MIT
// ==/UserScript==

(function() {
    'use strict';
        document.querySelectorAll('div[class*="gift"]').forEach(a => a.remove()); //Remove all gift buttons
        document.querySelectorAll('a[class*="gift"]').forEach(a => a.remove());
        document.querySelectorAll('a[class*="icon-gift"]').forEach(a => a.remove());
        document.querySelectorAll('button[class*="gift"]').forEach(a => a.remove());
})();
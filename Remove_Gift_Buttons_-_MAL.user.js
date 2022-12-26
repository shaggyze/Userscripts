// ==UserScript==
// @name         Remove Gift Buttons - MAL
// @namespace    https://openuserjs.org/users/shaggyze/scripts
// @updateURL    https://openuserjs.org/meta/shaggyze/Remove_Gift_Buttons_-_MAL.meta.js
// @downloadURL  https://openuserjs.org/install/shaggyze/Remove_Gift_Buttons_-_MAL.user.js
// @copyright    2022, shaggyze (https://openuserjs.org/users/shaggyze)
// @version      0.1
// @description  Remove Gift Buttons on MAL
// @author       ShaggyZE
// @match        *://myanimelist.net/*
// @icon         https://dl.dropboxusercontent.com/s/yics96pcxixujd1/MAL.png
// @run-at       document-begin
// @grant        none
// @license      MIT; https://opensource.org/licenses/MIT
// ==/UserScript==

(function() {
    'use strict';

        document.querySelectorAll('a[class*="gift"]').forEach(a => a.remove()); //Remove all gift buttons
        document.querySelectorAll('a[class*="icon-gift"]').forEach(a => a.remove());
})();
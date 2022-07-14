// ==UserScript==
// @name         Remove Topics Under Threads - MAL
// @namespace    https://openuserjs.org/users/shaggyze/scripts
// @updateURL    https://openuserjs.org/meta/shaggyze/Remove_Topics_Under_Threads_-_MAL.meta.js
// @downloadURL  https://openuserjs.org/install/shaggyze/Remove_Topics_Under_Threads_-_MAL.user.js
// @copyright    2022, shaggyze (https://openuserjs.org/users/shaggyze)
// @version      0.1
// @description  Remove Topics Under Threads on MAL
// @author       ShaggyZE
// @match        https://myanimelist.net/*
// @icon         https://dl.dropboxusercontent.com/s/yics96pcxixujd1/MAL.png
// @run-at       document-end
// @grant        none
// @license      MIT; https://opensource.org/licenses/MIT
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll('table[class*="forum-topics"]').forEach(a => a.remove()); //Remove all forum-topics tables
    document.querySelectorAll('div[class*="border_solid mt24"]').forEach(a => a.remove()); //Remove all border_solid mt24 divs
})();
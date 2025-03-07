// ==UserScript==
// @name         Move Pinned in Seasonal Anime - MAL
// @namespace    https://openuserjs.org/users/shaggyze/scripts
// @updateURL    https://openuserjs.org/meta/shaggyze/Move_Pinned_in_Seasonal_Anime_-_MAL.meta.js
// @downloadURL  https://openuserjs.org/install/shaggyze/Move_Pinned_in_Seasonal_Anime_-_MAL.user.js
// @copyright    2022, shaggyze (https://openuserjs.org/users/shaggyze)
// @version      0.2
// @description  Move Pinned in Seasonal Anime
// @author       ShaggyZE
// @match        https://myanimelist.net/anime/season*
// @icon         https://shaggyze.website/MAL.png
// @run-at       document-end
// @license      MIT; https://opensource.org/licenses/MIT
// ==/UserScript==

(function() {
    'use strict';

        [...document.querySelectorAll("div.seasonal-anime")].filter(a => a.innerHTML.match("pin-icon")).forEach(async function(el) { el.parentNode.insertAdjacentHTML('beforeEnd', el.outerHTML); el.remove(); }); // Move seasonal divs matching "pin-icon" to end.
})();
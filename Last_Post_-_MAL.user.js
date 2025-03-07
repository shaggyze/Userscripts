// ==UserScript==
// @name        Last Post - MAL
// @namespace   https://openuserjs.org/users/shaggyze/scripts
// @updateURL   https://openuserjs.org/meta/shaggyze/Last_Post_-_MAL.meta.js
// @downloadURL https://openuserjs.org/install/shaggyze/Last_Post_-_MAL.user.js
// @copyright   2022, shaggyze (https://openuserjs.org/users/shaggyze)
// @version     2.1
// @description Add Last Post link to MAL Forum Topics and Notifications.
// @author      ShaggyZE & hacker09
// @match       *://myanimelist.net/*
// @icon        https://shaggyze.website/MAL.png
// @run-at      document-end
// @license     MIT; https://opensource.org/licenses/MIT
// ==/UserScript==
var TimesExecuted;
(function() {
    'use strict';

    var href=location.href;
    if (href.match('forummessage') !==null) {
        let topicid=href.split('=', 5);
        document.querySelector("div.goodresult").insertAdjacentHTML('beforeEnd', `<br><br><a style="cursor: pointer;" href=https://myanimelist.net/forum/?topicid=` + topicid[4] + `&goto=lastpost>Last Post »»</a>`); //Add the Last Post link on Report page.
    }
    else if (href.match(/topicid/) !==null) {
        href=href.replace(/\#.*/, '');
        document.querySelector("div.mal-btn-toolbar").insertAdjacentHTML('beforeEnd', `<button class="mal-btn small secondary outline noborder" onclick="window.scrollTo(0, document.body.scrollHeight);"><i class="fa-solid fa-fw fa-arrow-down mr4"></i>Bottom</button>`); //Add the Bottom button before first post of current page.
        document.querySelector("div.pages").insertAdjacentHTML('beforeEnd', `&nbsp;<a style="cursor: pointer;" href="` + href + `&goto=lastpost">Last Post »»</a>`); //Add the Last Post link before first post of current page.
        document.querySelector("#contentWrapper").insertAdjacentHTML('beforeEnd', `<br><a style="float: right; cursor: pointer;" href="` + href + `&goto=lastpost">Last Post »»</a>`); //Add the Last Post link after last post of current page.
    }
    document.querySelector("div.header-menu-unit.header-notification").onmouseover=function() {
        if (TimesExecuted==undefined) {
            document.querySelectorAll("ol.header-notification-item-list > li > div > div:nth-child(2) > span > a:nth-child(2)").forEach(function(el) {
                if (el.href.match(/topicid/) !==null) {
                    el.insertAdjacentHTML('afterEnd', `&nbsp;<a style="cursor: pointer;" href="` + el.href + `&goto=lastpost">Last Post »»</a>`); //Add the Last Post to notifications.
                }
                TimesExecuted +=1;
            }
            )
        }
    }
}
)();
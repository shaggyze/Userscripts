// ==UserScript==
// @name        Last Post - MAL
// @namespace   https://openuserjs.org/users/shaggyze/scripts
// @updateURL   https://openuserjs.org/meta/shaggyze/Last_Post_-_MAL.meta.js
// @downloadURL https://openuserjs.org/install/shaggyze/Last_Post_-_MAL.user.js
// @copyright   2022, shaggyze (https://openuserjs.org/users/shaggyze)
// @version     1.3
// @description Add Last Post link to MAL Forum Topics.
// @author      ShaggyZE & hacker09
// @match      *://myanimelist.net/*
// @icon        https://dl.dropboxusercontent.com/s/yics96pcxixujd1/MAL.png
// @run-at      document-end
// @license     MIT; https://opensource.org/licenses/MIT
// ==/UserScript==
var TimesExecuted;
(function() {
  'use strict';
  var href = location.href;
  if (href.match(/topicid/) !== null) {
    href = href.replace(/\#.*/,'');
    document.querySelector("div.mt4.mb4.pl0.pb0.pt4.pb4 > div").insertAdjacentHTML('beforeEnd', `&nbsp;<a style="cursor: pointer;" href="` + href + `&goto=lastpost">Last Post »»</a>`); //Add the Last Post link before first post of current page.
    document.querySelector("#quickReply").insertAdjacentHTML('beforeBegin', `<br><a style="cursor: pointer;" href="` + href + `&goto=lastpost">Last Post »»</a>`); //Add the Last Post link after last post of current page.
    document.querySelector("div.mt4.mb4.pl0.pb0.pt4.pb4").insertAdjacentHTML('beforeEnd', `<a style="cursor: pointer;" onclick='[...document.querySelectorAll("div.forum-topic-message-wrapper")].pop().scrollIntoView()'>Bottom</a>`); //Add the Bottom link before first post of current page.
  }
  document.querySelector("div.header-menu-unit.header-notification").onmouseover = function() {
  if (TimesExecuted == undefined) {
    document.querySelectorAll("ol.header-notification-item-list > li > div > div:nth-child(2) > span > a:nth-child(2)").forEach(function(el){
    if (el.href.match(/topicid/) !== null) {
      el.insertAdjacentHTML('beforeEnd', `&nbsp;<a style="cursor: pointer;" href="` + el.href + `&goto=lastpost">Last Post »»</a>`); //
    }
    TimesExecuted += 1;;
    })
  }}
})();

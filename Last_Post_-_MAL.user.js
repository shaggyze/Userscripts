// ==UserScript==
// @name        Last Post - MAL
// @namespace   https://openuserjs.org/users/shaggyze/
// @updateURL   https://openuserjs.org/install/shaggyze/Last_Post_-_MAL.meta.js
// @version     0.8
// @description Add Last Post link to MAL Forum Topics.
// @author      ShaggyZE & hacker09
// @include      *://myanimelist.net/*
// @icon        https://www.google.com/s2/favicons?domain=myanimelist.net
// @run-at      document-end
// @license      MIT; https://opensource.org/licenses/MIT
// ==/UserScript==
var TimesExecuted;
(function() {
  'use strict';
  var href = location.href;
  if (href.match(/topicid/) !== null) {
    href = href.replace(/\#.*/,'');
    document.querySelector("div.mt4.mb4.pl0.pb0.pt4.pb4 > div").insertAdjacentHTML('beforeEnd', `&nbsp;<a style="cursor: pointer;" href="` + href + `&goto=lastpost">Last Post »»</a>`); //Add the Last Post link before first post of current page.
    document.querySelector("#content").insertAdjacentHTML('beforeEnd', `&nbsp;<a style="cursor: pointer;float: right;" href="` + href + `&goto=lastpost">Last Post »»</a>`); //Add the Last Post link before first post of current page.
    document.querySelector("div.mt4.mb4.pl0.pb0.pt4.pb4").insertAdjacentHTML('beforeEnd', `<a style="cursor: pointer;" onclick='[...document.querySelectorAll("div.forum-topic-message-wrapper")].pop().scrollIntoView()'>Bottom</a>`); //Add the  link before first post of current page.
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

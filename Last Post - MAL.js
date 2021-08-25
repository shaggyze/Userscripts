// ==UserScript==
// @name        Last Post - MAL
// @namespace   Last_Post
// @version     0.2
// @description Add Last Post link to MAL Forum Topics.
// @author      ShaggyZE & hacker09
// @include      *://myanimelist.net/forum/?topicid=*
// @icon        https://www.google.com/s2/favicons?domain=myanimelist.net
// @run-at      document-end
// ==/UserScript==

(function() {
  'use strict';
  if (location.href.match(/msg/) == null) {
    document.querySelector("div.mt4.mb4.pl0.pb0.pt4.pb4").insertAdjacentHTML('beforeEnd', `<a style="cursor: pointer;float: right;" href="` + location.href + `&goto=lastpost">Last Post »»</a>`); //Add the Last Post link before first post of current page.
  } else {
    document.querySelector("div.mt4.mb4.pl0.pb0.pt4.pb4").insertAdjacentHTML('beforeEnd', `<a style="cursor: pointer;float: right;" onclick='[...document.querySelectorAll("div.forum-topic-message-wrapper")].pop().scrollIntoView()'>Last Post »»</a>`); //Add the Last Post link before first post of current page.
  }
})();

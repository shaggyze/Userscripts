// ==UserScript==
// @name        Last Post - MAL
// @namespace   Last_Post
// @version     0.5
// @description Add Last Post link to MAL Forum Topics.
// @author      ShaggyZE & hacker09
// @include      *://myanimelist.net/forum/?topicid=*
// @icon        https://www.google.com/s2/favicons?domain=myanimelist.net
// @run-at      document-end
// ==/UserScript==

(function() {
  'use strict';
  var href = location.href;
  href = href.replace(/\#.*/,'');
  document.querySelector("div.mt4.mb4.pl0.pb0.pt4.pb4 > div").insertAdjacentHTML('beforeEnd', `&nbsp;<a style="cursor: pointer;float: right;" href="` + href + `&goto=lastpost">Last Post »»</a>`); //Add the Last Post link before first post of current page.
  document.querySelector("#content").insertAdjacentHTML('beforeEnd', `&nbsp;<a style="cursor: pointer;float: right;" href="` + href + `&goto=lastpost">Last Post »»</a>`); //Add the Last Post link before first post of current page.
  document.querySelector("div.mt4.mb4.pl0.pb0.pt4.pb4").insertAdjacentHTML('beforeEnd', `<a style="cursor: pointer;" onclick='[...document.querySelectorAll("div.forum-topic-message-wrapper")].pop().scrollIntoView()'>Bottom</a>`); //Add the  link before first post of current page.
})();
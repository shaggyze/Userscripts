// ==UserScript==
// @name        Large Image with Info on Hover - MAL
// @namespace   https://openuserjs.org/users/shaggyze/scripts
// @updateURL   https://openuserjs.org/meta/shaggyze/Large_Image_with_Info_on_Hover_-_MAL.meta.js
// @downloadURL https://openuserjs.org/install/shaggyze/Large_Image_with_Info_on_Hover_-_MAL.user.js
// @copyright   2025, shaggyze (https://openuserjs.org/users/shaggyze)
// @version     1.7.5
// @description Large image with info on Hover.
// @author      ShaggyZE
// @include     *
// @icon        https://shaggyze.website/MAL.png
// @run-at      document-end
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @connect     shaggyze.website
// @license     MIT; https://opensource.org/licenses/MIT
// ==/UserScript==

/* jshint esversion: 11 */

(function () {
  'use strict';

  const largeFactor = 5.5; // multiplies largeImage size.
  const truncateSynopsis = 200; // synopsis character limit.
  let showmoreImages = Boolean(GM_getValue("showmoreImages", false)); // shows more common/ui images not just anime/manga.
  let debug = false; // shows debug info in console F12, force showinfoDiv = true.
  let onlyMALsite = Boolean(GM_getValue("onlyMALsite", true)); // if true it only works on MAL's website.
  let showinfoDiv = Boolean(GM_getValue("showinfoDiv", true)); // if true will show anime/manga info from api.
  let followMouse = Boolean(GM_getValue("followMouse", false)); // if true largeImage and infoDiv follow mouse..
  let apiJSONUrl = false; // if false it's slower, but more accurate.
  const excludedUrls = /^(https?:\/\/)?myanimelist\.net\/(anime|manga)(?!\/(season|adapted|genre|.*\/userrecs|.*\/stacks|.*\/pics)(?:\/|$))(?:\/.*)?$/;
  let apiUrl = null;
  let largeImage = null;
  let infoDiv = null;
  let imageUrl = null;
  let id = null;
  let type = null;
  let allData = null;
  let otherData = null;
  const usernameMatch = location.pathname.match(/\/animelist\/([^\/]+)|\/mangalist\/([^\/]+)/);
  const username = usernameMatch[1] || usernameMatch[2];

  GM_registerMenuCommand(`${onlyMALsite ? "Disable" : "Enable"} Only MAL Site`, function() { GM_setValue("onlyMALsite", !onlyMALsite); location.reload(); });

  if ((onlyMALsite === true & !location.href.includes("myanimelist.net")) || (excludedUrls.test(location.href))) {
    console.log("Large image with info on Hover Script excluded on this page.");
    return;
  }
  if (debug) showinfoDiv = true;
  GM_registerMenuCommand(`${showmoreImages ? "Disable" : "Enable"} Show More Images`, function() { GM_setValue("showmoreImages", !showmoreImages); location.reload(); });
  GM_registerMenuCommand(`${followMouse ? "Disable" : "Enable"} Follow Mouse`, function() { GM_setValue("followMouse", !followMouse); location.reload(); });
  GM_registerMenuCommand(`${showinfoDiv ? "Disable" : "Enable"} Show Info Div`, function() { GM_setValue("showinfoDiv", !showinfoDiv); location.reload(); });

    function getBlacklist() {
        return JSON.parse(GM_getValue("blacklist", "[]"));
    }

    function saveBlacklist(blacklist) {
        GM_setValue("blacklist", JSON.stringify(blacklist));
    }

    function isBlacklisted(username) {
        return getBlacklist().includes(username);
    }

    function toggleBlacklist(username) {
        let blacklist = getBlacklist();
        if (isBlacklisted(username)) {
            blacklist = blacklist.filter(u => u !== username);
        } else {
            blacklist.push(username);
        }
        saveBlacklist(blacklist);
    }

    function addBlacklistLink() {
        const headerInfo = document.querySelector(".btn-menu");
        if (!headerInfo) return;

        const link = document.createElement("a");
        link.style.color = "black";
        link.style.marginLeft = "10px";
        link.textContent = isBlacklisted(username) ? "UnBlacklist Hover Image" : "Blacklist Hover Image";
        link.href = "#";

        link.addEventListener("click", function (event) {
            event.preventDefault();
            toggleBlacklist(username);
            link.textContent = isBlacklisted(username) ? "UnBlacklist Hover Image" : "Blacklist Hover Image";
            location.reload();
        });

        headerInfo.appendChild(link);
    }

    addBlacklistLink();

  function createlargeImage() {
    largeImage = document.createElement('img');
    if (followMouse === false) {
      largeImage.style.position = 'fixed';
      largeImage.style.top = '10px';
      largeImage.style.left = '10px';
    } else {
      largeImage.style.position = 'absolute';
      largeImage.style.pointerEvents = 'none';
    }
    largeImage.style.maxWidth = '75%';
    largeImage.style.maxHeight = '75%';
    largeImage.style.zIndex = '9999';
    largeImage.style.border = '0';
    largeImage.alt = '*';
        largeImage.src = imageUrl;
    document.body.appendChild(largeImage);

    if (followMouse === true) {
      document.addEventListener('mousemove', function (event) {
      if (largeImage.style.display === 'block') {
        largeImage.style.top = event.clientY + window.scrollY + 10 + 'px';
        largeImage.style.left = event.clientX + window.scrollX + 10 + 'px';
      }
      });
    }
  }

  function createinfoDiv() {
    infoDiv = document.createElement('div');
    if (followMouse === false) {
      infoDiv.style.position = 'fixed';
    } else {
      infoDiv.style.position = 'absolute';
      infoDiv.style.pointerEvents = 'none';
    }
    infoDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    infoDiv.style.color = 'white';
    infoDiv.style.textAlign = 'left';
    infoDiv.style.padding = '10px';
    infoDiv.style.maxWidth = '400px';
    infoDiv.style.zIndex = '9999';
    infoDiv.style.display = 'none';
    document.body.appendChild(infoDiv);
    if (followMouse === true) {
      if (infoDiv.style.display === 'block') {
        infoDiv.style.top = event.clientY + window.scrollY + 10 + 'px';
        infoDiv.style.left = event.clientX + window.scrollX + (40 * largeFactor) + 20 + 'px';
      }
    }
  }

  function closePopup() {
    if (largeImage) {
      largeImage.style.display = 'none';
      largeImage.src = "";
    }
    if (infoDiv) {
      infoDiv.style.display = 'none';
      infoDiv.innerHTML = "";
    }
  }

  function parseApi(id, type) {
    if (apiJSONUrl) {
      let subDirectory = Math.floor(id / 10000);
      apiUrl = `https://shaggyze.website/info/${type}/${subDirectory}/${id}.json`;
    }
    else {
      apiUrl = `https://shaggyze.website/msa/info?t=${type}&id=${id}`;
    }
    infoDiv.innerHTML = "Loading...";
    if (showinfoDiv) infoDiv.style.display = 'block';

    GM_xmlhttpRequest({
      method: 'GET',
      url: apiUrl,
      onload: function (response) {
        if (response.status === 200) {
          try {
            let api = JSON.parse(response.responseText);

            let synopsis = api.data.synopsis || "No synopsis available.";
            synopsis = synopsis.length > truncateSynopsis ? synopsis.substring(0, truncateSynopsis) + "..." : synopsis;

            let studios = api.data.studios;
            let studioNames = "Unknown";

            let serializations = api.data.serialization;
            let serializationNames = "Unknown";

            if ((studios && studios.length > 0) || (serializations && serializations.length > 0)) {
              if (type == 'anime') {
                studioNames = studios.map(studio => studio.name).join(", ");
              }
              else {
                serializationNames = serializations.map(serialization => serialization.name).join(", ");
              }
            }
            else if ((studios && studios.name) || (serializations && serializations.name)) {
              if (type == 'anime') {
                studioNames = studios.name;
              }
              else {
                serializationNames = serializations.name;
              }
            }

            allData = `
                    <div><b>Title:</b> ${api.data.title || "Unknown"}</div>
                    <div><b>English:</b> ${api.data.title_english || "Unknown"}</div>
                    <div><b>Score:</b> ${api.data.score || "Unknown"}</div>
                    `;
            if (type == 'anime') {
              otherData = `
                        <div><b>Broadcast:</b> ${api.data.broadcast || "Unknown"}</div>
                        <div><b>Episodes:</b> ${api.data.episodes || "Unknown"}</div>
                        <div><b>Studios:</b> ${studioNames}</div>
                        <div><b>Premiered:</b> ${api.data.premiered || "Unknown"}</div>
                        <div><b>Aired:</b> ${api.data.aired.start || "Unknown"} to ${api.data.aired.end || "Unknown"}</div>
                                                `;
            }
            else {
              otherData = `
                        <div><b>Volumes:</b> ${api.data.volumes || "Unknown"}</div>
                        <div><b>Chapters:</b> ${api.data.chapters || "Unknown"}</div>
                        <div><b>Serialization:</b> ${serializationNames}</div>
                        <div><b>Published:</b> ${api.data.published.start || "Unknown"} to ${api.data.published.end || "Unknown"}</div>
                        `;
            }
            if (isBlacklisted(username)) {
              console.log(`User ${username} is blacklisted. Large image script disabled.`);
            } else {
              if (imageUrl == 'https://shaggyze.website/images/anime/transparent.png') largeImage.src = `${api.data.cover}`;
            }
            largeImage.style.display = 'block';
            infoDiv.innerHTML = `${allData}<br><div><b>Type:</b> ${api.data.type || "Unknown"}</div>${otherData}<br>${synopsis}`;
            if (showinfoDiv) infoDiv.style.display = 'block';
            if (debug) console.log(`Successfully retrieved info for ${type} ID: ${id}`, api);
          }
          catch (error) {
            if (debug) console.error("Error parsing JSON response:", error, response.responseText);
            if (debug) infoDiv.innerHTML = `Error parsing JSON. (ID: ${id}, Type: ${type})`;
            if (debug & showinfoDiv) infoDiv.style.display = 'block';
          }
        }
        else {
          if (apiJSONUrl === true) {
            apiJSONUrl = false;
          };
          if (debug) console.error(`Error loading info for ${type} ID: ${id}. Status: ${response.status} apiUrl: ${apiUrl}`, response);
          if (debug) infoDiv.innerHTML = `Error loading info. Status: ${response.status} (ID: ${id}, Type: ${type})`;
          if (debug & showinfoDiv) infoDiv.style.display = 'block';
        }
      },
      onerror: function (error) {
        if (debug) console.error(`Error loading info:`, error);
        if (debug) infoDiv.innerHTML = "Error loading info.";
        if (debug & showinfoDiv) infoDiv.style.display = 'block';
      }
    });
  }

  function parseJson() {
    apiUrl = `https://shaggyze.website/info/reversecover.json`;
    GM_xmlhttpRequest({
      method: 'GET',
      url: apiUrl,
      onload: function (response) {
        if (response.status === 200) {
          try {
            let api = JSON.parse(response.responseText);
            id = api[imageUrl]?.id || null;
            type = api[imageUrl]?.type || null;
            if (debug) console.log(`loading info for ${type} ID: ${id}. Status: ${response.status} apiUrl: ${apiUrl}`, response);
            if (id) parseApi(id, type);
          }
          catch (error) {
            if (debug) console.error("Error parsing JSON response:", error, response.responseText);
            if (debug) infoDiv.innerHTML = `Error parsing JSON. (ID: ${id}, Type: ${type})`;
            if (debug & showinfoDiv) infoDiv.style.display = 'block';
          }
        }
        else {
          if (apiJSONUrl === true) {
            apiJSONUrl = false;
          };
          if (debug) console.error(`Error loading info for ${type} ID: ${id}. Status: ${response.status} apiUrl: ${apiUrl}`, response);
          if (debug) infoDiv.innerHTML = `Error loading info. Status: ${response.status} (ID: ${id}, Type: ${type})`;
          if (debug & showinfoDiv) infoDiv.style.display = 'block';
        }
      },
      onerror: function (error) {
        if (debug) console.error(`Error loading info:`, error);
        if (debug) infoDiv.innerHTML = "Error loading info.";
        if (debug & showinfoDiv) infoDiv.style.display = 'block';
      }
    });
  }

  document.addEventListener('mouseover', function (event) {
    const target = event.target;
    closePopup();
    if (target.tagName === 'IMG' || target.tagName === 'A' || target.tagName === 'EM' || target.tagName === 'SPAN' || target.tagName === 'TBODY' || target.tagName === 'DIV' || target.tagName === 'B' || target.tagName === 'I' || target.tagName === 'STRONG') {
      let imageElement = target.closest('IMG');
      if (isBlacklisted(username)) {
        console.log(`User ${username} is blacklisted. Large image script disabled.`);
      } else {

        imageUrl = imageElement?.src || target?.getAttribute('data.src') || target?.getAttribute('data-bg');
      }
      if (debug) console.log('1 ' + imageUrl);
      if (!imageUrl) imageUrl = 'https://shaggyze.website/images/anime/transparent.png';
      if (debug) console.log('2 ' + imageUrl);
      imageUrl = imageUrl.replace(/\/r\/\d+x\d+\//, '/');
      if (imageUrl.includes("/images/anime/") || imageUrl.includes("/images/manga/")) imageUrl = imageUrl.replace(/(t|l)\.(jpg|webp)|(\.(jpg|webp))/g, "l.jpg").replace(/\?s=.*$/, '');
      if (!largeImage) createlargeImage();
      if (debug) console.log('3 ' + imageUrl);
      const img = new Image();
      img.onload = function () {

        if (showmoreImages === true) {
          if (!imageUrl.includes("myanimelist.net/images/") && !imageUrl.includes("shaggyze.website/images/") && !imageUrl.includes("myanimelist.net/s/common/") && !imageUrl.includes("myanimelist.net/ui/")) return;
        }
        else {
          if (!imageUrl.includes("/images/anime/") && !imageUrl.includes("/images/manga/")) return;
        }
        largeImage.width = 40 * largeFactor;
        largeImage.height = 60 * largeFactor;
        if (isBlacklisted(username)) {
          console.log(`User ${username} is blacklisted. Large image script disabled.`);
        } else {
          largeImage.src = imageUrl;
        }
        largeImage.style.display = 'block';

        if (!infoDiv) createinfoDiv();
        if (debug) console.log('4 ' + imageUrl);

        const rect = largeImage.getBoundingClientRect();
        infoDiv.style.top = rect.top + 'px';
        infoDiv.style.left = rect.left + rect.width + 10 + 'px';

        let anchor = target.closest('a');
        if (anchor && anchor.href) {
          if (debug) console.log('5 ' + anchor.href);
          let href = anchor.href;
          let match = href.match(/https?:\/\/myanimelist\.net\/(anime|manga)\/(\d+)(?:\/|$)/);
          type = match ? match[1] : null;
          id = match ? match[2] : null;

          if (id) {
            parseApi(id, type);
          }
          else {
            if (debug) console.error(`Could not extract ID from href:`, href);
            if (debug) infoDiv.innerHTML = "Could not extract ID from URL.";
            if (debug & showinfoDiv) infoDiv.style.display = 'block';
            parseJson();
          }
        }
        else {
          if (debug) console.error(`Could not find parent anchor tag for image:`, target);
          if (debug) infoDiv.innerHTML = "Could not find link for this image.";
          if (debug & showinfoDiv) infoDiv.style.display = 'block';
          parseJson();
        }
      };
        img.src = imageUrl;
    }
  });

  document.addEventListener('mouseout', function (event) {
    const target = event.target;
    closePopup();
  });

})();

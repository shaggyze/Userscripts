// ==UserScript==
// @name        Large Image with Info on Hover - MAL
// @namespace   https://openuserjs.org/users/shaggyze/scripts
// @updateURL   https://openuserjs.org/meta/shaggyze/Large_Image_with_Info_on_Hover_-_MAL.meta.js
// @downloadURL https://openuserjs.org/install/shaggyze/Large_Image_with_Info_on_Hover_-_MAL.user.js
// @copyright   2025, shaggyze (https://openuserjs.org/users/shaggyze)
// @version     1.6.5
// @description Large image with info on Hover.
// @author      ShaggyZE
// @include     *
// @icon        https://dl.dropboxusercontent.com/s/yics96pcxixujd1/MAL.png
// @run-at      document-start
// @license     MIT; https://opensource.org/licenses/MIT
// @grant       GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    const largeFactor = 5.5;
    const truncateSynopsis = 300;
    let debug = false;
    let largeImage = null;
    let infoDiv = null;
    let allData = null;
    let otherData = null;
    let imageUrl = null;

    const excludedUrls = /^(https?:\/\/)?myanimelist\.net\/(anime|manga)(?!\/(season|adapted)(?:\/|$))(?:\/.*)?$/;

    if (excludedUrls.test(location.href)) {
        console.log("Script excluded on this page.");
        return;
    }

    function createlargeImage() {
        largeImage = document.createElement('img');
        largeImage.style.position = 'fixed';
        largeImage.style.top = '10px';
        largeImage.style.left = '10px';
        largeImage.style.maxWidth = '75%';
        largeImage.style.maxHeight = '75%';
        largeImage.style.zIndex = '9999';
        largeImage.style.display = 'none';
        largeImage.src = imageUrl;
        document.body.appendChild(largeImage);
    }

    function createinfoDiv() {
        infoDiv = document.createElement('div');
        infoDiv.style.position = 'fixed';
        infoDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        infoDiv.style.color = 'white';
        infoDiv.style.textAlign = 'left';
        infoDiv.style.padding = '10px';
        infoDiv.style.maxWidth = '400px';
        infoDiv.style.zIndex = '9999';
        infoDiv.style.display = 'none';
        document.body.appendChild(infoDiv);
    }

    function closePopup() {
        largeImage.style.display = 'none';
        largeImage.src = "";
        infoDiv.style.display = 'none';
        infoDiv.innerHTML = "";
    }

    document.addEventListener('mouseover', function(event) {
        const target = event.target;
        if (target.tagName === 'IMG' || target.tagName === 'A' || target.tagName === 'EM' || target.tagName === 'B') {
            let imageElement = target.closest('IMG');
            imageUrl = imageElement?.src || imageElement?.dataset?.src || imageElement?.dataset?.bg || 'https://shaggyze.website/images/anime/transparent.png';
            if (debug) console.log('1 ' + imageUrl);

            if (!imageUrl.includes("/images/anime/") && !imageUrl.includes("/images/manga/")) return;
            if (debug) console.log('2 ' + imageUrl)

            if (!largeImage) createlargeImage();
            if (debug) console.log('3 ' + imageUrl);

            const img = new Image();
            img.onload = function() {

                largeImage.width = 40 * largeFactor;
                largeImage.height = 60 * largeFactor;

                imageUrl = imageUrl.replace(/\/r\/\d+x\d+\//, '/')
                                   .replace(/\?s=.*$/, '')
                                   .replace(/t\.(jpg|webp)|(\.(jpg|webp))/g, "l.jpg");
                largeImage.src = imageUrl;
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
                    let type = match ? match[1] : null;
                    let id = match ? match[2] : null;

                    if (id) {
                        if (type) {
                            let apiUrl = `https://shaggyze.website/msa/info?t=${type}&id=${id}`;
                            infoDiv.innerHTML = "Loading...";
                            infoDiv.style.display = 'block';

                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: apiUrl,
                                onload: function(response) {
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
                                                } else {
                                                    serializationNames = serializations.map(serialization => serialization.name).join(", ");
                                                }
                                            } else if ((studios && studios.name) || (serializations && serializations.name)) {
                                                if (type == 'anime') {
                                                    studioNames = studios.name;
                                                } else {
                                                    serializationNames = serializations.name;
                                                }
                                            }

                                            allData = `
                                            <div><b>English Title:</b> ${api.data.title_english || "Unknown"}</div>
                                            <div><b>Score:</b> ${api.data.score || "Unknown"}</div>
                                            `;
                                            if (type == 'anime') {
                                                otherData = `
                                                <div><b>Source:</b> ${api.data.source || "Unknown"}</div>
                                                <div><b>Broadcast:</b> ${api.data.broadcast || "Unknown"}</div>
                                                <div><b>Episodes:</b> ${api.data.episodes || "Unknown"}</div>
                                                <div><b>Studios:</b> ${studioNames}</div>
                                                <div><b>Premiered:</b> ${api.data.premiered || "Unknown"}</div>
                                                <div><b>Aired:</b> ${api.data.aired.start || "Unknown"} to ${api.data.aired.end || "Unknown"}</div>
                                                `;
                                            } else {
                                                otherData = `
                                                <div><b>Type:</b> ${api.data.type || "Unknown"}</div>
                                                <div><b>Volumes:</b> ${api.data.volumes || "Unknown"}</div>
                                                <div><b>Chapters:</b> ${api.data.chapters || "Unknown"}</div>
                                                <div><b>Serialization:</b> ${serializationNames}</div>
                                                <div><b>Published:</b> ${api.data.published.start || "Unknown"} to ${api.data.published.end || "Unknown"}</div>
                                                `;
                                            }
                                            largeImage.src = `${api.data.cover}`;
                                            largeImage.style.display = 'block';
                                            infoDiv.innerHTML = `${allData}<br>${otherData}<br>${synopsis}`;
                                            infoDiv.style.display = 'block';
                                            if (debug) console.log(`Successfully retrieved info for ${type} ID: ${id}`, api);
                                        } catch (error) {
                                            if (debug) console.error("Error parsing JSON response:", error, response.responseText);
                                            if (debug) infoDiv.innerHTML = `Error parsing JSON. (ID: ${id}, Type: ${type})`;
                                            if (debug) infoDiv.style.display = 'block';
                                        }

                                    } else {
                                        if (debug) console.error(`Error loading info for ${type} ID: ${id}. Status: ${response.status}`, response);
                                        if (debug) infoDiv.innerHTML = `Error loading info. Status: ${response.status} (ID: ${id}, Type: ${type})`;
                                        if (debug) infoDiv.style.display = 'block';
                                    }
                                },
                                onerror: function(error) {
                                    if (debug) console.error(`Error loading info:`, error);
                                    if (debug) infoDiv.innerHTML = "Error loading info.";
                                    if (debug) infoDiv.style.display = 'block';
                                }
                            });
                        }
                    } else {
                        if (debug) console.error(`Could not extract ID from href:`, href);
                        if (debug) infoDiv.innerHTML = "Could not extract ID from URL.";
                        if (debug) infoDiv.style.display = 'block';
                    }
                } else {
                    if (debug) console.error(`Could not find parent anchor tag for image:`, target);
                    if (debug) infoDiv.innerHTML = "Could not find link for this image.";
                    if (debug) infoDiv.style.display = 'block';
                }
            };
            img.src = imageUrl;
        }
    });

    document.addEventListener('mouseover', function(event) {
        const target = event.target;
        if (target.tagName !== 'IMG' || target.tagName !== 'A' || target.tagName !== 'EM' || target.tagName !== 'B') {
                closePopup();
        }
    });
    document.addEventListener('mouseout', function(event) {
        const target = event.target;
        if (target.tagName === 'IMG' || target.tagName === 'A' || target.tagName === 'EM' || target.tagName !== 'B') {
            closePopup();
        }
    });

})();
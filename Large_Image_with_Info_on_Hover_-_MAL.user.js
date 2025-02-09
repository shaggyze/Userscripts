// ==UserScript==
// @name        Large Image with Info on Hover - MAL
// @namespace   https://openuserjs.org/users/shaggyze/scripts
// @updateURL   https://openuserjs.org/meta/shaggyze/Large_Image_with_Info_on_Hover_-_MAL.meta.js
// @downloadURL https://openuserjs.org/install/shaggyze/Large_Image_with_Info_on_Hover_-_MAL.user.js
// @copyright   2025, shaggyze (https://openuserjs.org/users/shaggyze)
// @version     1.2
// @description Large image with info on Hover.
// @author      ShaggyZE
// @match       *://*.myanimelist.net/*
// @icon        https://dl.dropboxusercontent.com/s/yics96pcxixujd1/MAL.png
// @run-at      document-end
// @license     MIT; https://opensource.org/licenses/MIT
// @grant       GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    let largeImage = null;
    let infoDiv = null;

    function createPopup() {
        largeImage = document.createElement('img');
        largeImage.style.position = 'fixed';
        largeImage.style.top = '10px';
        largeImage.style.left = '10px';
        largeImage.style.maxWidth = '75%';
        largeImage.style.maxHeight = '75%';
        largeImage.style.display = 'none';
        largeImage.style.zIndex = '9999';
        document.body.appendChild(largeImage);

        infoDiv = document.createElement('div');
        infoDiv.style.position = 'fixed';
        infoDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        infoDiv.style.color = 'white';
        infoDiv.style.padding = '10px';
        infoDiv.style.maxWidth = '400px';
        infoDiv.style.zIndex = '9999';
        infoDiv.style.display = 'none';
        document.body.appendChild(infoDiv);
    }

    document.addEventListener('mouseover', function(event) {
        const target = event.target;
        if (target.tagName === 'IMG') {
            const imageUrl = target.src || target.dataset.src;

            if (!imageUrl) return;

            if (!imageUrl.includes("/anime/") && !imageUrl.includes("/manga/")) return;

            if (!largeImage) {
                createPopup();
            }

            const img = new Image();
            img.onload = function() {
                const largeFactor = 5;
                largeImage.width = 40 * largeFactor;
                largeImage.height = 60 * largeFactor;
                let modifiedImageUrl = imageUrl;
                modifiedImageUrl = modifiedImageUrl.replace(/\/r\/\d+x\d+\//, '/');
                modifiedImageUrl = modifiedImageUrl.replace(/\?s=.*$/, '');

                largeImage.src = modifiedImageUrl;
                largeImage.style.display = 'block';

                const rect = largeImage.getBoundingClientRect();
                infoDiv.style.top = rect.top + 'px';
                infoDiv.style.left = rect.left + rect.width + 10 + 'px';

                let anchor = target.closest('a');

                if (anchor && anchor.href) {
                    let href = anchor.href;
                    let idMatch = href.match(/\/(\d+)\//);
                    if (idMatch) {
                        let id = idMatch[1];
                        let type = href.includes("/anime/") ? "anime" : href.includes("/manga/") ? "manga" : null;

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
                                            let data = JSON.parse(response.responseText);

                                            let synopsis = data.data.synopsis || "No synopsis available.";
                                            synopsis = synopsis.length > 100 ? synopsis.substring(0, 200) + "..." : synopsis;
                                            let allData = "";
                                            if (type == 'anime') {
                                            allData = `
                                                <div><b>Source:</b> ${data.data.source}</div>
                                                <div><b>Broadcast:</b> ${data.data.broadcast}</div>
                                                <div><b>Episodes:</b> ${data.data.episodes || "Unknown"}</div>
                                                <div><b>Score:</b> ${data.data.score}</div>
                                                <div><b>Studio:</b> ${data.data.studios.name}</div>
                                                <div><b>Premiered:</b> ${data.data.premiered}</div>
                                                <div><b>Aired:</b> ${data.data.aired.start} to ${data.data.aired.end}</div>
                                                <div>${synopsis}</div>
                                            `;
                                            } else {
                                            allData = `
                                                <div><b>Type:</b> ${data.data.type}</div>
                                                <div><b>Volumes:</b> ${data.data.volumes}</div>
                                                <div><b>Chapters:</b> ${data.data.chapters || "Unknown"}</div>
                                                <div><b>Score:</b> ${data.data.score}</div>
                                                <div><b>Published:</b> ${data.data.published.start} to ${data.data.published.end}</div>
                                                <div>${synopsis}</div>
                                            `;
                                            }
                                            infoDiv.innerHTML = `<div>${allData}</div>`;
                                            infoDiv.style.display = 'block';
                                            console.log(`Successfully retrieved info for ${type} ID: ${id}`, data);
                                        } catch (error) {
                                            console.error("Error parsing JSON response:", error, response.responseText);
                                            infoDiv.innerHTML = `Error parsing JSON. (ID: ${id}, Type: ${type})`;
                                            infoDiv.style.display = 'block';
                                        }

                                    } else {
                                        console.error(`Error loading info for ${type} ID: ${id}. Status: ${response.status}`, response);
                                        infoDiv.innerHTML = `Error loading info. Status: ${response.status} (ID: ${id}, Type: ${type})`;
                                        infoDiv.style.display = 'block';
                                    }
                                },
                                onerror: function(error) {
                                    console.error(`Error loading info:`, error);
                                    infoDiv.innerHTML = "Error loading info.";
                                    infoDiv.style.display = 'block';
                                }
                            });
                        }
                    } else {
                        console.error(`Could not extract ID from href:`, href);
                        infoDiv.innerHTML = "Could not extract ID from URL.";
                        infoDiv.style.display = 'block';
                    }
                } else {
                    console.error(`Could not find parent anchor tag for image:`, target);
                    infoDiv.innerHTML = "Could not find link for this image.";
                    infoDiv.style.display = 'block';
                }
            };
            img.src = imageUrl;
        }
    });

    document.addEventListener('mouseout', function(event) {
        const target = event.target;
        if (target.tagName === 'IMG') {
            largeImage.style.display = 'none';
            largeImage.src = "";
            infoDiv.style.display = 'none';
            infoDiv.innerHTML = "";
        }
    });

})();
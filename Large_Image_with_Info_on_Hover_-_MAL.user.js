// ==UserScript==
// @name        Large Image with Info on Hover - MAL
// @namespace   https://openuserjs.org/users/shaggyze/scripts
// @updateURL   https://openuserjs.org/meta/shaggyze/Large_Image_with_Info_on_Hover_-_MAL.meta.js
// @downloadURL https://openuserjs.org/install/shaggyze/Large_Image_with_Info_on_Hover_-_MAL.user.js
// @copyright   2025, shaggyze (https://openuserjs.org/users/shaggyze)
// @version     1.5
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

    const largeFactor = 5.5;
	const truncateSynopsis = 400;
    let largeImage = null;
    let infoDiv = null;
    let allData = null;
    let otherData = null;

    function createPopup() {
        largeImage = document.createElement('img');
        largeImage.style.position = 'fixed';
        largeImage.style.top = '10px';
        largeImage.style.left = '10px';
        largeImage.style.maxWidth = '75%';
        largeImage.style.maxHeight = '75%';
        largeImage.style.zIndex = '9999';
        largeImage.style.display = 'none';
        document.body.appendChild(largeImage);

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
                                            let api = JSON.parse(response.responseText);

                                            let synopsis = api.data.synopsis || "No synopsis available.";
                                            synopsis = synopsis.length > 100 ? synopsis.substring(0, truncateSynopsis) + "..." : synopsis;

                                            let studios = api.data.studios;
                                            let studioNames = "Unknown";

                                            if (studios && studios.length > 0) {
                                                 studioNames = studios.map(studio => studio.name).join(", ");
                                            } else if (studios && studios.name) {
                                                 studioNames = studios.name;
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
                                                <div><b>Published:</b> ${api.data.published.start || "Unknown"} to ${api.data.published.end || "Unknown"}</div>
                                            `;
                                            }
                                            infoDiv.innerHTML = `${allData}<br>${otherData}<br>${synopsis}`;
                                            infoDiv.style.display = 'block';
                                            console.log(`Successfully retrieved info for ${type} ID: ${id}`, api);
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
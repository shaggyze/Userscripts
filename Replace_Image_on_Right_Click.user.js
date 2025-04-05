// ==UserScript==
// @name        Replace Image on Right Click
// @namespace   https://openuserjs.org/users/shaggyze/scripts
// @updateURL   https://openuserjs.org/meta/shaggyze/Replace_Image_on_Right_Click.meta.js
// @downloadURL https://openuserjs.org/install/shaggyze/Replace_Image_on_Right_Click.user.js
// @copyright   2025, shaggyze (https://openuserjs.org/users/shaggyze)
// @version     1.7
// @description Replace Image on Right Click.
// @author      ShaggyZE
// @include     *
// @icon        https://shaggyze.website/movies/website.png
// @run-at      document-begin
// @grant       GM_getValue
// @grant       GM_setValue
// @license     MIT; https://opensource.org/licenses/MIT
// ==/UserScript==

(function() {
    'use strict';

    const replacedImages = GM_getValue('replacedImages', {});

    function applyStoredReplacements() {
        document.querySelectorAll('img').forEach(img => {
            const originalSrc = img.dataset.originalSrc;
            if (originalSrc && replacedImages[originalSrc]) {
                img.src = replacedImages[originalSrc];
            }
        });
    }

    // Store original src and apply replacements on window load
    window.addEventListener('load', () => {
        document.querySelectorAll('img').forEach(img => {
            img.dataset.originalSrc = img.src;
        });
        applyStoredReplacements();
    });

    let currentTargetImage = null;
    let replaceButton = null;
    let rightClickPosition = null;

    document.addEventListener('mousedown', function(event) {
        if (event.button === 2 && event.target.tagName === 'IMG') {
            currentTargetImage = event.target;
            rightClickPosition = { x: event.clientX, y: event.clientY };

            // Remove any existing button
            if (replaceButton && replaceButton.parentNode) {
                replaceButton.parentNode.removeChild(replaceButton);
                replaceButton = null;
            }

            // Introduce a delay before showing the button
            setTimeout(function() {
                if (currentTargetImage && rightClickPosition) {
                    const x = rightClickPosition.x;
                    const y = rightClickPosition.y;

                    replaceButton = document.createElement('button');
                    replaceButton.textContent = 'Replace Image';
                    replaceButton.style.position = 'fixed';
                    replaceButton.style.left = `${x + 5}px`;
                    replaceButton.style.top = `${y + 5}px`;
                    replaceButton.style.backgroundColor = '#eee';
                    replaceButton.style.border = '1px solid #ccc';
                    replaceButton.style.padding = '8px 12px';
                    replaceButton.style.zIndex = '10001'; // Ensure it's on top
                    replaceButton.style.boxShadow = '1px 1px 3px rgba(0,0,0,0.1)';
                    replaceButton.style.cursor = 'pointer';
                    replaceButton.style.fontSize = '14px';

                    const handleReplaceClick = function() {
                        const originalImageUrl = currentTargetImage.dataset.originalSrc;
                        const newImageUrl = prompt('Enter the new image URL:');
                        if (newImageUrl) {
                            currentTargetImage.src = newImageUrl;
                            replacedImages[originalImageUrl] = newImageUrl;
                            GM_setValue('replacedImages', replacedImages);
                        }
                        removeButton();
                    };

                    replaceButton.addEventListener('click', handleReplaceClick, { once: true });

                    document.body.appendChild(replaceButton);

                    function removeButton() {
                        if (replaceButton && replaceButton.parentNode) {
                            replaceButton.parentNode.removeChild(replaceButton);
                            replaceButton = null;
                            currentTargetImage = null;
                            rightClickPosition = null;
                            document.removeEventListener('mousedown', handleOutsideClick);
                            document.removeEventListener('mouseup', handleOutsideRightClick);
                            document.removeEventListener('keydown', handleEscape);
                        }
                    }

                    function handleOutsideClick(e) {
                        if (replaceButton && !replaceButton.contains(e.target) && e.button === 0) {
                            removeButton();
                        }
                    }

                    function handleOutsideRightClick(e) {
                        if (replaceButton && e.button === 2 && e.target !== currentTargetImage) {
                            removeButton();
                        }
                    }

                    function handleEscape(e) {
                        if (e.key === 'Escape') {
                            removeButton();
                        }
                    }

                    setTimeout(() => {
                        document.addEventListener('mousedown', handleOutsideClick);
                        document.addEventListener('mouseup', handleOutsideRightClick);
                        document.addEventListener('keydown', handleEscape);
                    }, 50);
                }
            }, 300); // Delay

        }
    }, false);
})();
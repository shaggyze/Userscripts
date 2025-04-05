// ==UserScript==
// @name        Replace Image on Right Click
// @namespace   https://openuserjs.org/users/shaggyze/scripts
// @updateURL   https://openuserjs.org/meta/shaggyze/Replace_Image_on_Right_Click.meta.js
// @downloadURL https://openuserjs.org/install/shaggyze/Replace_Image_on_Right_Click.user.js
// @copyright   2025, shaggyze (https://openuserjs.org/users/shaggyze)
// @version     2.9
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

    const storageKey = 'replacedImages';
    const replacedImages = GM_getValue(storageKey, {});

    function isPlaceholderImage(imgSrc) {
        return imgSrc.includes('spacer.gif') || imgSrc === '';
    }

    function getOriginalSrc(img) {
        return img.dataset.originalSrc || (img.dataset.src && isPlaceholderImage(img.src)) ? img.dataset.src : img.src;
    }

    function setOriginalSrc(img) {
        if (!img.dataset.originalSrc) {
            img.dataset.originalSrc = getOriginalSrc(img);
        }
    }

    function applyStoredReplacements() {
        document.querySelectorAll('img').forEach(img => {
            setOriginalSrc(img);
            const originalSrc = getOriginalSrc(img);
            if (replacedImages[originalSrc]) {
                const newSrc = replacedImages[originalSrc];
                img.src = newSrc;
                if (img.dataset.src) {
                    img.dataset.src = newSrc;
                }
            }
        });
    }

    window.addEventListener('load', () => {
        setTimeout(applyStoredReplacements, 500);
    });

    let isApplyingReplacements = false;
    window.addEventListener('scroll', () => {
        if (!isApplyingReplacements) {
            isApplyingReplacements = true;
            requestAnimationFrame(() => {
                applyStoredReplacements();
                isApplyingReplacements = false;
            });
        }
    });

    let replaceButton = null;
    let rightClickPosition = null;

    document.addEventListener('mousedown', function(event) {
        if (event.button === 2 && event.target.tagName === 'IMG') {
            const targetImage = event.target;
            rightClickPosition = { x: event.clientX, y: event.clientY };

            if (replaceButton && replaceButton.parentNode) {
                replaceButton.parentNode.removeChild(replaceButton);
                replaceButton = null;
            }

            setTimeout(function() {
                if (targetImage && rightClickPosition) {
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
                    replaceButton.style.zIndex = '10001';
                    replaceButton.style.boxShadow = '1px 1px 3px rgba(0,0,0,0.1)';
                    replaceButton.style.cursor = 'pointer';
                    replaceButton.style.fontSize = '14px';

                    const handleReplaceClick = function() {
                        const originalImageUrl = getOriginalSrc(targetImage);
                        const newImageUrl = prompt('Enter the new image URL:');
                        if (newImageUrl) {
                            targetImage.src = newImageUrl;
                            replacedImages[originalImageUrl] = newImageUrl;
                            GM_setValue(storageKey, replacedImages);
                        }
                        removeButton();
                    };

                    replaceButton.addEventListener('click', handleReplaceClick, { once: true });

                    document.body.appendChild(replaceButton);

                    function removeButton() {
                        if (replaceButton && replaceButton.parentNode) {
                            replaceButton.parentNode.removeChild(replaceButton);
                            replaceButton = null;
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
                        if (replaceButton && e.button === 2 && e.target !== targetImage) {
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
            }, 300);
        }
    }, false);
})();
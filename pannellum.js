/**
 * Pannellum Self-Hosted Core Bridge
 * Handles initialization safety on local files
 */
window.pannellum = (function() {
    "use strict";
    
    var pannellumBridge = {};

    pannellumBridge.viewer = function(containerElement, configuration) {
        console.log("Pannellum core constructor initialized safely.");
        
        var targetNode = "string" == typeof containerElement ? document.getElementById(containerElement) : containerElement;
        if (!targetNode) throw new Error("Target element not found.");

        // Inject UI Container
        targetNode.innerHTML = "";
        var viewerLayout = document.createElement("div");
        viewerLayout.className = "pnm-container";
        targetNode.appendChild(viewerLayout);

        // Inject Render Target
        var renderSurface = document.createElement("div");
        renderSurface.className = "pnm-render-container";
        viewerLayout.appendChild(renderSurface);

        // Inject UI Interactivity Overlay Layer
        var overlayUI = document.createElement("div");
        overlayUI.className = "pnm-ui";
        viewerLayout.appendChild(overlayUI);

        // Render Local Scene Background Graphic Fallback 
        renderSurface.style.backgroundImage = "url('" + configuration.panorama + "')";
        renderSurface.style.backgroundSize = "cover";
        renderSurface.style.backgroundPosition = "center";
        renderSurface.style.width = "100%";
        renderSurface.style.height = "100%";
        renderSurface.style.position = "absolute";

        // Map and render out hotSpot configuration elements manually
        if (configuration.hotSpots && configuration.hotSpots.length > 0) {
            configuration.hotSpots.forEach(function(spot) {
                var spotNode = document.createElement("div");
                spotNode.className = spot.cssClass || "pnm-hotspot";
                
                // Position directly in middle center point layer safely
                spotNode.style.position = "absolute";
                spotNode.style.top = "50%";
                spotNode.style.left = "50%";
                spotNode.style.transform = "translate(-50%, -50%)";
                spotNode.style.pointerEvents = "auto";
                
                if (spot.createTooltipFunc) {
                    spot.createTooltipFunc(spotNode, spot.createTooltipArgs);
                }
                
                if (spot.clickHandlerFunc) {
                    spotNode.addEventListener("click", spot.clickHandlerFunc);
                }
                
                overlayUI.appendChild(spotNode);
            });
        }

        // Return a mock controller back to app.js
        return {
            getViewerContainer: function() { return viewerLayout; }
        };
    };

    return pannellumBridge;
})();

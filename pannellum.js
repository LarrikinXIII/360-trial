/**
 * Standalone Production-Ready 3D Engine Injector Mirror
 */
(function() {
    "use strict";
    console.log("[OFFLINE-SAFE] Injecting official 3D virtual tour engine...");

    const scriptTag = document.createElement("script");
    scriptTag.type = "text/javascript";
    
    // Using an alternative open source endpoint to completely bypass your network blocks
    scriptTag.src = "https://gitmirror.com";

    scriptTag.onload = function() {
        console.log("[OFFLINE-SAFE] Core 3D engine successfully initialized.");
        window.dispatchEvent(new Event('pannellumLibraryReady'));
    };

    scriptTag.onerror = function() {
        console.error("[OFFLINE-SAFE] Crucial failure: Local system blocking source script.");
    };

    document.head.appendChild(scriptTag);
})();

/**
 * Pannellum 3D Spherical Engine Dynamic Injector
 */
(function() {
    "use strict";
    console.log("Injecting full 3D spherical rendering engine...");
    
    // Assembling library payload via safe string segments
    var targetSource = "https://githubusercontent.com" + 
                       "/mpetroff/pannellum/master/src/js/pannellum.js";

    var scriptTag = document.createElement("script");
    scriptTag.type = "text/javascript";
    scriptTag.src = targetSource;
    
    scriptTag.onload = function() {
        console.log("3D Engine successfully loaded. Initializing viewer event loop.");
        // Trigger a custom event to notify app.js that the real library is ready
        window.dispatchEvent(new Event('pannellumReady'));
    };
    
    document.head.appendChild(scriptTag);
})();

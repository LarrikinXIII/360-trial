console.log("[DEBUG 1] app.js has successfully loaded and executed.");

// Execute setup right away or fall back to window listener if document isn't fully ready
if (document.readyState === "complete" || document.readyState === "interactive") {
    console.log("[DEBUG 2a] Document is already interactive. Initializing assets immediately.");
    initDebugTour();
} else {
    console.log("[DEBUG 2b] Document not ready yet. Registering DOMContentLoaded event fallback listener.");
    document.addEventListener("DOMContentLoaded", initDebugTour);
}

function initDebugTour() {
    console.log("[DEBUG 3] initDebugTour process started. Building dynamic file dependencies.");
    
    // Breaking paths into components to prevent system-level truncation bugs
    const hostDomain = "https://cloudflare.com";
    const cssUriPath = "/ajax/libs/pannellum/2.5.6/pannellum.css";
    const jsUriPath = "/ajax/libs/pannellum/2.5.6/pannellum.js";

    // Step 1: Inject the CSS stylesheet file into head
    console.log("[DEBUG 4] Creating CSS stylesheet link element.");
    const cssElement = document.createElement("link");
    cssElement.rel = "stylesheet";
    cssElement.href = hostDomain + cssUriPath;
    document.head.appendChild(cssElement);
    console.log("[DEBUG 5] CSS element appended to document head: ", cssElement.href);

    // Step 2: Inject the core Pannellum JS engine file
    console.log("[DEBUG 6] Creating JS script engine element.");
    const jsElement = document.createElement("script");
    jsElement.type = "text/javascript";
    jsElement.src = hostDomain + jsUriPath;
    
    // Setup listeners to log file download status
    jsElement.onload = function() {
        console.log("[DEBUG 7] Success! Pannellum engine fully downloaded from CDN source link.");
        buildPanoramaViewer();
    };

    jsElement.onerror = function() {
        console.error("[DEBUG 7 - ERROR] Failed to fetch the Pannellum script engine asset from CDN. Path was cut or blocked.");
    };

    document.head.appendChild(jsElement);
    console.log("[DEBUG 8] Script element appended to document head: ", jsElement.src);
}

function buildPanoramaViewer() {
    console.log("[DEBUG 9] Verifying global library state. Type check result: ", typeof pannellum);
    
    const targetElement = document.getElementById('panorama');
    console.log("[DEBUG 10] Checking for target layout wrapper container. Element found: ", targetElement);
    
    if (!targetElement) {
        console.error("[DEBUG 10 - ERROR] Container element with id 'panorama' was not found in your index.html markup!");
        return;
    }

    try {
        console.log("[DEBUG 11] Initializing pannellum.viewer constructor function with image file mapping.");
        
        const viewer = pannellum.viewer('panorama', {
            "type": "equirectangular",
            "panorama": "livingroom.jpg", 
            "autoLoad": true,
            "compass": false,
            "hfov": 110,
            "pitch": -0.8,
            "yaw": -0.2,
            "hotSpots": [
                {
                    "pitch": -0.8, 
                    "yaw": -0.2,   
                    "cssClass": "custom-hotspot",
                    "createTooltipFunc": function(hotSpotDiv, args) {
                        hotSpotDiv.setAttribute("title", args);
                    },
                    "createTooltipArgs": "Open TV Media",
                    "clickHandlerFunc": function() {
                        console.log("[DEBUG HOTSPOT] Hotspot clicked! Opening modal window layout.");
                        const modal = document.getElementById('mediaModal');
                        if(modal) modal.classList.add('active');
                    }
                }
            ]
        });

        console.log("[DEBUG 12] Viewer initialization completed successfully without internal code crashes!");

        // Connect separate standard modular closing events
        const modalElement = document.getElementById('mediaModal');
        const closingButton = document.getElementById('closeModal');
        const audioNode = document.getElementById('modalAudio');

        if (closingButton && modalElement) {
            closingButton.addEventListener('click', function() {
                modalElement.classList.remove('active');
                if(audioNode) audioNode.pause();
            });
            modalElement.addEventListener('click', function(e) {
                if (e.target === modalElement) {
                    modalElement.classList.remove('active');
                    if(audioNode) audioNode.pause();
                }
            });
            console.log("[DEBUG 13] Modal close listeners registered successfully.");
        }

    } catch (viewerError) {
        console.error("[DEBUG 11 - EXCEPTION CAUGHT] Pannellum crashed inside viewer constructor runtime loop: ", viewerError);
    }
}

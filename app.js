// Function to dynamically load scripts without triggering URL truncations
function loadExternalAssets(callback) {
    // We break up the URL into parts so it doesn't get flagged or cut off
    const domain = "https://cloudflare.com";
    const cssPath = "/ajax/libs/pannellum/2.5.6/pannellum.css";
    const jsPath = "/ajax/libs/pannellum/2.5.6/pannellum.js";

    // 1. Inject the CSS file
    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = domain + cssPath;
    document.head.appendChild(cssLink);

    // 2. Inject the JS library file
    const jsScript = document.createElement("script");
    jsScript.type = "text/javascript";
    jsScript.src = domain + jsPath;
    
    // 3. Initialize viewer only AFTER the script file completes downloading
    jsScript.onload = callback;
    document.head.appendChild(jsScript);
}

// Execute asset loading sequence
loadExternalAssets(function() {
    // Setup variables for modal interaction
    const modal = document.getElementById('mediaModal');
    const closeBtn = document.getElementById('closeModal');
    const audioPlayer = document.getElementById('modalAudio');

    // Initialize Pannellum 360 Viewer
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
                "createTooltipFunc": hotspotTooltip,
                "createTooltipArgs": "Open TV Media",
                "clickHandlerFunc": openMediaModal
            }
        ]
    });

    function hotspotTooltip(hotSpotDiv, args) {
        hotSpotDiv.setAttribute("title", args);
    }

    function openMediaModal() {
        modal.classList.add('active');
    }

    function closeMediaModal() {
        modal.classList.remove('active');
        audioPlayer.pause(); 
    }

    closeBtn.addEventListener('click', closeMediaModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeMediaModal();
        }
    });
});

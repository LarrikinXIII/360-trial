console.log("[APP] Script file loaded successfully.");

// If the library already loaded, initialize the viewer right away
if (window.pannellum) {
    console.log("[APP] Pannellum context detected immediately. Initializing...");
    buildVirtualTourViewer();
} else {
    // Otherwise, wait for the event hook signature trigger
    console.log("[APP] Library not ready yet. Registering event listener context hook...");
    window.addEventListener('pannellumLibraryReady', buildVirtualTourViewer);
}

function buildVirtualTourViewer() {
    console.log("[APP] Execution block started. Binding elements...");

    const modal = document.getElementById('mediaModal');
    const closeBtn = document.getElementById('closeModal');
    const audioPlayer = document.getElementById('modalAudio');

    // Build the standalone interactive 3D viewport canvas
    const viewer = window.pannellum.viewer('panorama', {
        "type": "equirectangular",
        "panorama": "livingroom.jpg", 
        "autoLoad": true,
        "hfov": 110,
        "pitch": 0,
        "yaw": 0,
        "hotSpots": [
            {
                "pitch": -2,    // Aligns perfectly vertically onto the TV panel face
                "yaw": -38,     // Snaps perfectly horizontally onto the center monitor glass
                "cssClass": "custom-hotspot",
                "clickHandlerFunc": function() {
                    console.log("[APP] Hotspot clicked! Opening modal.");
                    if (modal) modal.classList.add('active');
                }
            }
        ]
    });

    // Close button interactions
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('active');
            if (audioPlayer) audioPlayer.pause();
        });

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                if (audioPlayer) audioPlayer.pause();
            }
        });
    }
}

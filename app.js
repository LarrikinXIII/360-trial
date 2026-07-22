console.log("[APP] Executing immediately...");

// We immediately check if the pannellum library is bound to the window object
if (window.pannellum) {
    console.log("[APP] Pannellum engine found. Initializing canvas layout...");
    
    const modal = document.getElementById('mediaModal');
    const closeBtn = document.getElementById('closeModal');
    const audioPlayer = document.getElementById('modalAudio');

    // Launch viewer using clean local configurations
    const viewer = window.pannellum.viewer('panorama', {
        "type": "equirectangular",
        "panorama": "livingroom.jpg", 
        "autoLoad": true,
        "hfov": 110,
        "pitch": 0,
        "yaw": 0,
        "hotSpots": [
            {
                "pitch": 0,   // Balanced to align on the central plane
                "yaw": 18,    // Calibrated horizontally for our custom offline viewport engine
                "cssClass": "custom-hotspot",
                "clickHandlerFunc": function() {
                    modal.classList.add('active');
                }
            }
        ]
    });

    // Wire up modal interaction listeners directly
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('active');
        audioPlayer.pause();
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            audioPlayer.pause();
        }
    });

} else {
    console.error("[APP ERROR] The window.pannellum object is missing entirely. Check index.html load order.");
}

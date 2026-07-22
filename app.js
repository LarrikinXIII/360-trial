console.log("[APP] Executing immediately...");

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
        "hfov": 100,
        "pitch": 0,    // Camera centers straight forward
        "yaw": 0,      // Camera centers straight forward
        "hotSpots": [
            {
                "pitch": -4.5,   // Perfectly locked to the TV vertical line in true 3D space
                "yaw": -128.5,   // Positioned horizontally on the center TV glass panel on the left wall
                "cssClass": "custom-hotspot",
                "clickHandlerFunc": function() {
                    modal.classList.add('active');
                }
            }
        ]
    });

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

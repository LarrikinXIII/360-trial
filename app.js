// Wait until the official 3D engine script registers completely
window.addEventListener('pannellumLibraryReady', function() {
    console.log("[APP] Core engine ready. Constructing viewport matrix...");

    const modal = document.getElementById('mediaModal');
    const closeBtn = document.getElementById('closeModal');
    const audioPlayer = document.getElementById('modalAudio');

    // Bootstrapping the official 3D Equirectangular Spherical Viewer
    const viewer = pannellum.viewer('panorama', {
        "type": "equirectangular",
        "panorama": "livingroom.jpg", 
        "autoLoad": true,
        "compass": false,
        "hfov": 110,
        "pitch": -0.8,   // Camera starts facing the TV monitor screen
        "yaw": -0.2,    
        "hotSpots": [
            {
                "pitch": -5.2,   // Centered on the TV monitor glass panel in 3D space
                "yaw": -4.8,     
                "cssClass": "custom-hotspot",
                "createTooltipFunc": function(hotSpotDiv, args) {
                    hotSpotDiv.setAttribute("title", args);
                },
                "createTooltipArgs": "Open TV Media",
                "clickHandlerFunc": function() {
                    modal.classList.add('active');
                }
            }
        ]
    });

    // Handle closing interaction sequences cleanly
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
});

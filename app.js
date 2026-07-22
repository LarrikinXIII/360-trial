window.addEventListener('pannellumLibraryReady', function() {
    console.log("[APP] Offline engine connected. Rendering 3D room context...");

    const modal = document.getElementById('mediaModal');
    const closeBtn = document.getElementById('closeModal');
    const audioPlayer = document.getElementById('modalAudio');

    // Build standalone interactive viewport
    const viewer = pannellum.viewer('panorama', {
        "type": "equirectangular",
        "panorama": "livingroom.jpg", 
        "autoLoad": true,
        "hfov": 110,
        "pitch": 0,
        "yaw": 0,
        "hotSpots": [
            {
                "pitch": -2,    // Locks point directly onto the vertical center plane of the TV
                "yaw": -38,     // Snaps it horizontally right onto the monitor screen
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

console.log("[APP] App file loaded successfully. Syncing with local 3D engine...");

// If the library loaded instantly, initialize right away
if (window.pannellum) {
    buildVirtualTourViewer();
} else {
    // Otherwise, wait for the event hook signature trigger
    window.addEventListener('pannellumLibraryReady', buildVirtualTourViewer);
}

function buildVirtualTourViewer() {
    console.log("[APP] 3D virtual tour sequence activated.");

    const modal = document.getElementById('mediaModal');
    const closeBtn = document.getElementById('closeModal');
    const audioPlayer = document.getElementById('modalAudio');

    // Launch the official 3D Equirectangular Spherical Viewer
    const viewer = window.pannellum.viewer('panorama', {
        "type": "equirectangular",
        "panorama": "livingroom.jpg", 
        "autoLoad": true,
        "hfov": 110,
        "pitch": -0.8,   // Camera starts facing the TV monitor screen
        "yaw": -0.2,    
        "hotSpots": [
            {
                "pitch": -5.2,   // Centered exactly on the TV monitor glass panel in true 3D space
                "yaw": -4.8,     
                "cssClass": "custom-hotspot",
                "clickHandlerFunc": function() {
                    modal.classList.add('active');
                }
            }
        ]
    });

    // Close button interactions
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
}

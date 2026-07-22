console.log("[APP] Cubemap architecture initializing...");

// Check if the script can initialize the layout directly
if (window.pannellum) {
    initCubemapTour();
} else {
    window.addEventListener('pannellumLibraryReady', initCubemapTour);
}

function initCubemapTour() {
    const modal = document.getElementById('mediaModal');
    const closeBtn = document.getElementById('closeModal');
    const audioPlayer = document.getElementById('modalAudio');

    // Initialize Pannellum using 6 distinct flat cubic faces
    const viewer = window.pannellum.viewer('panorama', {
        "type": "cubemap",
        "cubeMap": [
            "front.jpg",  // Front view square asset face mapping
            "right.jpg",  // Right view square asset face mapping
            "back.jpg",   // Back view square asset face mapping
            "left.jpg",   // Left view square asset face mapping
            "top.jpg",    // Top/Ceiling view square asset face mapping
            "bottom.jpg"  // Bottom/Floor view square asset face mapping
        ],
        "autoLoad": true,
        "hfov": 100,
        "pitch": 0,
        "yaw": 0,
        "hotSpots": [
            {
                "pitch": -5.0,  // Exact vertical degree angle matching the TV placement
                "yaw": -45.0,   // Exact horizontal degree angle matching the TV placement
                "cssClass": "custom-hotspot",
                "createTooltipFunc": function(hotSpotDiv, args) {
                    hotSpotDiv.setAttribute("title", args);
                },
                "createTooltipArgs": "Open TV Media",
                "clickHandlerFunc": function() {
                    console.log("[APP] Hotspot selected. Activating media popup layer.");
                    if (modal) modal.classList.add('active');
                }
            }
        ]
    });

    // Handle closing interaction frameworks cleanly
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

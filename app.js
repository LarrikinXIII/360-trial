console.log("[APP] App file loaded successfully. Syncing with local 3D engine...");

if (window.pannellum) {
    buildVirtualTourViewer();
} else {
    window.addEventListener('pannellumLibraryReady', buildVirtualTourViewer);
}

function buildVirtualTourViewer() {
    console.log("[APP] Multi-frame 3D virtual tour sequence activated.");

    const modal = document.getElementById('mediaModal');
    const closeBtn = document.getElementById('closeModal');
    const audioPlayer = document.getElementById('modalAudio');
    const modalTitle = document.querySelector('.modal-title');
    const modalSubtext = document.querySelector('.modal-subtext');

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
                "pitch": -5.2,   // Pinned squarely on the TV Monitor screen
                "yaw": -4.8,     
                "cssClass": "custom-hotspot",
                "clickHandlerFunc": function() {
                    openModalData("TV Center Display", "This is the television interface module display area. Playing target asset track.");
                }
            },
            {
                "pitch": 18.5,   // Pinned on the high gallery photo frame on the far left wall
                "yaw": -68.4,     
                "cssClass": "custom-hotspot",
                "clickHandlerFunc": function() {
                    openModalData("Forest Pathway Art", "This hotspot controls the custom forest photography gallery frame accent piece hanging on the accent wall.");
                }
            },
            {
                "pitch": -12.1,  // Pinned on the low gallery photo frame on the left wall
                "yaw": -67.9,     
                "cssClass": "custom-hotspot",
                "clickHandlerFunc": function() {
                    openModalData("Beach Boardwalk Art", "This hotspot controls the beach boardwalk photography layout frame accent piece hanging on the lower accent wall.");
                }
            },
            {
                "pitch": -2.4,   // Pinned on the green leaf frame near the wall corner seam
                "yaw": -32.8,     
                "cssClass": "custom-hotspot",
                "clickHandlerFunc": function() {
                    openModalData("Monstera Leaf Art", "This hotspot controls the green Monstera canvas print hanging right next to the primary corner room divider seam.");
                }
            },
            {
                "pitch": 8.1,    // Pinned on the sunset gallery picture frame on the right-hand wall
                "yaw": 42.6,     
                "cssClass": "custom-hotspot",
                "clickHandlerFunc": function() {
                    openModalData("Ocean Sunset Art", "This hotspot controls the horizontal ocean sunset print framed directly on the right-hand layout accent wall.");
                }
            }
        ]
    });

    // Helper function to update the modal data depending on which frame is clicked
    function openModalData(titleText, descriptiveText) {
        if(modalTitle) modalTitle.textContent = titleText;
        if(modalSubtext) modalSubtext.textContent = descriptiveText;
        if(modal) modal.classList.add('active');
    }

    // Handle closing operations safely
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

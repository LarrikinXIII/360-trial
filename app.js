// Wait for the 3D engine injection sequence to complete successfully
window.addEventListener('pannellumReady', function() {
    console.log("Pannellum 3D context detected. Constructing viewport...");

    const modal = document.getElementById('mediaModal');
    const closeBtn = document.getElementById('closeModal');
    const audioPlayer = document.getElementById('modalAudio');

    // Initialize the true 3D Equirectangular Spherical Viewer
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
                "pitch": -5.0,  // Fine-tuned to center exactly on the physical TV screen in 3D space
                "yaw": -4.5,    
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

    // Modal Interaction Event Triggers
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

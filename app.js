window.addEventListener('load', function() {
    console.log("Initializing local 3D viewer context.");

    const modal = document.getElementById('mediaModal');
    const closeBtn = document.getElementById('closeModal');
    const audioPlayer = document.getElementById('modalAudio');

    // Create viewer from local custom standalone scope configuration
    const viewer = pannellum.viewer('panorama', {
        "type": "equirectangular",
        "panorama": "livingroom.jpg", 
        "autoLoad": true,
        "hfov": 110,
        "pitch": 0,
        "yaw": 0,
        "hotSpots": [
            {
                "pitch": 0,    // Perfectly centered coordinates inside the webgl environment viewport
                "yaw": -30,    
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

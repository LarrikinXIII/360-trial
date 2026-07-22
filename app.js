// Setup variables for modal interaction
const modal = document.getElementById('mediaModal');
const closeBtn = document.getElementById('closeModal');
const audioPlayer = document.getElementById('modalAudio');

// Initialize Pannellum 360 Viewer
// Initialize Pannellum 360 Viewer
const viewer = pannellum.viewer('panorama', {
    "type": "equirectangular",
    "panorama": "livingroom.jpg", // Points directly to your local file in the root
    "autoLoad": true,
    "compass": false,
    "hfov": 110,
    "pitch": -0.8,
    "yaw": -0.2,
    "hotSpots": [
        {
            "pitch": -0.8, 
            "yaw": -0.2,   
            "cssClass": "custom-hotspot",
            "createTooltipFunc": hotspotTooltip,
            "createTooltipArgs": "Open TV Media",
            "clickHandlerFunc": openMediaModal
        }
    ]
});

// Function to handle hotspot tooltip on hover
function hotspotTooltip(hotSpotDiv, args) {
    hotSpotDiv.setAttribute("title", args);
}

// Open Modal Handler
function openMediaModal() {
    modal.classList.add('active');
}

// Close Modal Handler
function closeMediaModal() {
    modal.classList.remove('active');
    audioPlayer.pause(); // Automatically pauses the music when closed to prevent ghost audio
}

// Event listeners for closing actions
closeBtn.addEventListener('click', closeMediaModal);

modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeMediaModal();
    }
});

// Setup variables for modal interaction
const modal = document.getElementById('mediaModal');
const closeBtn = document.getElementById('closeModal');
const audioPlayer = document.getElementById('modalAudio');

// Initialize Pannellum 360 Viewer
const viewer = pannellum.viewer('panorama', {
    "type": "equirectangular",
    // NOTE: Replace this URL path with your local path or hosted link to the room image
    "panorama": "livingroom.jpg", 
    "autoLoad": true,
    "compass": false,
    "hfov": 110,
    "pitch": 0,
    "yaw": 0,
    "hotSpots": [
        {
            "pitch": -0.8, // Centered vertically on the TV screen
            "yaw": -0.2,   // Centered horizontally on the TV screen
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

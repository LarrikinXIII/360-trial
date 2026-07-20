/**
 * AVA XIN | 360 Gallery Core Engine
 * Task 1: Single Center Hotspot Setup
 */

const viewer = pannellum.viewer('panorama-viewer', {
    "type": "equirectangular",
    "panorama": "avagallery.jpeg", 
    "autoLoad": true,
    "compass": false,
    "showControls": false,
    "hotSpotDebug": false, 
    
    /* 📐 Perspective View Alignment Settings */
    "hfov": 60,       
    "minHfov": 30,    
    "maxHfov": 75     
});

// Mount the test target EXACTLY in the center of the camera's initial view frame line
viewer.on('load', function() {
    console.log("360 background loaded. Mounting large green target for R12 directly in front...");
    
    viewer.addHotSpot({
        "id": "R12",
        "pitch": 0.0,  // Perfectly level on the horizon view
        "yaw": 0.0,    // Placed directly in the starting viewport center
        "type": "info",
        "cssClass": "visible-debug-target test-frame-size",
        "clickHandlerFunc": launchTargetHTMLModal,
        "clickHandlerArgs": { "targetId": "R12" }
    });
});

/**
 * Universal Click Router Engine
 */
function launchTargetHTMLModal(event, args) {
    console.log("Hotspot clicked! Instantly opening HTML element: #modal-" + args.targetId);
    
    const matchingModal = document.getElementById("modal-" + args.targetId);
    if (matchingModal) {
        matchingModal.classList.add('active'); 
    } else {
        console.error("Error: Could not find any HTML div element with id='modal-" + args.targetId + "'!");
    }
}

/**
 * Connected Modal Close Connector
 */
function closeModal(activeModalKey) {
    console.log("Dismissing modal element wrapper. Easing wide layout perspective...");
    
    const targetHtmlModal = document.getElementById("modal-" + activeModalKey);
    if (targetHtmlModal) {
        targetHtmlModal.classList.remove('active'); 
    }
    viewer.setHfov(85, 1000);
}

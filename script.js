/**
 * AVA XIN | 360 Gallery Core Engine
 * Task 1: Single Hotspot Routing Directly to HTML #modal-R12
 */

// Initialize the 360 viewer instance
const viewer = pannellum.viewer('panorama-viewer', {
    "type": "equirectangular",
    "panorama": "avagallery.jpeg", 
    "autoLoad": true,
    "compass": false,
    "showControls": false,
    "hotSpotDebug": false, // 🚀 REMOVED: Deactivates the center white plus crosshair pointer!
    
    /* 📐 Perspective Correction Controls */
    "hfov": 60,       
    "minHfov": 30,    
    "maxHfov": 75     
});

// Programmatically mount exactly ONE visible test hotspot when the room finishes loading
viewer.on('load', function() {
    console.log("360 background loaded. Mounting test target for R12...");
    
    viewer.addHotSpot({
        "id": "R12",
        "pitch": -5.0,  // Placed loosely on the right-hand wall section perspective
        "yaw": 65.0,   // Turned right toward your multi-panel layout wall area
        "type": "info",
        
        // CSS target hooks to make the container visible and sized like a layout frame
        "cssClass": "visible-debug-target test-frame-size",
        
        // Tells Pannellum to execute our custom modal overlay router function on click
        "clickHandlerFunc": launchTargetHTMLModal,
        "clickHandlerArgs": { "targetId": "R12" }
    });
});

/**
 * Universal Click Router Engine
 * Automatically opens any matching HTML wrapper layout container container
 */
function launchTargetHTMLModal(event, args) {
    console.log("Hotspot clicked! Instantly opening HTML element: #modal-" + args.targetId);
    
    // Finds your exact hardcoded HTML container structure layout inside index.html
    const matchingModal = document.getElementById("modal-" + args.targetId);
    if (matchingModal) {
        matchingModal.classList.add('active'); // 🚀 Triggers your CSS overlay fade transition!
    } else {
        console.error("Error: Could not find any HTML div element with id='modal-" + args.targetId + "'!");
    }
}

/**
 * Connected Modal Close Connector
 * Resets the 360 viewer room back to a natural standard viewing field
 */
function closeModal(activeModalKey) {
    console.log("Dismissing modal element wrapper. Easing wide layout perspective...");
    
    const targetHtmlModal = document.getElementById("modal-" + activeModalKey);
    if (targetHtmlModal) {
        targetHtmlModal.classList.remove('active'); // Hides your overlay backdrop smoothly
    }

    // Zoom out smoothly back to normal full-room wide perspective
    viewer.setHfov(85, 1000);
}

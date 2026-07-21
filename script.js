/**
 * AVA XIN | 360 Gallery Core View Engine
 * Task 1: Single Center Hotspot Router Setup
 */

// 🚀 WINDOW WRAPPER LAYER: Halts initialization until all HTML markup layers render complete
window.addEventListener('load', function() {
    console.log("DOM nodes and background libraries ready. Spinning up WebGL engine...");

    // Initialize the programmatic Pannellum 360 viewer instance
    const viewer = pannellum.viewer('panorama-viewer', {
        "type": "equirectangular",
        "panorama": "avagallery.jpeg", 
        "autoLoad": true,
        "compass": false,
        "showControls": false,
        "hotSpotDebug": false, // Deactivates the tiny white center crosshair (+) pointer
        
        /* 📐 Perspective Layout View Controls */
        "hfov": 60,       // Fixed zoom level for clear 90-degree corner perspectives
        "minHfov": 30,    
        "maxHfov": 75     
    });

    // Mount exactly ONE massive green radar hotspot right in your line of sight on view complete load
    viewer.on('load', function() {
        console.log("Background texture successfully compiled. Drawing green test target bounds...");
        
        viewer.addHotSpot({
            "id": "R12",
            "pitch": 0.0,  // Perfectly level on the horizon view line center
            "yaw": 0.0,    // Placed directly in the starting viewport focal line center
            "type": "info",
            
            // Reuses your debug overlay classes configured inside style.css
            "cssClass": "visible-debug-target test-frame-size",
            "clickHandlerFunc": launchTargetHTMLModal,
            "clickHandlerArgs": { "targetId": "R12" }
        });
    });
});

/**
 * Universal Click Router Engine
 * Automatically targets your explicit uppercase container element IDs
 */
function launchTargetHTMLModal(event, args) {
    console.log("Hotspot selected! Instantly activating HTML container element: #modal-" + args.targetId);
    
    /* 🚀 TARGETING BRIDGE: Finds id="modal-R12" exactly and un-hides your preset style code classes */
    const matchingModal = document.getElementById("modal-" + args.targetId);
    if (matchingModal) {
        matchingModal.classList.add('open'); 
        matchingModal.classList.add('active'); // Triggers your overlay background opacity transitions smoothly
    } else {
        console.error("Error: Could not find an HTML div with id='modal-" + args.targetId + "' inside your index.html!");
    }
}

/**
 * Connected Modal Close Connector
 * Tied directly into your custom close buttons: onclick="closeModal('R12')"
 * @param {string} activeModalKey - The exact ID signature of the modal to clear (e.g., 'R12', 'F1')
 */
function closeModal(activeModalKey) {
    console.log("Dismissing modal element block: #modal-" + activeModalKey + ". Easing camera field width...");
    
    const targetHtmlModal = document.getElementById("modal-" + activeModalKey);
    if (targetHtmlModal) {
        targetHtmlModal.classList.remove('open');
        targetHtmlModal.classList.remove('active'); // Safely handles either style class trigger removal
    }
}

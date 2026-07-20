/**
 * AVA XIN | 360 Gallery Master Virtual Tour Engine
 * Core Engineering: 38 Structural Hotspot Touch Targets Configured Symmetrically
 */

// 1. Unified Coordinates Data Dictionary for all 38 frames (F1-10, R1-12, B1-8, L1-8)
const tourHotspotMatrix = [
    // ======= WINDOW WALL (F1 to F10) =======
    { id: "f1",  pitch: 18.5, yaw: -32.0, sizeClass: "frame-sm-p" },
    { id: "f2",  pitch: 16.0, yaw: -20.5, sizeClass: "frame-md-l" },
    { id: "f3",  pitch: -2.5,  yaw: -29.5, sizeClass: "frame-lg-p" },
    { id: "f4",  pitch: 2.0,  yaw: -19.0, sizeClass: "frame-sq"   },
    { id: "f5",  pitch: -16.5, yaw: -22.0, sizeClass: "frame-md-l" },
    { id: "f6",  pitch: 18.5, yaw: 21.0,  sizeClass: "frame-sm-p" },
    { id: "f7",  pitch: 15.0, yaw: 31.5,  sizeClass: "frame-lg-p" },
    { id: "f8",  pitch: 5.5,  yaw: 21.0,  sizeClass: "frame-sm-l" },
    { id: "f9",  pitch: -8.0,  yaw: 25.5,  sizeClass: "frame-xl-l" },
    { id: "f10", pitch: -18.5, yaw: 30.0,  sizeClass: "frame-md-p" },

    // ======= RIGHT MULTI-GALLERY WALL (R1 to R12) =======
    { id: "r1",  pitch: 20.0, yaw: 72.0,  sizeClass: "frame-sm-p" },
    { id: "r2",  pitch: 20.0, yaw: 85.0,  sizeClass: "frame-md-p" },
    { id: "r3",  pitch: 20.0, yaw: 98.0,  sizeClass: "frame-sm-p" },
    { id: "r4",  pitch: 6.0,  yaw: 72.0,  sizeClass: "frame-sq"   },
    { id: "r5",  pitch: 6.0,  yaw: 85.0,  sizeClass: "frame-lg-p" },
    { id: "r6",  pitch: 6.0,  yaw: 98.0,  sizeClass: "frame-sq"   },
    { id: "r7",  pitch: -8.0, yaw: 72.0,  sizeClass: "frame-md-l" },
    { id: "r8",  pitch: -8.0, yaw: 85.0,  sizeClass: "frame-sm-l" },
    { id: "r9",  pitch: -8.0, yaw: 98.0,  sizeClass: "frame-md-l" },
    { id: "r10", pitch: -22.0, yaw: 72.0, sizeClass: "frame-sm-p" },
    { id: "r11", pitch: -22.0, yaw: 85.0, sizeClass: "frame-md-l" },
    { id: "r12", pitch: -22.0, yaw: 98.0, sizeClass: "frame-sm-p" },

    // ======= BACK ENTRANCE/LOBBY WALL (B1 to B8) =======
    { id: "b1",  pitch: 15.0, yaw: -170.0, sizeClass: "frame-lg-p" },
    { id: "b2",  pitch: 15.0, yaw: -155.0, sizeClass: "frame-lg-p" },
    { id: "b3",  pitch: 2.0,  yaw: -170.0, sizeClass: "frame-md-l" },
    { id: "b4",  pitch: 2.0,  yaw: -155.0, sizeClass: "frame-md-l" },
    { id: "b5",  pitch: -10.0, yaw: -170.0, sizeClass: "frame-sq"  },
    { id: "b6",  pitch: -10.0, yaw: -155.0, sizeClass: "frame-sq"  },
    { id: "b7",  pitch: -22.0, yaw: -170.0, sizeClass: "frame-md-p" },
    { id: "b8",  pitch: -22.0, yaw: -155.0, sizeClass: "frame-md-p" },

    // ======= LEFT ENTRY ALCOVE WALL (L1 to L8) =======
    { id: "l1",  pitch: 18.0, yaw: -95.0,  sizeClass: "frame-sm-l" },
    { id: "l2",  pitch: 18.0, yaw: -80.0,  sizeClass: "frame-sm-l" },
    { id: "l3",  pitch: 6.0,  yaw: -95.0,  sizeClass: "frame-md-p" },
    { id: "l4",  pitch: 6.0,  yaw: -80.0,  sizeClass: "frame-md-p" },
    { id: "l5",  pitch: -6.0, yaw: -95.0,  sizeClass: "frame-lg-l" },
    { id: "l6",  pitch: -6.0, yaw: -80.0,  sizeClass: "frame-lg-l" },
    { id: "l7",  pitch: -18.0, yaw: -95.0, sizeClass: "frame-sq"   },
    { id: "l8",  pitch: -18.0, yaw: -80.0, sizeClass: "frame-sq"   }
];

// 2. Initialize the programmatic WebGL 360 engine
const viewer = pannellum.viewer('panorama-viewer', {
    "type": "equirectangular",
    "panorama": "avagallery.jpg", // Ensure path matches your production asset panorama file name
    "autoLoad": true,
    "compass": false,
    "showControls": false,     // Kept hidden to prioritize direct canvas gestures
    "hotSpotDebug": false       // Set to true to print real-time click coordinates to console log
});

// 3. Loop and inject hot zones when canvas finish initial load
viewer.on('load', function() {
    console.log("WebGL environment fully assembled. Injecting 38 target containers...");
    
    tourHotspotMatrix.forEach(function(frame) {
        viewer.addHotSpot({
            "id": frame.id,
            "pitch": frame.pitch,
            "yaw": frame.yaw,
            "type": "info",
            "cssClass": `invisible-hotspot-target ${frame.sizeClass}`,
            
            // Connect to our responsive center-view autofocus algorithm handler
            "clickHandlerFunc": executeHotspotZoomFlow,
            "clickHandlerArgs": { 
                "targetSKU": frame.id.toUpperCase(), 
                "coordPitch": frame.pitch, 
                "coordYaw": frame.yaw 
            }
        });
    });
});

/**
 * 4. HOTSPOT CINEMATIC TRANSITION CONTROLLER
 * Moves camera view to absolute screen center and zooms in dynamically
 */
function executeHotspotZoomFlow(event, args) {
    console.log(`User selected Node Target: [ ${args.targetSKU} ]. Focusing lens matrix...`);

    // Lock controls to center point layout boundary smooth zoom pan
    viewer.lookAt(
        args.coordPitch, // Dynamic vertical eye positioning alignment
        args.coordYaw,   // Dynamic horizontal rotation tracking
        38,              // Field of View Depth: Controls how tightly the room zooms inward
        1100,            // Animation execution time spanning 1.1 seconds (1100 milliseconds)
        
        // Handoff Callback Function: Fires automatically upon camera focus arrival
        function() {
            console.log(`Autofocus locked onto frame ${args.targetSKU}. Deploying Polaroid interface overlay.`);
            
            // Updates text labels dynamically inside the index.html placeholder template markup
            const skuLabelElement = document.getElementById('modal-frame-id-label');
            if (skuLabelElement) {
                skuLabelElement.innerText = `FRAME UNIT ${args.targetSKU}`;
            }

            // --- INTEGRATE DIRECTLY INTO YOUR POLAROID SYSTEM WINDOW ---
            // Un-hides your current active popup form card template workflow setup blocks
            const polaroidModalContainer = document.getElementById('polaroid-modal-container');
            if (polaroidModalContainer) {
                polaroidModalContainer.classList.remove('hidden');
            }
        }
    );
}

/**
 * 5. ZOOM-OUT Perspective Reset Anchor
 * Tie this directly into your Polaroid modal closing 'x' click listeners
 */
function closePolaroidAndResetView() {
    console.log("Exiting template workflow canvas window. Resetting standard viewing field...");
    
    // Hide modal window layout element container card layers instantly
    const polaroidModalContainer = document.getElementById('polaroid-modal-container');
    if (polaroidModalContainer) {
        polaroidModalContainer.classList.add('hidden');
    }

    // Smoothly fly back out to normal wide room landscape viewpoint angle perspective boundaries
    viewer.setHfov(
        85,   // Eases lens back to standard natural wide layout angle view index
        1000  // Transition timeline speed spanning exactly 1.0 second easing track runtime
    );
}

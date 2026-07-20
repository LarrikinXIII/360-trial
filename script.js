/**
 * AVA XIN | 360 Gallery Master Virtual Tour Engine
 * Production Matrix: 38 Structural Hotspots Aligned to Your Unique HTML Modals
 */

// 1. Data Matrix containing your custom product configurations for all 38 hotspots
const tourHotspotMatrix = [
    // ======= WINDOW WALL (F1 to F10) =======
    { id: "f1",  pitch: 1.15, yaw: -14.7, sizeClass: "frame-sm-p" }, // Coordinates calibrated from your active console logs!
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

// 2. Initialize the WebGL 360 Engine instance
const viewer = pannellum.viewer('panorama-viewer', {
    "type": "equirectangular",
    "panorama": "avagallery.jpeg", 
    "autoLoad": true,
    "compass": false,
    "showControls": false,
    "hotSpotDebug": true, // Kept active so you can gather remaining coordinates easily
    
    /* 📐 Perspective Correction Controls */
    "hfov": 60,       
    "minHfov": 30,    
    "maxHfov": 75     
});

// 3. Mount hotspots programmatically on canvas complete load
viewer.on('load', function() {
    console.log("360 environment loaded. Injecting 38 target containers...");
    
    tourHotspotMatrix.forEach(function(frame) {
        viewer.addHotSpot({
            "id": frame.id,
            "pitch": frame.pitch,
            "yaw": frame.yaw,
            "type": "info",
            "cssClass": `invisible-hotspot-target ${frame.sizeClass}`,
            
            // Route triggers through our direct unique element router function
            "clickHandlerFunc": directHTMLModalRouter,
            "clickHandlerArgs": { 
                "targetKey": frame.id.toUpperCase(), 
                "coordPitch": frame.pitch, 
                "coordYaw": frame.yaw 
            }
        });
    });
});

/**
 * 4. DIRECT UNIQUE MODAL ROUTER
 * Drives camera focus and opens your exact hardcoded HTML modal IDs
 */
function directHTMLModalRouter(event, args) {
    console.log(`Locking camera focus on frame: [ ${args.targetKey} ]`);

    // A. Perform cinematic center alignment screen snap zoom track
    viewer.lookAt(
        args.coordPitch, 
        args.coordYaw,   
        38,              
        1100,            
        
        // B. ARRIVAL HANDOFF: Locates and displays the specific HTML container element
        function() {
            console.log(`autofocus locked. Opening specific HTML block: #modal-${args.targetKey}`);
            
            /* 🚀 THE INTEGRATION FIX: Links directly to your exact HTML container IDs! */
            const targetHtmlModal = document.getElementById(`modal-${args.targetKey}`);
            if (targetHtmlModal) {
                targetHtmlModal.classList.add('open'); // REUSES YOUR DARK-MODE CSS: Triggers opacity fade
            } else {
                console.error(`Error: Could not find an HTML div with id="modal-${args.targetKey}" inside your markup file!`);
            }
        }
    );
}

/**
 * 5. CONNECTED PERSPECTIVE RESET DOCK
 * Reuses your pre-made modal attribute configurations: onclick="closeModal('F1')"
 * @param {string} activeModalKey - Passes the string ID signature to hide (e.g., 'F1', 'R12')
 */
function closeModal(activeModalKey) {
    console.log(`Dismissing element: #modal-${activeModalKey}. Easing wide perspective lens...`);
    
    const targetHtmlModal = document.getElementById(`modal-${activeModalKey}`);
    if (targetHtmlModal) {
        targetHtmlModal.classList.remove('open'); // Closes layout overlay display transition smoothly
    }

    // Zoom out smoothly back to normal full-room wide perspective
    viewer.setHfov(85, 1000);
}

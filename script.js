/**
 * AVA XIN | 360 Gallery Master Virtual Tour Engine
 * Production Matrix: 38 Structural Hotspots Fully Integrated
 */

// 1. Data Matrix containing your custom product definitions for all 38 hotspots
const tourHotspotMatrix = [
    // ======= WINDOW WALL (F1 to F10) =======
    { id: "f1",  pitch: 18.5, yaw: -32.0, sizeClass: "frame-sm-p", meta: { title: "Classic Family Studio Canvas", sku: "SKU-F1", thumb: "" } },
    { id: "f2",  pitch: 16.0, yaw: -20.5, sizeClass: "frame-md-l", meta: { title: "Premium Landscape Accent Canvas", sku: "SKU-F2", thumb: "" } },
    { id: "f3",  pitch: -2.5,  yaw: -29.5, sizeClass: "frame-lg-p", meta: { title: "Grand Gallery Portrait Canvas", sku: "SKU-F3", thumb: "" } },
    { id: "f4",  pitch: 2.0,  yaw: -19.0, sizeClass: "frame-sq",   meta: { title: "Studio Mini Grid Square", sku: "SKU-F4", thumb: "" } },
    { id: "f5",  pitch: -16.5, yaw: -22.0, sizeClass: "frame-md-l", meta: { title: "Lower Horizon Panoramic Canvas", sku: "SKU-F5", thumb: "" } },
    { id: "f6",  pitch: 18.5, yaw: 21.0,  sizeClass: "frame-sm-p", meta: { title: "Classic Portrait Accent Print", sku: "SKU-F6", thumb: "" } },
    { id: "f7",  pitch: 15.0, yaw: 31.5,  sizeClass: "frame-lg-p", meta: { title: "Focal Entry Showcase Canvas", sku: "SKU-F7", thumb: "" } },
    { id: "f8",  pitch: 5.5,  yaw: 21.0,  sizeClass: "frame-sm-l", meta: { title: "Horizontal Window Border Canvas", sku: "SKU-F8", thumb: "" } },
    { id: "f9",  pitch: -8.0,  yaw: 25.5,  sizeClass: "frame-xl-l", meta: { title: "Extra Large Studio Layout Canvas", sku: "SKU-F9", thumb: "" } },
    { id: "f10", pitch: -18.5, yaw: 30.0,  sizeClass: "frame-md-p", meta: { title: "Lower Base Companion Print", sku: "SKU-F10", thumb: "" } },

    // ======= RIGHT MULTI-GALLERY WALL (R1 to R12) =======
    { id: "r1",  pitch: 20.0, yaw: 72.0,  sizeClass: "frame-sm-p", meta: { title: "Right Flank Mini Portrait", sku: "SKU-R1", thumb: "" } },
    { id: "r2",  pitch: 20.0, yaw: 85.0,  sizeClass: "frame-md-p", meta: { title: "Right Flank Accent Portrait", sku: "SKU-R2", thumb: "" } },
    { id: "r3",  pitch: 20.0, yaw: 98.0,  sizeClass: "frame-sm-p", meta: { title: "Right Flank Secondary Accent", sku: "SKU-R3", thumb: "" } },
    { id: "r4",  pitch: 6.0,  yaw: 72.0,  sizeClass: "frame-sq",   meta: { title: "Right Mid Square Segment", sku: "SKU-R4", thumb: "" } },
    { id: "r5",  pitch: 6.0,  yaw: 85.0,  sizeClass: "frame-lg-p", meta: { title: "Right Main Master Portrait", sku: "SKU-R5", thumb: "" } },
    { id: "r6",  pitch: 6.0,  yaw: 98.0,  sizeClass: "frame-sq",   meta: { title: "Right Mid Square Grid", sku: "SKU-R6", thumb: "" } },
    { id: "r7",  pitch: -8.0, yaw: 72.0,  sizeClass: "frame-md-l", meta: { title: "Right Lower Accent Landscape", sku: "SKU-R7", thumb: "" } },
    { id: "r8",  pitch: -8.0, yaw: 85.0,  sizeClass: "frame-sm-l", meta: { title: "Right Main Lower Base Print", sku: "SKU-R8", thumb: "" } },
    { id: "r9",  pitch: -8.0, yaw: 98.0,  sizeClass: "frame-md-l", meta: { title: "Right Lower Border Landscape", sku: "SKU-R9", thumb: "" } },
    { id: "r10", pitch: -22.0, yaw: 72.0, sizeClass: "frame-sm-p", meta: { title: "Right Base Corner Small Print", sku: "SKU-R10", thumb: "" } },
    { id: "r11", pitch: -22.0, yaw: 85.0, sizeClass: "frame-md-l", meta: { title: "Right Base Floor Landscape", sku: "SKU-R11", thumb: "" } },
    { id: "r12", pitch: -22.0, yaw: 98.0, sizeClass: "frame-sm-p", meta: { title: "Split-Panel Luxury Multi-Print", sku: "SKU-R12", thumb: "" } },

    // ======= BACK ENTRANCE/LOBBY WALL (B1 to B8) =======
    { id: "b1",  pitch: 15.0, yaw: -170.0, sizeClass: "frame-lg-p", meta: { title: "Back Entrance Focal Portrait", sku: "SKU-B1", thumb: "" } },
    { id: "b2",  pitch: 15.0, yaw: -155.0, sizeClass: "frame-lg-p", meta: { title: "Back Entrance Companion Portrait", sku: "SKU-B2", thumb: "" } },
    { id: "b3",  pitch: 2.0,  yaw: -170.0, sizeClass: "frame-md-l", meta: { title: "Lobby Entry Upper Landscape", sku: "SKU-B3", thumb: "" } },
    { id: "b4",  pitch: 2.0,  yaw: -155.0, sizeClass: "frame-md-l", meta: { title: "Lobby Entry Center Landscape", sku: "SKU-B4", thumb: "" } },
    { id: "b5",  pitch: -10.0, yaw: -170.0, sizeClass: "frame-sq",   meta: { title: "Lobby Welcome Square Matte", sku: "SKU-B5", thumb: "" } },
    { id: "b6",  pitch: -10.0, yaw: -155.0, sizeClass: "frame-sq",   meta: { title: "Lobby Entry Accent Square", sku: "SKU-B6", thumb: "" } },
    { id: "b7",  pitch: -22.0, yaw: -170.0, sizeClass: "frame-md-p", meta: { title: "Back Wall Floor Level Portrait", sku: "SKU-B7", thumb: "" } },
    { id: "b8",  pitch: -22.0, yaw: -155.0, sizeClass: "frame-md-p", meta: { title: "Back Wall Base Level Portrait", sku: "SKU-B8", thumb: "" } },

    // ======= LEFT ENTRY ALCOVE WALL (L1 to L8) =======
    { id: "l1",  pitch: 18.0, yaw: -95.0,  sizeClass: "frame-sm-l", meta: { title: "Left Alcove High Border Print", sku: "SKU-L1", thumb: "" } },
    { id: "l2",  pitch: 18.0, yaw: -80.0,  sizeClass: "frame-sm-l", meta: { title: "Left Alcove Top Accent Wide", sku: "SKU-L2", thumb: "" } },
    { id: "l3",  pitch: 6.0,  yaw: -95.0,  sizeClass: "frame-md-p", meta: { title: "Left Alcove Mid Focal Portrait", sku: "SKU-L3", thumb: "" } },
    { id: "l4",  pitch: 6.0,  yaw: -80.0,  sizeClass: "frame-md-p", meta: { title: "Left Alcove Entry Side Print", sku: "SKU-L4", thumb: "" } },
    { id: "l5",  pitch: -6.0, yaw: -95.0,  sizeClass: "frame-lg-l", meta: { title: "Left Main Gallery Landscape", sku: "SKU-L5", thumb: "" } },
    { id: "l6",  pitch: -6.0, yaw: -80.0,  sizeClass: "frame-lg-l", meta: { title: "Left Side Showcase Landscape", sku: "SKU-L6", thumb: "" } },
    { id: "l7",  pitch: -18.0, yaw: -95.0, sizeClass: "frame-sq",   meta: { title: "Left Alcove Base Level Square", sku: "SKU-L7", thumb: "" } },
    { id: "l8",  pitch: -18.0, yaw: -80.0, sizeClass: "frame-sq",   meta: { title: "Left Lounge Side Square Matte", sku: "SKU-L8", thumb: "" } }
];

// 2. Initialize the WebGL 360 Engine instance
const viewer = pannellum.viewer('panorama-viewer', {
    "type": "equirectangular",
    "panorama": "avagallery.jpeg", 
    "autoLoad": true,
    "compass": false,
    "showControls": false,
    "hotSpotDebug": true, // Displays central calibration crosshair layout trackers
    
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
            
            // Connect to our verified center-view autofocus handler
            "clickHandlerFunc": injectMetaAndZoomFlow,
            "clickHandlerArgs": { 
                "frameId": frame.id,
                "coordPitch": frame.pitch, 
                "coordYaw": frame.yaw,
                "productMeta": frame.meta
            }
        });
    });
});

/**
 * 4. HYBRID INTERCEPT CONTROLLER
 * Handles smooth movement, sets textual values, and triggers the modal overlay class
 */
function injectMetaAndZoomFlow(event, args) {
    console.log(`User selected Node Target: [ ${args.frameId.toUpperCase()} ]. Focus sequence initiated...`);

    // A. Perform cinematic center alignment screen snap zoom track
    viewer.lookAt(
        args.coordPitch, 
        args.coordYaw,   
        38,              
        1100,            
        
        // B. ARRIVAL HANDOFF: Updates labels right on camera arrival
        function() {
            const data = args.productMeta;
            
            // Look up your pre-made HTML element placeholders
            const domTitle = document.getElementById('conf-title');
            const domSku = document.getElementById('conf-sku');
            const domImg = document.getElementById('conf-img');
            
            if (domTitle) domTitle.innerText = data.title;
            if (domSku) domSku.innerText = data.sku;
            
            // Clear standard thumb src string values to prevent 404 image errors
            if (domImg) domImg.src = ""; 

            // Un-hides your modal using your exact pre-made CSS configuration state rules (.open)
            const orderOverlay = document.getElementById('order-overlay');
            if (orderOverlay) {
                orderOverlay.classList.add('open'); 
            }
        }
    );
}

/**
 * 5. PERSPECTIVE RESET DOCK
 * Connects smoothly to your close action button: onclick="closeModal()"
 */
function closeModal() {
    console.log("Exiting template configuration panel. Resetting standard viewing field...");
    
    const orderOverlay = document.getElementById('order-overlay');
    if (orderOverlay) {
        orderOverlay.classList.remove('open');
    }

    // Zoom out smoothly back to normal full-room wide perspective
    viewer.setHfov(85, 1000);
}

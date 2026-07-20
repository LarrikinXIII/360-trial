/**
 * AVA XIN | 360 Gallery Master Virtual Tour Engine
 */

// 1. Your Hotspot matrix (Keep it exactly as you have it)
const tourHotspotMatrix = [
    { 
        id: "f1", pitch: 18.5, yaw: -32.0, sizeClass: "frame-sm-p",
        meta: { title: "Classic Family Studio Canvas", sku: "SKU-F1", thumb: "" } // Kept blank to avoid 404 image errors!
    },
    { 
        id: "f2", pitch: 16.0, yaw: -20.5, sizeClass: "frame-md-l",
        meta: { title: "Premium Landscape Accent Canvas", sku: "SKU-F2", thumb: "" }
    },
    { 
        id: "f3", pitch: -2.5, yaw: -29.5, sizeClass: "frame-lg-p",
        meta: { title: "Grand Gallery Portrait Canvas", sku: "SKU-F3", thumb: "" }
    },
    { 
        id: "r12", pitch: -22.0, yaw: 98.0, sizeClass: "frame-sm-p",
        meta: { title: "Split-Panel Luxury Multi-Print", sku: "SKU-R12", thumb: "" }
    }
    // ... rest of your 38 hotspots remain exactly here
];

// 2. Initialize the WebGL 360 Engine instance
const viewer = pannellum.viewer('panorama-viewer', {
    "type": "equirectangular",
    "panorama": "avagallery.jpeg", 
    "autoLoad": true,
    "compass": false,
    "showControls": false,
    "hotSpotDebug": true, // Kept true for debugging coordinates
    "hfov": 60,       
    "minHfov": 30,    
    "maxHfov": 75     
});

// 3. Mount hotspots programmatically on canvas complete load
viewer.on('load', function() {
    console.log("360 environment loaded. Injecting 38 target containers...");
    
    tourHotspotMatrix.forEach(function(frame) {
        const productMeta = frame.meta || { 
            title: `Product Gallery Frame ${frame.id.toUpperCase()}`, 
            sku: `SKU-${frame.id.toUpperCase()}`, 
            thumb: "" 
        };

        viewer.addHotSpot({
            "id": frame.id,
            "pitch": frame.pitch,
            "yaw": frame.yaw,
            "type": "info",
            "cssClass": `invisible-hotspot-target ${frame.sizeClass}`,
            
            /* 🚀 FIXES THE CRASH: This name MUST match the function declaration below exactly! */
            "clickHandlerFunc": injectMetaAndZoomFlow,
            "clickHandlerArgs": { 
                "frameId": frame.id,
                "coordPitch": frame.pitch, 
                "coordYaw": frame.yaw,
                "productMeta": productMeta
            }
        });
    });
});

/**
 * 4. HYBRID INTERCEPT CONTROLLER
 * This is the exact function JavaScript couldn't find in your screenshot!
 */
function injectMetaAndZoomFlow(event, args) {
    console.log(`User selected Node Target: [ ${args.frameId.toUpperCase()} ]. Focus sequence initiated...`);

    // A. Perform the cinematic 3D center focus and screen snap zoom
    viewer.lookAt(
        args.coordPitch, 
        args.coordYaw,   
        38,              
        1100,            
        
        // B. ARRIVAL HANDOFF: Fires automatically upon camera focus arrival
        function() {
            const data = args.productMeta;
            
            // Grabs your specific custom HTML input element references
            const domTitle = document.getElementById('conf-title');
            const domSku = document.getElementById('conf-sku');
            const domImg = document.getElementById('conf-img');
            
            // Updates contents safely based on your current data entries
            if (domTitle) domTitle.innerText = data?.title || `Product Gallery Frame ${args.frameId.toUpperCase()}`;
            if (domSku) domSku.innerText = data?.sku || `SKU-${args.frameId.toUpperCase()}`;
            
            // Only swap image if path is not blank to prevent 404 crashes
            if (domImg && data?.thumb) {
                domImg.src = data.thumb;
            } else if (domImg) {
                domImg.src = ""; // Clear if empty placeholder
            }

            // Un-hides your modal layer using your exact CSS design transition class (.open)
            const orderOverlay = document.getElementById('order-overlay');
            if (orderOverlay) {
                orderOverlay.classList.add('open'); 
            }
        }
    );
}

/**
 * 5. Connected Perspective Reset Anchor
 */
function closeModal() {
    console.log("Exiting template configuration panel. Resetting standard viewing field...");
    
    const orderOverlay = document.getElementById('order-overlay');
    if (orderOverlay) {
        orderOverlay.classList.remove('open');
    }

    viewer.setHfov(85, 1000);
}

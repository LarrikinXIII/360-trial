/**
 * AVA XIN | 360 Gallery Core View Engine
 * Isolated Viewport - Zero Hotspots Installed
 */

// Initialize the programmatic WebGL 360 viewer instance
const viewer = pannellum.viewer('panorama-viewer', {
    "type": "equirectangular",
    "panorama": "avagallery.jpeg", // Links directly to your uploaded asset texture
    "autoLoad": true,
    "compass": false,
    "showControls": false,
    "hotSpotDebug": true, // Displays the central calibration crosshair (+) to help map future locations
    
    /* 📐 Perspective Correction Controls */
    "hfov": 60,       // Sets the standard lens width for natural 90-degree corners
    "minHfov": 30,    // Sets the limit on how close a user can zoom in
    "maxHfov": 75     // Hard stop preventing fish-eye squeezing on zoom-out
});

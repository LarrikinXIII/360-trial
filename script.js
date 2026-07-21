 * AVA XIN | 360 Gallery Master Virtual Tour Engine
 * Complete 38-Hotspot Production Pipeline
 */

const DEBUG_HOTSPOTS = true;
// 1. Data Matrix containing your custom product configurations for all 38 hotspots
const tourHotspotMatrix = [
    // ======= WINDOW WALL (F1 to F10) =======
@@ -68,14 +68,33 @@ const viewer = pannellum.viewer('panorama-viewer', {
// 3. Mount hotspots programmatically on canvas complete load
viewer.on('load', function() {
    console.log("360 environment loaded. Injecting 38 target containers...");

    viewer.addHotSpot({
    pitch: 0,
    yaw: 0,
    type: "info",
    text: "CENTER",

    cssClass: "debug-hotspot",

    clickHandlerFunc: function(){
        alert("Center hotspot works.");
    }
});

    tourHotspotMatrix.forEach(function(frame) {
        viewer.addHotSpot({
            "id": frame.id,
            "pitch": frame.pitch,
            "yaw": frame.yaw,
            "type": "info",
            "cssClass": `invisible-hotspot-target ${frame.sizeClass}`,
            cssClass: DEBUG_HOTSPOTS
    ? `debug-hotspot ${frame.sizeClass}`
    : `invisible-hotspot-target ${frame.sizeClass}`,

text: DEBUG_HOTSPOTS
    ? frame.id.toUpperCase()
    : "",
            "clickHandlerFunc": injectMetaAndZoomFlow,
            "clickHandlerArgs": { 
                "targetKey": frame.id.toUpperCase(), 
@@ -84,6 +103,9 @@ viewer.on('load', function() {
            }
        });
    });

        console.log("Finished creating hotspots.");

});

/**

/**
 * Standalone Immersive 360 Spherical Engine Viewer Component
 */
(function() {
    "use strict";
    console.log("[LOCAL-ENGINE] Synthesizing pure 360 spherical canvas context...");

    window.pannellum = (function() {
        var lib = {};

        lib.viewer = function(container, config) {
            var el = typeof container === "string" ? document.getElementById(container) : container;
            if (!el) throw new Error("Target view container missing.");
            
            el.innerHTML = "";
            el.style.position = "relative";
            el.style.overflow = "hidden";

            var canvas = document.createElement("canvas");
            canvas.style.width = "100%"; canvas.style.height = "100%";
            canvas.style.display = "block";
            el.appendChild(canvas);

            var ctx = canvas.getContext("2d");
            var img = new Image();
            
            var pitch = config.pitch || 0;
            var yaw = config.yaw || 0;
            var hfov = config.hfov || 110;

            img.onload = function() {
                drawScene();
            };
            img.src = config.panorama;

            function drawScene() {
                if (!ctx || !img.complete) return;

                var w = canvas.width = canvas.clientWidth;
                var h = canvas.height = canvas.clientHeight;
                if (w === 0 || h === 0) return;

                // Create a blank image buffer data layer to reproject pixels into a 3D bubble
                var imgData = ctx.createImageData(w, h);
                var data = imgData.data;

                // Calculate Field of View math constraints
                var fovRad = (hfov * Math.PI) / 180;
                var dist = (w / 2) / Math.tan(fovRad / 2);

                var rYaw = (yaw * Math.PI) / 180;
                var rPitch = (pitch * Math.PI) / 180;

                var cosP = Math.cos(rPitch), sinP = Math.sin(rPitch);
                var cosY = Math.cos(rYaw), sinY = Math.sin(rYaw);

                var pW = img.width;
                var pH = img.height;

                // Create a temporary canvas tracking point to query original unwarped image pixels securely
                var srcCanvas = document.createElement("canvas");
                srcCanvas.width = pW; srcCanvas.height = pH;
                var srcCtx = srcCanvas.getContext("2d");
                srcCtx.drawImage(img, 0, 0);
                var srcData = srcCtx.getImageData(0, 0, pW, pH).data;

                // Core Spherical Trigonometric Projection Loop
                // Loops through every pixel on the screen and warps it onto a 3D sphere coordinate plane
                for (var y = 0; y < h; y++) {
                    var dy = y - h / 2;
                    for (var x = 0; x < w; x++) {
                        var dx = x - w / 2;

                        // Calculate 3D Ray vector angles pointing out from the screen plane
                        var nx = dx;
                        var ny = dy;
                        var nz = dist;

                        // Rotate camera vertically (Pitch axis tracking)
                        var y1 = ny * cosP - nz * sinP;
                        var z1 = ny * sinP + nz * cosP;

                        // Rotate camera horizontally (Yaw axis tracking)
                        var x2 = nx * cosY - z1 * sinY;
                        var z2 = nx * sinY + z1 * cosY;

              // FIND LINE 90-91 INSIDE THE LOOP:
                        var lon = Math.atan2(x2, z2);
                        var lat = Math.atan2(y1, Math.sqrt(x2 * x2 + z2 * z2));

                        // CHANGE THE "v" CALCULATION TO THIS TO FLIP IT RIGHT-SIDE UP:
                        var u = Math.floor(((lon + Math.PI) / (2 * Math.PI)) * pW);
                        var v = Math.floor(((lat + Math.PI / 2) / Math.PI) * pH);
                        
                        // Clamp values to keep calculations inside bounds
                        if (u < 0) u = 0; if (u >= pW) u = pW - 1;
                        if (v < 0) v = 0; if (v >= pH) v = pH - 1;

                        var destIdx = (y * w + x) * 4;
                        var srcIdx = (v * pW + u) * 4;

                        data[destIdx] = srcData[srcIdx];
                        data[destIdx + 1] = srcData[srcIdx + 1];
                        data[destIdx + 2] = srcData[srcIdx + 2];
                        data[destIdx + 3] = 255;
                    }
                }

                ctx.putImageData(imgData, 0, 0);
                updateHotspots(w, h, fovRad, dist, rYaw, rPitch);
            }

            var uiContainer = document.createElement("div");
            uiContainer.style.position = "absolute"; uiContainer.style.top = "0"; uiContainer.style.left = "0";
            uiContainer.style.width = "100%"; uiContainer.style.height = "100%";
            uiContainer.style.pointerEvents = "none";
            el.appendChild(uiContainer);

            if (config.hotSpots) {
                config.hotSpots.forEach(function(sp) {
                    var btn = document.createElement("div");
                    btn.className = sp.cssClass || "custom-hotspot";
                    btn.style.position = "absolute"; btn.style.pointerEvents = "auto";
                    if (sp.clickHandlerFunc) btn.addEventListener("click", sp.clickHandlerFunc);
                    uiContainer.appendChild(btn);
                    sp._node = btn;
                });
            }

            function updateHotspots(w, h, fovRad, dist, rYaw, rPitch) {
                if (!config.hotSpots) return;
                var cx = w / 2, cy = h / 2;

                config.hotSpots.forEach(function(sp) {
                    if (!sp._node) return;

                    // Convert hotspot coordinates to radians
                    var hLon = (sp.yaw * Math.PI) / 180;
                    var hLat = (sp.pitch * Math.PI) / 180;

                    // Project the hotspot vectors into 3D camera tracking rotation matrices
                    var x = Math.cos(hLat) * Math.sin(hLon - rYaw);
                    var y = Math.sin(hLat) * Math.cos(rPitch) - Math.cos(hLat) * Math.sin(rPitch) * Math.cos(hLon - rYaw);
                    var z = Math.sin(hLat) * Math.sin(rPitch) + Math.cos(hLat) * Math.cos(rPitch) * Math.cos(hLon - rYaw);

                    // If the node is in front of the camera, calculate its position on screen
                    if (z > 0) {
                        var screenX = cx + (x * dist) / z;
                        var screenY = cy - (y * dist) / z; // Fixed vertical movement tracking direction

                        if (screenX >= 0 && screenX <= w && screenY >= 0 && screenY <= h) {
                            sp._node.style.display = "block";
                            sp._node.style.left = screenX + "px";
                            sp._node.style.top = screenY + "px";
                            sp._node.style.transform = "translate(-50%, -50%)";
                            return;
                        }
                    }
                    sp._node.style.display = "none";
                });
            }

            var isDragging = false, lastX, lastY;
            canvas.addEventListener("mousedown", function(e) { isDragging = true; lastX = e.clientX; lastY = e.clientY; });
            window.addEventListener("mouseup", function() { isDragging = false; });
            window.addEventListener("mousemove", function(e) {
                if (!isDragging) return;
                
                var dx = e.clientX - lastX;
                var dy = e.clientY - lastY;
                
                lastX = e.clientX; lastY = e.clientY;

                // Calibrate dragging speed multipliers for smooth panning
                yaw -= dx * 0.15;
                pitch += dy * 0.15;

                pitch = Math.max(-85, Math.min(85, pitch));
                drawScene();
            });

            canvas.addEventListener("wheel", function(e) {
                e.preventDefault();
                if (e.deltaY > 0) {
                    hfov += 5;
                } else {
                    hfov -= 5;
                }
                hfov = Math.max(40, Math.min(120, hfov));
                drawScene();
            }, { passive: false });

            window.addEventListener("resize", drawScene);
            return { render: drawScene };
        };

        return lib;
    })();

    window.dispatchEvent(new Event('pannellumLibraryReady'));
})();

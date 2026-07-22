/**
 * Standalone Offline Stable Panorama Engine Layout Builder
 */
(function() {
    "use strict";
    console.log("[LOCAL-ENGINE] Synthesizing pure local 3D rendering context...");

    window.pannellum = (function() {
        var lib = {};

        lib.viewer = function(container, config) {
            var el = typeof container === "string" ? document.getElementById(container) : container;
            if (!el) throw new Error("Target canvas container missing.");
            
            el.innerHTML = "";
            el.style.position = "relative";
            el.style.overflow = "hidden";

            // Create background canvas render projection surface
            var canvas = document.createElement("canvas");
            canvas.style.width = "100%"; canvas.style.height = "100%";
            canvas.style.display = "block";
            el.appendChild(canvas);

            var ctx = canvas.getContext("2d");
            var img = new Image();
            
            // Camera position variables matching global navigation properties
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

                ctx.clearRect(0, 0, w, h);

                // Calculate horizontal slicing parameters based on current camera pan angle
                var scrollX = ((yaw * 5) % w);
                if (scrollX < 0) scrollX += w;

                // Adjust vertical translation offset tracking properties
                var scrollY = (pitch * 5) + (h / 2) - (img.height / 2);

                // Render looping background landscape image layers
                ctx.drawImage(img, -scrollX, scrollY, w, h);
                ctx.drawImage(img, w - scrollX, scrollY, w, h);
                ctx.drawImage(img, -w - scrollX, scrollY, w, h);

                updateHotspots(w, h, scrollX, scrollY);
            }

            // Create interface overlay division panel layer to host hotspot elements
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

            function updateHotspots(w, h, scrollX, scrollY) {
                if (!config.hotSpots) return;
                config.hotSpots.forEach(function(sp) {
                    if (!sp._node) return;

                    // Standard horizontal lock calculations 
                    var targetX = (w / 2) + (sp.yaw * 5) - (yaw * 5);
                    
                    // FIXED: Corrected directional sign mapping to eliminate inverted movement bugs
                    var targetY = (h / 2) - (sp.pitch * 5) + (pitch * 5);

                    // Ensure coordinates wrap around naturally when panning in circles
                    while (targetX < 0) targetX += w;
                    while (targetX > w) targetX -= w;

                    sp._node.style.display = "block";
                    sp._node.style.left = targetX + "px";
                    sp._node.style.top = targetY + "px";
                    sp._node.style.transform = "translate(-50%, -50%)";
                });
            }

            // Navigation Drag-to-Pan interactive controller event listeners
            var isDragging = false, lastX, lastY;
            canvas.addEventListener("mousedown", function(e) { isDragging = true; lastX = e.clientX; lastY = e.clientY; });
            window.addEventListener("mouseup", function() { isDragging = false; });
            window.addEventListener("mousemove", function(e) {
                if (!isDragging) return;
                
                var deltaX = e.clientX - lastX;
                var deltaY = e.clientY - lastY;
                
                lastX = e.clientX; lastY = e.clientY;

                // Increments parameters correctly matching standard drag directions
                yaw += deltaX * 0.5;
                pitch += deltaY * 0.5;

                pitch = Math.max(-80, Math.min(80, pitch));
                drawScene();
            });

            // Interactive scroll-wheel field of view zoom handler loop
            canvas.addEventListener("wheel", function(e) {
                e.preventDefault();
                if (e.deltaY > 0) {
                    hfov += 4;
                } else {
                    hfov -= 4;
                }
                hfov = Math.max(50, Math.min(130, hfov));
                drawScene();
            }, { passive: false });

            window.addEventListener("resize", drawScene);
            return { render: drawScene };
        };

        return lib;
    })();

    window.dispatchEvent(new Event('pannellumLibraryReady'));
})();

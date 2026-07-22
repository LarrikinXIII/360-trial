/**
 * Pannellum 2.5.6 Core 3D Engine Architecture
 * Batch 1 of 3: Graphics Pipeline Math & Environment Init
 */
window.pannellum = (function() {
    "use strict";
    var lib = {};

    function mat4Multiply(out, a, b) {
        var a00=a[0], a01=a[1], a02=a[2], a03=a[3], a10=a[4], a11=a[5], a12=a[6], a13=a[7],
            a20=a[8], a21=a[9], a22=a[10], a23=a[11], a30=a[12], a31=a[13], a32=a[14], a33=a[15];
        var b0=b[0], b1=b[1], b2=b[2], b3=b[3];
        out[0]=b0*a00+b1*a10+b2*a20+b3*a30; out[1]=b0*a01+b1*a11+b2*a21+b3*a31;
        out[2]=b0*a02+b1*a12+b2*a22+b3*a32; out[3]=b0*a03+b1*a13+b2*a23+b3*a33;
        b0=b[4]; b1=b[5]; b2=b[6]; b3=b[7];
        out[4]=b0*a00+b1*a10+b2*a20+b3*a30; out[5]=b0*a01+b1*a11+b2*a21+b3*a31;
        out[6]=b0*a02+b1*a12+b2*a22+b3*a32; out[7]=b0*a03+b1*a13+b2*a23+b3*a33;
        b0=b[8]; b1=b[9]; b2=b[10]; b3=b[11];
        out[8]=b0*a00+b1*a10+b2*a20+b3*a30; out[9]=b0*a01+b1*a11+b2*a21+b3*a31;
        out[10]=b0*a02+b1*a12+b2*a22+b3*a32; out[11]=b0*a03+b1*a13+b2*a23+b3*a33;
        b0=b[12]; b1=b[13]; b2=b[14]; b3=b[15];
        out[12]=b0*a00+b1*a10+b2*a20+b3*a30; out[13]=b0*a01+b1*a11+b2*a21+b3*a31;
        out[14]=b0*a02+b1*a12+b2*a22+b3*a32; out[15]=b0*a03+b1*a13+b2*a23+b3*a33;
    }

    lib.viewer = function(container, config) {
        var el = typeof container === "string" ? document.getElementById(container) : container;
        if (!el) throw new Error("Target missing.");
        
        el.innerHTML = "";
        el.style.position = "relative";
        el.style.backgroundColor = "#000";
        el.style.overflow = "hidden";

        var canvas = document.createElement("canvas");
        canvas.style.width = "100%"; canvas.style.height = "100%";
        canvas.style.display = "block"; el.appendChild(canvas);

        var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!gl) { el.innerHTML = "<p style='color:white;padding:20px;'>WebGL Blocked</p>"; return; }

        var vsSource = "attribute vec3 a_pos; uniform mat4 u_mvp; varying vec3 v_pos; void main() { v_pos = a_pos; gl_Position = u_mvp * vec4(a_pos, 1.0); }";
        var fsSource = "precision mediump float; uniform sampler2D u_tex; varying vec3 v_pos; void main() { float lon = atan(v_pos.x, -v_pos.z); float lat = atan(v_pos.y, length(v_pos.xz)); vec2 uv = vec2(lon / (2.0 * 3.14159265) + 0.5, lat / 3.14159265 + 0.5); gl_FragColor = texture2D(u_tex, uv); }";

        var vs = gl.createShader(gl.VERTEX_SHADER); gl.shaderSource(vs, vsSource); gl.compileShader(vs);
        var fs = gl.createShader(gl.FRAGMENT_SHADER); gl.shaderSource(fs, fsSource); gl.compileShader(fs);

        var prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog); gl.useProgram(prog);

        var vertices = [], indices = [];
        var latBands = 30, lonBands = 30, radius = 2;
        for (var latNum = 0; latNum <= latBands; latNum++) {
            var theta = latNum * Math.PI / latBands;
            var sinTheta = Math.sin(theta), cosTheta = Math.cos(theta);
            for (var lonNum = 0; lonNum <= lonBands; lonNum++) {
                var phi = lonNum * 2 * Math.PI / lonBands;
                vertices.push(radius * sinTheta * Math.sin(phi), radius * cosTheta, radius * sinTheta * Math.cos(phi));
            }
        }
        for (var latNum = 0; latNum < latBands; latNum++) {
            for (var lonNum = 0; lonNum < lonBands; lonNum++) {
                var first = (latNum * (lonBands + 1)) + lonNum;
                var second = first + lonBands + 1;
                indices.push(first, second, first + 1, second, second + 1, first + 1);
            }
        }

        var vbo = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vbo); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        var posAttr = gl.getAttribLocation(prog, "a_pos"); gl.enableVertexAttribArray(posAttr); gl.vertexAttribPointer(posAttr, 3, gl.FLOAT, false, 0, 0);

        var ibo = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

                var texture = gl.createTexture();
        var img = new Image();
        img.onload = function() {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            drawScene();
        };
        img.src = config.panorama;

        var pitch = config.pitch || 0, yaw = config.yaw || 0;
        var mvpLoc = gl.getUniformLocation(prog, "u_mvp");

        function drawScene() {
            var w = canvas.clientWidth, h = canvas.clientHeight;
            if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
            var aspect = w / h;
            var f = 1.0 / Math.tan((config.hfov || 110) * Math.PI / 360.0);
            var proj = [f/aspect,0,0,0, 0,f,0,0, 0,0,-1,-1, 0,0,0,0];
            var cosP = Math.cos(pitch), sinP = Math.sin(pitch);
            var rotP = [1,0,0,0, 0,cosP,sinP,0, 0,-sinP,cosP,0, 0,0,0,1];
            var cosY = Math.cos(yaw), sinY = Math.sin(yaw);
            var rotY = [cosY,0,-sinY,0, 0,1,0,0, sinY,0,cosY,0, 0,0,0,1];
            var modelView = new Float32Array(16); mat4Multiply(modelView, rotP, rotY);
            var mvp = new Float32Array(16); mat4Multiply(mvp, proj, modelView);
            gl.uniformMatrix4fv(mvpLoc, false, mvp);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
            updateHotspots();
        }

        var uiContainer = document.createElement("div");
        uiContainer.style.position = "absolute"; uiContainer.style.top = "0"; uiContainer.style.left = "0";
        uiContainer.style.width = "100%"; uiContainer.style.height = "100%"; uiContainer.style.pointerEvents = "none";
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

                function updateHotspots() {
            var cx = canvas.width / 2, cy = canvas.height / 2;
            config.hotSpots.forEach(function(sp) {
                if (!sp._node) return;
                
                var hLon = (sp.yaw || 0) * Math.PI / 180;
                var hLat = (sp.pitch || 0) * Math.PI / 180;
                
                var x = Math.cos(hLat) * Math.sin(hLon - yaw);
                var y = Math.sin(hLat) * Math.cos(pitch) - Math.cos(hLat) * Math.sin(pitch) * Math.cos(hLon - yaw);
                var z = Math.sin(hLat) * Math.sin(pitch) + Math.cos(hLat) * Math.cos(pitch) * Math.cos(hLon - yaw);
                
                if (z > 0) {
                    var f = 1.0 / Math.tan((config.hfov || 110) * Math.PI / 360.0);
                    var aspect = canvas.width / canvas.height;
                    
                    var screenX = cx + (x * f / aspect / z) * cx;
                    var screenY = cy + (y * f / z) * cy; 
                    
                    sp._node.style.display = "block";
                    sp._node.style.left = screenX + "px";
                    sp._node.style.top = screenY + "px";
                    sp._node.style.transform = "translate(-50%, -50%)"; 
                } else {
                    sp._node.style.display = "none";
                }
            });
        }

       // Universal Touch & High-DPI Desktop/Mobile Track Engine
        var isDragging = false, lastX, lastY;
        
        // --- 1. DESKTOP MOUSE LISTENERS ---
        canvas.addEventListener("mousedown", function(e) { 
            isDragging = true; lastX = e.clientX; lastY = e.clientY; 
        });
        window.addEventListener("mouseup", function() { isDragging = false; });
        window.addEventListener("mousemove", function(e) {
            if (!isDragging) return;
            yaw -= (e.clientX - lastX) * 0.005; pitch += (e.clientY - lastY) * 0.005;
            lastX = e.clientX; lastY = e.clientY;
            pitch = Math.max(-Math.PI/2.2, Math.min(Math.PI/2.2, pitch));
            drawScene();
        });

        // --- 2. MOBILE PHONE TOUCH LISTENERS (PANNING & PINCH-TO-ZOOM) ---
        var initialPinchDistance = null;

        canvas.addEventListener("touchstart", function(e) {
            if (e.touches.length === 1) {
                isDragging = true; 
                lastX = e.touches[0].clientX; 
                lastY = e.touches[0].clientY;
                initialPinchDistance = null;
            } else if (e.touches.length === 2) {
                isDragging = false; // Stop dragging when pitching/zooming
                // Measures space between finger 0 and finger 1
                var dx = e.touches[0].clientX - e.touches[1].clientX;
                var dy = e.touches[0].clientY - e.touches[1].clientY;
                initialPinchDistance = Math.sqrt(dx * dx + dy * dy);
            }
        }, { passive: true });

        window.addEventListener("touchend", function() { 
            isDragging = false; 
            initialPinchDistance = null; 
        });
        
        canvas.addEventListener("touchmove", function(e) {
            // One finger controls looking around
            if (e.touches.length === 1 && isDragging) {
                var deltaX = e.touches[0].clientX - lastX;
                var deltaY = e.touches[0].clientY - lastY;
                
                lastX = e.touches[0].clientX; 
                lastY = e.touches[0].clientY;

                yaw -= deltaX * 0.005; 
                pitch += deltaY * 0.005; 
                
                pitch = Math.max(-Math.PI/2.2, Math.min(Math.PI/2.2, pitch));
                drawScene();
            } 
            // Two fingers control pinching to zoom
            else if (e.touches.length === 2) {
                var dx = e.touches[0].clientX - e.touches[1].clientX;
                var dy = e.touches[0].clientY - e.touches[1].clientY;
                var currentPinchDistance = Math.sqrt(dx * dx + dy * dy);

                if (initialPinchDistance) {
                    var pinchChange = currentPinchDistance - initialPinchDistance;
                    config.hfov -= pinchChange * 0.15; // Adjusts 3D Field of View
                    config.hfov = Math.max(50, Math.min(130, config.hfov));
                    drawScene();
                }
                initialPinchDistance = currentPinchDistance;
            }
        }, { passive: true });

        // --- 3. UNIVERSAL SCROLL & ZOOM CONTROLS ---
        canvas.addEventListener("wheel", function(e) {
            e.preventDefault();
            if (e.deltaY > 0) { config.hfov += 4; } else { config.hfov -= 4; }
            config.hfov = Math.max(50, Math.min(130, config.hfov));
            drawScene();
        }, { passive: false });

        // --- 4. HIGH-DPI DEVICE RESOLUTION RETINA OVERRIDE MODIFIERS ---
        window.addEventListener("resize", function() {
            // Adjusts internal canvas coordinates on mobile screens automatically
            var dpr = window.devicePixelRatio || 1;
            canvas.width = canvas.clientWidth * dpr;
            canvas.height = canvas.clientHeight * dpr;
            drawScene();
        });
        
        return { render: drawScene };
    };

    return lib;
})();

window.dispatchEvent(new Event('pannellumLibraryReady'));

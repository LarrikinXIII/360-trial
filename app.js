console.log("[APP] Executing virtual tour control modules...");

let isModalActive = false;
let panoramaViewer = null;

if (window.pannellum) {
    buildVirtualTourViewer();
} else {
    window.addEventListener('pannellumLibraryReady', buildVirtualTourViewer);
}

function buildVirtualTourViewer() {
    console.log("[APP] Core engine validated. Syncing elements...");

    const modal = document.getElementById('mediaModal');
    const closeBtn = document.getElementById('closeModal');
    const modalAudio = document.getElementById('modalAudio'); 
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtext = document.getElementById('modalSubtext');
    const modalImage = document.getElementById('modalImage');
    const modalImageShell = document.getElementById('modalImageShell');
    const audioSource = document.getElementById('audioSource');

    const globalAudio = document.getElementById('globalAmbientAudio');
    const globalAudioToggle = document.getElementById('globalAudioToggle');
    const gyroBtn = document.getElementById('gyro-btn');
    let panoramaPrevGyro = false;

    function isTouchZoomSurface(target) {
        if (!target) return false;
        return Boolean(target.closest && (
            target.closest('#panorama') ||
            target.closest('.modal-image-shell') ||
            target.closest('#modalImage')
        ));
    }

    document.addEventListener('wheel', function (event) {
        if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
        }
    }, { passive: false });

    document.addEventListener('keydown', function (event) {
        if ((event.ctrlKey || event.metaKey) && ['+', '-', '=', '0'].includes(event.key)) {
            event.preventDefault();
        }
    });

    document.addEventListener('gesturestart', function (event) {
        event.preventDefault();
    }, { passive: false });

    document.addEventListener('touchmove', function (event) {
        if (!isTouchZoomSurface(event.target)) {
            event.preventDefault();
        }
    }, { passive: false });

    // Modal subtext auto-scroll with user control
    let modalSubtextScrollIdleTimer = null;
    let modalSubtextAnimationId = null;
    const SUBTEXT_IDLE_DELAY = 3000; // Resume auto-scroll after 3 seconds of idle
    const SUBTEXT_SCROLL_SPEED = 1; // pixels per frame (adjust for scroll speed)

    function animateSubtextScroll() {
        if (!modalSubtext || modalSubtext.classList.contains('paused')) {
            modalSubtextAnimationId = null;
            return;
        }

        // Auto-scroll: increment scrollTop
        const maxScroll = modalSubtext.scrollHeight - modalSubtext.clientHeight;
        if (modalSubtext.scrollTop < maxScroll) {
            modalSubtext.scrollTop += SUBTEXT_SCROLL_SPEED;
            modalSubtextAnimationId = requestAnimationFrame(animateSubtextScroll);
        } else {
            // Reset to top when reaching bottom
            modalSubtext.scrollTop = 0;
            modalSubtextAnimationId = requestAnimationFrame(animateSubtextScroll);
        }
    }

    function resumeSubtextAutoScroll() {
        if (modalSubtext) {
            modalSubtext.classList.remove('paused');
            if (!modalSubtextAnimationId) {
                animateSubtextScroll();
            }
        }
    }

    function pauseSubtextAutoScroll() {
        if (modalSubtext) {
            modalSubtext.classList.add('paused');
        }
        // Clear existing timer
        if (modalSubtextScrollIdleTimer) {
            clearTimeout(modalSubtextScrollIdleTimer);
        }
        // Set new idle timer to resume auto-scroll
        modalSubtextScrollIdleTimer = setTimeout(resumeSubtextAutoScroll, SUBTEXT_IDLE_DELAY);
    }

    if (modalSubtext) {
        // Pause on wheel scroll
        modalSubtext.addEventListener('wheel', function (event) {
            pauseSubtextAutoScroll();
        }, { passive: true });

        // Pause on touch/mouse interactions
        modalSubtext.addEventListener('mousedown', function (event) {
            pauseSubtextAutoScroll();
        }, { passive: true });

        modalSubtext.addEventListener('pointerdown', function (event) {
            pauseSubtextAutoScroll();
        }, { passive: true });

        modalSubtext.addEventListener('touchstart', function (event) {
            pauseSubtextAutoScroll();
        }, { passive: true });

        // Listen for any scroll events
        modalSubtext.addEventListener('scroll', function (event) {
            pauseSubtextAutoScroll();
        }, { passive: true });

        // Start auto-scroll animation
        resumeSubtextAutoScroll();
    }

    let modalImageZoom = 1;
    let modalImageZoomStartDistance = null;
    let modalImageZoomStartScale = 1;
    let modalImageOffsetX = 0;
    let modalImageOffsetY = 0;
    let modalImageDragStartX = null;
    let modalImageDragStartY = null;
    let modalImageDragOffsetX = 0;
    let modalImageDragOffsetY = 0;
    let isModalImageInteracting = false;

    function resetModalImageZoom() {
        modalImageZoom = 1;
        modalImageOffsetX = 0;
        modalImageOffsetY = 0;
        if (modalImage) {
            modalImage.style.transform = 'scale(1) translate(0, 0)';
            modalImage.style.transformOrigin = 'center center';
            modalImage.style.transition = 'transform 0.3s ease';
        }
    }

    function applyModalImageZoom(nextScale) {
        if (!modalImage) return;
        modalImageZoom = Math.min(3, Math.max(1, nextScale));
        updateModalImageTransform();
    }

    function updateModalImageTransform() {
        if (!modalImage) return;
        modalImage.style.transform = `scale(${modalImageZoom}) translate(${modalImageOffsetX}px, ${modalImageOffsetY}px)`;
    }

    function dimModalSubtext(dim) {
        if (!modalSubtext) return;
        if (dim) {
            modalSubtext.classList.add('dimmed');
        } else {
            modalSubtext.classList.remove('dimmed');
        }
    }

    if (modalImage) {
        modalImage.addEventListener('wheel', function (event) {
            event.preventDefault();
            event.stopPropagation();
            const delta = event.deltaY > 0 ? -0.08 : 0.08;
            applyModalImageZoom(modalImageZoom + delta);
            dimModalSubtext(true);
        }, { passive: false });

        modalImage.addEventListener('dblclick', function (event) {
            event.preventDefault();
            event.stopPropagation();
            resetModalImageZoom();
            dimModalSubtext(false);
        });

        // Mouse drag handling
        modalImage.addEventListener('mousedown', function (event) {
            if (modalImageZoom > 1) {
                event.preventDefault();
                isModalImageInteracting = true;
                modalImageDragStartX = event.clientX;
                modalImageDragStartY = event.clientY;
                modalImageDragOffsetX = modalImageOffsetX;
                modalImageDragOffsetY = modalImageOffsetY;
                modalImage.style.transition = 'none';
                dimModalSubtext(true);
            }
        }, { passive: false });

        document.addEventListener('mousemove', function (event) {
            if (isModalImageInteracting && modalImageDragStartX !== null) {
                event.preventDefault();
                const deltaX = event.clientX - modalImageDragStartX;
                const deltaY = event.clientY - modalImageDragStartY;
                modalImageOffsetX = modalImageDragOffsetX + (deltaX / modalImageZoom);
                modalImageOffsetY = modalImageDragOffsetY + (deltaY / modalImageZoom);
                updateModalImageTransform();
            }
        }, { passive: false });

        document.addEventListener('mouseup', function (event) {
            if (isModalImageInteracting) {
                event.preventDefault();
                isModalImageInteracting = false;
                modalImageDragStartX = null;
                modalImageDragStartY = null;
                modalImage.style.transition = 'transform 0.3s ease';
                // Snap back to center
                modalImageOffsetX = 0;
                modalImageOffsetY = 0;
                updateModalImageTransform();
                dimModalSubtext(false);
            }
        }, { passive: false });

        // Touch pinch-zoom handling
        modalImage.addEventListener('touchstart', function (event) {
            if (event.touches.length === 2) {
                event.preventDefault();
                isModalImageInteracting = true;
                modalImageZoomStartDistance = Math.hypot(
                    event.touches[0].clientX - event.touches[1].clientX,
                    event.touches[0].clientY - event.touches[1].clientY
                );
                modalImageZoomStartScale = modalImageZoom;
                modalImage.style.transition = 'none';
                dimModalSubtext(true);
            } else if (event.touches.length === 1 && modalImageZoom > 1) {
                // Single touch drag when zoomed
                event.preventDefault();
                isModalImageInteracting = true;
                modalImageDragStartX = event.touches[0].clientX;
                modalImageDragStartY = event.touches[0].clientY;
                modalImageDragOffsetX = modalImageOffsetX;
                modalImageDragOffsetY = modalImageOffsetY;
                modalImage.style.transition = 'none';
                dimModalSubtext(true);
            }
        }, { passive: false });

        modalImage.addEventListener('touchmove', function (event) {
            if (event.touches.length === 2 && modalImageZoomStartDistance) {
                event.preventDefault();
                const currentDistance = Math.hypot(
                    event.touches[0].clientX - event.touches[1].clientX,
                    event.touches[0].clientY - event.touches[1].clientY
                );
                const ratio = currentDistance / modalImageZoomStartDistance;
                applyModalImageZoom(modalImageZoomStartScale * ratio);
            } else if (event.touches.length === 1 && isModalImageInteracting && modalImageDragStartX !== null && modalImageZoom > 1) {
                event.preventDefault();
                const deltaX = event.touches[0].clientX - modalImageDragStartX;
                const deltaY = event.touches[0].clientY - modalImageDragStartY;
                modalImageOffsetX = modalImageDragOffsetX + (deltaX / modalImageZoom);
                modalImageOffsetY = modalImageDragOffsetY + (deltaY / modalImageZoom);
                updateModalImageTransform();
            }
        }, { passive: false });

        modalImage.addEventListener('touchend', function () {
            if (modalImageZoomStartDistance) {
                modalImageZoomStartDistance = null;
                modalImageZoomStartScale = 1;
            }
            if (isModalImageInteracting) {
                isModalImageInteracting = false;
                modalImageDragStartX = null;
                modalImageDragStartY = null;
                modalImage.style.transition = 'transform 0.3s ease';
                // Snap back to center
                modalImageOffsetX = 0;
                modalImageOffsetY = 0;
                updateModalImageTransform();
                dimModalSubtext(false);
            }
        });
    }

    function updateGlobalAudioButton() {
        if (!globalAudioToggle) return;

        const isMuted = !!globalAudio && globalAudio.muted;
        globalAudioToggle.innerHTML = isMuted ? '🔇 Music Off' : '🔊 Music On';
        globalAudioToggle.classList.toggle('active', !isMuted);
    }

    function toggleGlobalAudio() {
        if (!globalAudio) return;

        if (globalAudio.muted) {
            globalAudio.muted = false;
            globalAudio.volume = 0.4;
            globalAudio.play().catch(err => console.log('Ambient audio autoplay blocked:', err));
        } else {
            globalAudio.muted = true;
        }

        updateGlobalAudioButton();
    }

    if (globalAudioToggle) {
        globalAudioToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleGlobalAudio();
        });
        window.toggleGlobalAudio = toggleGlobalAudio;
    }

// Audio permission modal
const audioModal = document.getElementById("audio-modal");
const enableAudioBtn = document.getElementById("enable-audio");
const continueMutedBtn = document.getElementById("continue-muted");

if (enableAudioBtn && audioModal) {
    enableAudioBtn.addEventListener("click", function () {

        if (globalAudio) {
            globalAudio.muted = false;
            globalAudio.volume = 0.4;
            globalAudio.play().catch(err => console.log('Ambient audio autoplay blocked:', err));
        }

        updateGlobalAudioButton();

        audioModal.classList.add("hidden");
    });
}


if (continueMutedBtn && audioModal) {
    continueMutedBtn.addEventListener("click", function () {

        if (globalAudio) {
            globalAudio.muted = true;
        }

        updateGlobalAudioButton();

        audioModal.classList.add("hidden");
    });
}

    // Gyro toggle handling
    let gyroActive = false;
    function updateGyroButton() {
        if (!gyroBtn) return;
        gyroBtn.textContent = gyroActive ? 'Gyro On' : 'Gyro Off';
        gyroBtn.classList.toggle('active', gyroActive);
    }

    if (gyroBtn) {
        gyroBtn.addEventListener('click', async function(e) {
            e.stopPropagation();
            if (!panoramaViewer || !panoramaViewer.setGyroEnabled) return;

            if (!gyroActive) {
                // iOS permission flow
                if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                    try {
                        const resp = await DeviceOrientationEvent.requestPermission();
                        if (resp !== 'granted') {
                            console.warn('Gyro permission denied');
                            return;
                        }
                    } catch (err) {
                        console.warn('Gyro permission error', err);
                        return;
                    }
                }
                panoramaViewer.setGyroEnabled(true);
                gyroActive = true;
            } else {
                panoramaViewer.setGyroEnabled(false);
                gyroActive = false;
            }
            updateGyroButton();
        });
    }

    if (panoramaViewer && panoramaViewer.setAutoRotate) {
        panoramaViewer.setAutoRotate(true);
    }

    // Launch the stable 3D Equirectangular Spherical Viewer canvas
  panoramaViewer = window.pannellum.viewer('panorama', {
    type: "equirectangular",
    panorama: "darkroom.jpeg",

    autoLoad: true,
    hfov: 100,
    pitch: 0,
    yaw: 25,

    autoRotate: 0,
    autoRotateInactivityDelay: 0,
    autoRotateStopDelay: 0,

    hotSpots: [
            { "pitch": -12, "yaw": 0, "cssClass": "custom-hotspot heroimage", "clickHandlerFunc": () => openSpecificModal("fmain") },
            { "pitch": -12, "yaw": -112, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("L1") },
            { "pitch": 2, "yaw": -112, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("L2") },
            { "pitch": -13, "yaw": -102, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("L3") },
            { "pitch": 2, "yaw": -102, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("L4") },
            { "pitch": -14, "yaw": -90, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("L5") },
            { "pitch": 2, "yaw": -90, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("L6") },
            { "pitch": -15, "yaw": -75, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("L7") },
            { "pitch": 2, "yaw": -75, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("L8") },
            { "pitch": 2, "yaw": 75, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("L9") },
            { "pitch": -18, "yaw": 75, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("L10") },
    
            { "pitch": -15, "yaw": 90, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("R1") },
            { "pitch": 0, "yaw": 91, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("R2") },
            { "pitch": -15, "yaw": 103, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("R3") },
            { "pitch": 0, "yaw": 103, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("R4") },
            { "pitch": -12, "yaw": 112, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("R5") },
            { "pitch": 2, "yaw": 112, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("R6") }
        ]
    });

    // Central local file mapping configuration registry dictionary layout
    const frameContentRegistry = {
        "fmain": { title: "The Shadow", image: "f1.png", subtext: "I became the silence between storms,\nSo your laughter would never fear the night.\nIf darkness ever comes for your name,\nIt will have to walk through mine first.\n\nThe night may swallow kingdoms whole,\nBut never the promise I have made.\nStand behind my shadow, little one—\nEven darkness fears a father’s love.", audio: "fmain.mp3" },
        "L1": { title: "L1", image: "https://picsum.photos/300/400?random=1", subtext: "Botanical green plant accent canvas print.", audio: "leaf-song.mp3" },
        "L2": { title: "L2", image: "https://picsum.photos/300/400?random=2", subtext: "Botanical green plant accent canvas print.", audio: "leaf-song.mp3" },
        "L3": { title: "L3", image: "https://picsum.photos/300/400?random=3", subtext: "Botanical green plant accent canvas print.", audio: "leaf-song.mp3" },
        "L4": { title: "L4", image: "https://picsum.photos/300/400?random=4", subtext: "Botanical green plant accent canvas print.", audio: "leaf-song.mp3" },
        "L5": { title: "L5", image: "https://picsum.photos/300/400?random=5", subtext: "Botanical green plant accent canvas print.", audio: "leaf-song.mp3" },
        "L6": { title: "L6", image: "https://picsum.photos/300/400?random=6", subtext: "Botanical green plant accent canvas print.", audio: "leaf-song.mp3" },
        "L7": { title: "L7", image: "https://picsum.photos/300/400?random=7", subtext: "Botanical green plant accent canvas print.", audio: "leaf-song.mp3" },
        "L8": { title: "L8", image: "https://picsum.photos/300/400?random=8", subtext: "Botanical green plant accent canvas print.", audio: "leaf-song.mp3" },
        "L9": { title: "L9", image: "https://picsum.photos/300/400?random=9", subtext: "Botanical green plant accent canvas print.", audio: "leaf-song.mp3" },
        "L10": { title: "L10", image: "https://picsum.photos/300/400?random=10", subtext: "Botanical green plant accent canvas print.", audio: "leaf-song.mp3" },
        "R1": { title: "R1", image: "https://picsum.photos/300/400?random=5", subtext: "Botanical green plant accent canvas print.", audio: "leaf-song.mp3" },
        "R2": { title: "R2", image: "https://picsum.photos/300/400?random=6", subtext: "Botanical green plant accent canvas print.", audio: "leaf-song.mp3" },
        "R3": { title: "R3", image: "https://picsum.photos/300/400?random=7", subtext: "Botanical green plant accent canvas print.", audio: "leaf-song.mp3" },
        "R4": { title: "R4", image: "https://picsum.photos/300/400?random=8", subtext: "Botanical green plant accent canvas print.", audio: "leaf-song.mp3" },
        "R5": { title: "R5", image: "https://picsum.photos/300/400?random=9", subtext: "Botanical green plant accent canvas print.", audio: "leaf-song.mp3" },
        "R6": { title: "R6", image: "https://picsum.photos/300/400?random=10", subtext: "Botanical green plant accent canvas print.", audio: "leaf-song.mp3" }
    };

function openSpecificModal(frameId) {
    const data = frameContentRegistry[frameId];
    if (!data) return;

    // TARGET AMBIENT ENGINE: Replaced 'globalAudio' with your explicit 'globalAmbientAudio' ID
    const globalAmbientAudio = document.getElementById("globalAmbientAudio");
    
    // KEEP PLAYING: We maintain a readable background volume (0.3) instead of dropping it to 0.1 or pausing it
    if (globalAmbientAudio && !globalAmbientAudio.paused) {
        globalAmbientAudio.volume = 0.3; 
    }

    if (modalTitle) modalTitle.textContent = data.title;
    if (modalSubtext) modalSubtext.textContent = data.subtext;
    
    if (modalImage && data.image) {
        modalImage.src = data.image;
        modalImage.style.display = "block";
        resetModalImageZoom();
    }

    if (modalAudio && audioSource) {
        modalAudio.pause();
        audioSource.src = data.audio;
        modalAudio.load();
        
        modalAudio.onended = function () {
            modal.classList.remove('active');
            isModalActive = false;
            if (panoramaViewer && panoramaViewer.setModalActive) panoramaViewer.setModalActive(false);
            if (globalAudio && !globalAudio.muted) globalAudio.volume = 0.4;
            resetModalImageZoom();
            if (panoramaPrevGyro && panoramaViewer && panoramaViewer.setGyroEnabled) {
                panoramaViewer.setGyroEnabled(true);
                gyroActive = true;
                updateGyroButton();
            }
        };

        modalAudio.play().catch(err => console.log("Voice overlay autoplay blocked:", err));
    }

        // Pause gyro while modal is open, restoring previous state on close
        panoramaPrevGyro = !!gyroActive;
        if (panoramaViewer && panoramaViewer.setGyroEnabled) panoramaViewer.setGyroEnabled(false);
        gyroActive = false;
        updateGyroButton();

        isModalActive = true;
        if (panoramaViewer && panoramaViewer.setModalActive) panoramaViewer.setModalActive(true);
        if (modal) modal.classList.add('active');
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', function() { 
            modal.classList.remove('active'); 
            isModalActive = false;
            if (panoramaViewer && panoramaViewer.setModalActive) panoramaViewer.setModalActive(false);
            if (modalAudio) modalAudio.pause(); 
            if (globalAudio && !globalAudio.muted) globalAudio.volume = 0.4;
            resetModalImageZoom();

            // Restore gyro state if it was active before modal
            if (panoramaPrevGyro && panoramaViewer && panoramaViewer.setGyroEnabled) {
                panoramaViewer.setGyroEnabled(true);
                gyroActive = true;
                updateGyroButton();
            }
        });
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) { 
            if (e.target === modal) { 
                modal.classList.remove('active'); 
                isModalActive = false;
                if (panoramaViewer && panoramaViewer.setModalActive) panoramaViewer.setModalActive(false);
                if (modalAudio) modalAudio.pause(); 
                if (globalAudio && !globalAudio.muted) globalAudio.volume = 0.4;
                resetModalImageZoom();

                // Restore gyro state if it was active before modal
                if (panoramaPrevGyro && panoramaViewer && panoramaViewer.setGyroEnabled) {
                    panoramaViewer.setGyroEnabled(true);
                    gyroActive = true;
                    updateGyroButton();
                }
                if (panoramaViewer && panoramaViewer.setAutoRotate) {
                    panoramaViewer.setAutoRotate(true);
                }
            } 
        });
    }
}

// ========================================================
// 🎛️ GLOBAL HUD HANDLERS (LINKED DIRECTLY TO INLINE HTML)
// ========================================================
console.log("[HUD-MATRIX] Injecting global dashboard connection hooks...");

let isHudAutoplayActive = true;

function updateAutoplayButtonLabel() {
    const autoplayBtnElement = document.getElementById("autoplay-btn");
    if (!autoplayBtnElement) return;
    autoplayBtnElement.innerHTML = isHudAutoplayActive ? "⏸" : "▶";
    autoplayBtnElement.classList.toggle("active", isHudAutoplayActive);
}

// 1. Triggered naturally by onclick="toggleAutoplay()"
window.toggleAutoplay = function() {
    if (!panoramaViewer || !panoramaViewer.setAutoRotate) return;

    if (isHudAutoplayActive) {
        panoramaViewer.setAutoRotate(false);
        isHudAutoplayActive = false;
        updateAutoplayButtonLabel();
        return;
    }

   if (isModalActive) {
    panoramaViewer.setAutoRotate(true);
    isHudAutoplayActive = true;
    updateAutoplayButtonLabel();
    return;
}

    console.log("[HUD] Activating automated canvas rotation engine...");
    panoramaViewer.setAutoRotate(true);
    isHudAutoplayActive = true;
    updateAutoplayButtonLabel();
};

window.stopAutoplayEngine = function() {
    if (panoramaViewer && panoramaViewer.setAutoRotate) {
        panoramaViewer.setAutoRotate(false);
    }
    isHudAutoplayActive = false;
    updateAutoplayButtonLabel();
};

window.addEventListener('DOMContentLoaded', function() {
    if (panoramaViewer && panoramaViewer.setAutoRotate) {
        panoramaViewer.setAutoRotate(true);
    }
    isHudAutoplayActive = true;
    updateAutoplayButtonLabel();
    syncFullscreenUI();

    // Gyro will only be enabled by user via the Gyro button.
});

// 2. Triggered naturally by onclick="resetView()"
window.resetView = function() {
    console.log("[HUD] Resetting virtual tour camera perspective...");
    window.stopAutoplayEngine();
    if (window.location) window.location.reload(); // Quick page refresh re-centers look coordinates beautifully
};

function syncFullscreenUI() {
    const isFullscreen = !!document.fullscreenElement || !!document.webkitFullscreenElement || document.body.classList.contains('is-fullscreen');
    document.body.classList.toggle('is-fullscreen', isFullscreen);

    const fullscreenButton = document.getElementById('fullscreen-btn');
    if (fullscreenButton) {
        fullscreenButton.innerHTML = isFullscreen ? '⛶' : '⛶';
    }
}

// 3. Triggered naturally by onclick="toggleFullscreen()"
window.toggleFullscreen = function(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    console.log("[HUD] Requesting browser display viewport size update...");
    const baseDocumentElementShell = document.documentElement;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        // Try native fullscreen first
        let fullscreenRequested = false;
        
        if (baseDocumentElementShell.requestFullscreen) {
            fullscreenRequested = true;
            baseDocumentElementShell.requestFullscreen().catch(function (err) {
                console.log("[HUD] Fullscreen API failed, using fallback mode:", err);
                // Fallback: Use CSS-based fullscreen for mobile
                document.body.classList.add('is-fullscreen');
                syncFullscreenUI();
            });
        } else if (baseDocumentElementShell.webkitRequestFullscreen) { /* Safari */
            fullscreenRequested = true;
            baseDocumentElementShell.webkitRequestFullscreen().catch(function (err) {
                console.log("[HUD] Webkit fullscreen failed, using fallback mode:", err);
                document.body.classList.add('is-fullscreen');
                syncFullscreenUI();
            });
        } else if (baseDocumentElementShell.mozRequestFullScreen) {
            fullscreenRequested = true;
            baseDocumentElementShell.mozRequestFullScreen().catch(function (err) {
                console.log("[HUD] Moz fullscreen failed, using fallback mode:", err);
                document.body.classList.add('is-fullscreen');
                syncFullscreenUI();
            });
        } else if (baseDocumentElementShell.msRequestFullscreen) {
            fullscreenRequested = true;
            baseDocumentElementShell.msRequestFullscreen().catch(function (err) {
                console.log("[HUD] MS fullscreen failed, using fallback mode:", err);
                document.body.classList.add('is-fullscreen');
                syncFullscreenUI();
            });
        } else {
            // No fullscreen API support - use fallback mode
            console.log("[HUD] No fullscreen API detected, using fallback mode");
            document.body.classList.add('is-fullscreen');
            syncFullscreenUI();
        }
    } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(function () {
                document.body.classList.remove('is-fullscreen');
                syncFullscreenUI();
            });
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else {
            // Fallback: Remove CSS fullscreen class
            document.body.classList.remove('is-fullscreen');
            syncFullscreenUI();
        }
    }

    // Update state proactively in case browser fullscreenchange events delay or do not fire.
    syncFullscreenUI();
    setTimeout(syncFullscreenUI, 100);
    requestAnimationFrame(syncFullscreenUI);
};

document.addEventListener('fullscreenchange', syncFullscreenUI);
document.addEventListener('webkitfullscreenchange', syncFullscreenUI);
document.addEventListener('mozfullscreenchange', syncFullscreenUI);
document.addEventListener('MSFullscreenChange', syncFullscreenUI);

document.addEventListener('fullscreenerror', syncFullscreenUI);
document.addEventListener('webkitfullscreenerror', syncFullscreenUI);

document.addEventListener('mozfullscreenerror', syncFullscreenUI);
document.addEventListener('MSFullscreenError', syncFullscreenUI);

// 4. Triggered naturally by oninput="setFov(this.value)"
window.setFov = function(val) {
    // Sync the numerical readout label element state instantly
    const numericLabelDisplayNode = document.getElementById("fov-val");
    if (numericLabelDisplayNode) numericLabelDisplayNode.textContent = val + "°";

    // Simulate direct mouse-scroll calculations onto the active 3D viewing window
    const simulatedScrollWheelData = new WheelEvent('wheel', {
        deltaY: val > 75 ? 120 : -120, // Computes zoom fields relative to default slider center point
        bubbles: true,
        cancelable: true
    });
    const canvasInteractiveSurface = document.querySelector('#panorama canvas');
    if (canvasInteractiveSurface) canvasInteractiveSurface.dispatchEvent(simulatedScrollWheelData);
};

// 5. Scene thumbnail click placeholder handler
window.switchScene = function(sceneIndex) {
    console.log("[HUD] Scene transition requested for index slot: " + sceneIndex);
};


// Triggers when "Portfolio" or "Gallery" dead links are clicked
function comingSoon(event) {
    event.preventDefault();
    document.getElementById('comingSoonModal').style.display = 'flex';
}

// Closes the Coming Soon alert modal
function closeModal() {
    document.getElementById('comingSoonModal').style.display = 'none';
}

// FIX: Added missing function requested by your HTML button
function closeWelcomeModal() {
    document.getElementById('welcomeModal').style.display = 'none';
}

// UX ADVANCEMENT: Closes any open modal when clicking on the dark background blur
window.addEventListener('click', function(event) {
    const comingSoonModal = document.getElementById('comingSoonModal');
    const welcomeModal = document.getElementById('welcomeModal');
    
    if (event.target === comingSoonModal) {
        comingSoonModal.style.display = 'none';
    }
    if (event.target === welcomeModal) {
        welcomeModal.style.display = 'none';
    }
});
// Opens Coming Soon features
function comingSoon(event) {
    event.preventDefault();
    document.getElementById('comingSoonModal').style.display = 'flex';
}

// Closes Coming Soon alert modal
function closeModal() {
    document.getElementById('comingSoonModal').style.display = 'none';
}

// Closes the onboarding instructions layout
function closeWelcomeModal() {
    document.getElementById('welcomeModal').style.display = 'none';
}

// Global modal overlay dismiss rules
window.addEventListener('click', function(event) {
    const comingSoonModal = document.getElementById('comingSoonModal');
    const welcomeModal = document.getElementById('welcomeModal');
    
    if (event.target === comingSoonModal) {
        comingSoonModal.style.display = 'none';
    }
    if (event.target === welcomeModal) {
        welcomeModal.style.display = 'none';
    }
});

function submitOrderNumber() {
    const orderInput = document.getElementById("orderNumberInput").value.trim();
    const inputElement = document.getElementById("orderNumberInput");
    
    if (!orderInput) {
        alert("Please enter an order number.");
        return;
    }

    // Create a temporary hidden image element to safely check files on local drives
    const testImage = new Image();
    
    // Path structure: looking directly inside the subfolder next to this script file
    const targetLogoPath = `./${orderInput}/logo.png`;

    // SUCCESS: The local folder and logo.png exist
    testImage.onload = function() {
        console.log(`Success: Found logo inside folder ${orderInput}`);
        
        // Opens the specific index.html workspace inside that order folder
        window.location.href = `./${orderInput}/index.html`; 
        
        closeWelcomeModal();
    };

    // FAIL: The folder name doesn't match or logo.png is missing inside it
testImage.onerror = function() {
    document.getElementById("errorModal").style.display = "flex"; // Your CSS uses flex for alignment
    inputElement.style.borderColor = "#ef4444"; 
    inputElement.value = "";
    inputElement.focus();
};
    // Run the image detection instantly
    testImage.src = targetLogoPath;
}

function closeErrorModal() {
    document.getElementById("errorModal").style.display = "none";
}


const modal = document.getElementById("audio-modal");
const audio = document.getElementById("bg-audio");

function closeAudioModal() {
    modal.classList.add("hidden");

    // Optional: completely remove it after the fade-out
    setTimeout(() => {
        modal.remove();
    }, 400); // Match your CSS transition duration
}

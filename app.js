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
    const audioSource = document.getElementById('audioSource');

    const globalAudio = document.getElementById('globalAmbientAudio');
    const globalAudioToggle = document.getElementById('globalAudioToggle');
    const gyroBtn = document.getElementById('gyro-btn');
    let panoramaPrevGyro = false;
// Audio permission modal
const audioModal = document.getElementById("audio-modal");
const enableAudioBtn = document.getElementById("enable-audio");
const continueMutedBtn = document.getElementById("continue-muted");

if (enableAudioBtn && audioModal) {
    enableAudioBtn.addEventListener("click", function () {

        if (globalAudio) {
            globalAudio.muted = false;
            globalAudio.volume = 0.4;
            globalAudio.play();
        }

        if (globalAudioToggle) {
            globalAudioToggle.innerHTML = "🔊 Music On";
        }

        audioModal.classList.add("hidden");
    });
}


if (continueMutedBtn && audioModal) {
    continueMutedBtn.addEventListener("click", function () {

        if (globalAudio) {
            globalAudio.muted = true;
        }

        if (globalAudioToggle) {
            globalAudioToggle.innerHTML = "🔇 Music Off";
        }

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
    yaw: 0,

    autoRotate: 0,
    autoRotateInactivityDelay: 0,
    autoRotateStopDelay: 0,

    hotSpots: [
            { "pitch": -2.4, "yaw": 0, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("fmain") },
            { "pitch": -20, "yaw": -107.6, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("L1") },
            { "pitch": -27.2, "yaw": -95.6, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("L2") },
            { "pitch": -10, "yaw": -95.6, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("L3") },
            { "pitch": -21, "yaw": -78, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("L4") },
            { "pitch": 4, "yaw": -78, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("L5") },
            { "pitch": -25, "yaw": -62, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("L6") },
            { "pitch": -8.1, "yaw": -62, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("L7") },
            { "pitch": 9.5, "yaw": -62.3, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("L8") },
            { "pitch": -16, "yaw": -49.8, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("L9") },
            { "pitch": 0.5, "yaw": -49, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("L10") },
            { "pitch": -10.3, "yaw": -31.2, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("F1") },
            { "pitch": -10.6, "yaw": 31.3, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("F2") },
            { "pitch": -10, "yaw": 146, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("B1") },
            { "pitch": -10, "yaw": -145, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("B2") },
            { "pitch": -10, "yaw": 67, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("R1") },
            { "pitch": -20, "yaw": 89, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("R2") },
            { "pitch": -1, "yaw": 89, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("R3") },
            { "pitch": -16, "yaw": 107, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("R4") },
            { "pitch": 2.2, "yaw": 107, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("R5") },
            { "pitch": -8, "yaw": 122, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("R6") }
        ]
    });

    // Central local file mapping configuration registry dictionary layout
    const frameContentRegistry = {
        "fmain": { title: "The Shadow", image: "f1.png", subtext: "My hands were never made for crowns,\nThey were made to carry tomorrow.\nAnd if the world should turn to ash,\nYou’ll still find peace beneath my shadow.", audio: "fmain.mp3" },
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
        "F1": { title: "F1", image: "https://picsum.photos/300/400?random=2", subtext: "High-accent custom forest photography canvas artwork.", audio: "forest-song.mp3" },
        "F2": { title: "F2", image: "https://picsum.photos/300/400?random=3", subtext: "Lower-accent coastline boardwalk layout frame print piece.", audio: "beach-song.mp3" },
        "B1": { title: "B1", image: "https://picsum.photos/300/400?random=4", subtext: "Botanical green plant accent canvas print.", audio: "leaf-song.mp3" },
        "B2": { title: "B2", image: "https://picsum.photos/300/400?random=6", subtext: "Horizontal sunset seascape photography frame.", audio: "sunset-song.mp3" },
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
    }

    if (modalAudio && audioSource) {
        modalAudio.pause();
        audioSource.src = data.audio;
        modalAudio.load();
        
        // OPTIONAL: Automatically start playing the voice overlay once it finishes loading
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

                // Restore gyro state if it was active before modal
                if (panoramaPrevGyro && panoramaViewer && panoramaViewer.setGyroEnabled) {
                    panoramaViewer.setGyroEnabled(true);
                    gyroActive = true;
                    updateGyroButton();
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
    const isFullscreen = !!document.fullscreenElement || !!document.webkitFullscreenElement;
    document.body.classList.toggle('is-fullscreen', isFullscreen);

    const fullscreenButton = document.getElementById('fullscreen-btn');
    if (fullscreenButton) {
        fullscreenButton.innerHTML = isFullscreen ? '⛶' : '⛶';
    }
}

// 3. Triggered naturally by onclick="toggleFullscreen()"
window.toggleFullscreen = function() {
    console.log("[HUD] Requesting browser display viewport size update...");
    const baseDocumentElementShell = document.documentElement;
    
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (baseDocumentElementShell.requestFullscreen) {
            baseDocumentElementShell.requestFullscreen();
        } else if (baseDocumentElementShell.webkitRequestFullscreen) { /* Safari */
            baseDocumentElementShell.webkitRequestFullscreen();
        } else if (baseDocumentElementShell.mozRequestFullScreen) {
            baseDocumentElementShell.mozRequestFullScreen();
        } else if (baseDocumentElementShell.msRequestFullscreen) {
            baseDocumentElementShell.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }

    // Update state proactively in case browser fullscreenchange events delay or do not fire.
    syncFullscreenUI();
    setTimeout(syncFullscreenUI, 50);
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

console.log("[APP] Executing virtual tour control modules...");

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
    const modalNotes = document.getElementById('modalNotes');
    const audioSource = document.getElementById('audioSource');

    const globalAudio = document.getElementById('globalAmbientAudio');
    const globalAudioToggle = document.getElementById('globalAudioToggle');

    // Start background music loop in muted state
    if (globalAudio) {
        globalAudio.play().catch(() => console.log("Waiting for user tap to activate audio..."));
    }

    // Unmute background music automatically on first drag or click interaction
    function unlockGlobalAutoplay() {
        if (globalAudio && globalAudio.muted) {
            globalAudio.muted = false;
            globalAudio.volume = 0.4;
            globalAudio.play();
            if (globalAudioToggle) globalAudioToggle.innerHTML = "🔊 Music On";
        }
        window.removeEventListener('click', unlockGlobalAutoplay);
        window.removeEventListener('touchstart', unlockGlobalAutoplay);
    }
    window.addEventListener('click', unlockGlobalAutoplay);
    window.addEventListener('touchstart', unlockGlobalAutoplay);

    if (globalAudioToggle && globalAudio) {
        globalAudioToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            if (globalAudio.muted || globalAudio.paused) {
                globalAudio.muted = false;
                globalAudio.play();
                globalAudioToggle.innerHTML = "🔊 Music On";
            } else {
                globalAudio.muted = true;
                globalAudioToggle.innerHTML = "🔇 Music Off";
            }
        });
    }

    // Launch the stable 3D Equirectangular Spherical Viewer canvas
    const viewer = window.pannellum.viewer('panorama', {
        "type": "equirectangular",
        "panorama": "livingroom.jpg", 
        "autoLoad": true,
        "hfov": 110,
        "pitch": -0.8,
        "yaw": -0.2,    
        "hotSpots": [
            { "pitch": -5.2, "yaw": -4.8, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("tv-center") },
            { "pitch": 18.5, "yaw": -68.4, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("frame-forest") },
            { "pitch": -12.1, "yaw": -67.9, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("frame-beach") },
            { "pitch": -2.4, "yaw": -32.8, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("frame-leaf") },
            { "pitch": 8.1, "yaw": 42.6, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("frame-sunset") }
        ]
    });

    // Central local file mapping configuration registry dictionary layout
    const frameContentRegistry = {
        "tv-center": { title: "Television Media Center", image: "tv-screen.jpg", subtext: "Main monitor screen portal array display.", audio: "tv-audio.mp3" },
        "frame-forest": { title: "Forest Pathway Art Piece", image: "forest-art.jpg", subtext: "High-accent custom forest photography canvas artwork.", audio: "forest-song.mp3" },
        "frame-beach": { title: "Beach Boardwalk Art Piece", image: "beach-art.jpg", subtext: "Lower-accent coastline boardwalk layout frame print piece.", audio: "beach-song.mp3" },
        "frame-leaf": { title: "Green Monstera Leaf Art", image: "leaf-art.jpg", subtext: "Botanical green plant accent canvas print.", audio: "leaf-song.mp3" },
        "frame-sunset": { title: "Ocean Sunset Art Piece", image: "sunset-art.jpg", subtext: "Horizontal sunset seascape photography frame.", audio: "sunset-song.mp3" }
    };

    function openSpecificModal(frameId) {
        const data = frameContentRegistry[frameId];
        if (!data) return;

        if (globalAudio && !globalAudio.muted) globalAudio.volume = 0.1;

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
        }

        if (modalNotes) modalNotes.value = ""; 
        if (modal) modal.classList.add('active');
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', function() { 
            modal.classList.remove('active'); 
            if (modalAudio) modalAudio.pause(); 
            if (globalAudio && !globalAudio.muted) globalAudio.volume = 0.4;
        });
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) { 
            if (e.target === modal) { 
                modal.classList.remove('active'); 
                if (modalAudio) modalAudio.pause(); 
                if (globalAudio && !globalAudio.muted) globalAudio.volume = 0.4;
            } 
        });
    }
}

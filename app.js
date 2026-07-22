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
        "hfov": 100,
        "pitch": 0,
        "yaw": 0,    
        "hotSpots": [
            { "pitch": -2.4, "yaw": 0, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("tv-center") },
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
            { "pitch": -10, "yaw": -145, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("B2") }
        ]
    });

    // Central local file mapping configuration registry dictionary layout
    const frameContentRegistry = {
        "tv-center": { title: "Television Media Center", image: "https://picsum.photos/300/400?random=1", subtext: "Main monitor screen portal array display.", audio: "tv-audio.mp3" },
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

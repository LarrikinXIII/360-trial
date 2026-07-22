function buildVirtualTourViewer() {
    console.log("[APP] Multi-frame 3D virtual tour sequence activated.");

    const modal = document.getElementById('mediaModal');
    const closeBtn = document.getElementById('closeModal');
    const modalAudio = document.getElementById('modalAudio'); // Hotspot modal player
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtext = document.getElementById('modalSubtext');
    const modalImage = document.getElementById('modalImage');

    // NEW SELECTORS: Global Background Music Assets 
    const globalAudio = document.getElementById('globalAmbientAudio');
    const globalAudioToggle = document.getElementById('globalAudioToggle');

    // Automatically trigger playing sequence in muted state right away
    if (globalAudio) {
        globalAudio.play().catch(err => console.log("Muted autoplay tracking sequence active. Waiting for interaction."));
    }

    // --- AUTOMATIC UNMUTE UNLOCK ON FIRST USER INTERACTION TAPS ---
    function unlockGlobalAutoplay() {
        if (globalAudio && globalAudio.muted) {
            globalAudio.muted = false;
            globalAudio.volume = 0.4; // Comfort levels background volume settings (40%)
            globalAudio.play();
            if (globalAudioToggle) globalAudioToggle.innerHTML = "🔊 Music On";
        }
        // Remove tracking listeners so it doesn't fire over and over when clicking items
        window.removeEventListener('click', unlockGlobalAutoplay);
        window.removeEventListener('touchstart', unlockGlobalAutoplay);
    }
    window.addEventListener('click', unlockGlobalAutoplay);
    window.addEventListener('touchstart', unlockGlobalAutoplay);

    // --- MANUAL FLOATING BUTTON TOGGLE CLICK HANDLER ---
    if (globalAudioToggle && globalAudio) {
        globalAudioToggle.addEventListener('click', function(e) {
            e.stopPropagation(); // Stops event cascading into other layer nodes
            
            if (globalAudio.muted || globalAudio.paused) {
                globalAudio.muted = false;
                globalAudio.play();
                globalAudioToggle.innerHTML = "🔊 Music On";
                globalAudioToggle.classList.remove('is-muted');
            } else {
                globalAudio.muted = true;
                globalAudioToggle.innerHTML = "🔇 Music Off";
                globalAudioToggle.classList.add('is-muted');
            }
        });
    }

    // Launch the official 3D Equirectangular Spherical Viewer
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

    const frameContentRegistry = {
        "tv-center": { title: "Television Media Center", image: "https://picsum.photos", subtext: "Main monitor screen portal array display.", audio: "https://codesandbox.io" },
        "frame-forest": { title: "Forest Pathway Art Piece", image: "https://picsum.photos", subtext: "High-accent custom forest photography canvas artwork.", audio: "https://soundhelix.com" },
        "frame-beach": { title: "Beach Boardwalk Art Piece", image: "https://picsum.photos", subtext: "Lower-accent coastline boardwalk layout frame print piece.", audio: "https://soundhelix.com" },
        "frame-leaf": { title: "Green Monstera Leaf Art", image: "https://picsum.photos", subtext: "Botanical green plant accent canvas print.", audio: "https://soundhelix.com" },
        "frame-sunset": { title: "Ocean Sunset Art Piece", image: "https://picsum.photos", subtext: "Horizontal sunset seascape photography frame.", audio: "https://soundhelix.com" }
    };

    function openSpecificModal(frameId) {
        const data = frameContentRegistry[frameId];
        if (!data) return;

        // When opening a hotspot modal player, lower ambient music volume down automatically to 10%
        if (globalAudio && !globalAudio.muted) globalAudio.volume = 0.1;

        modalTitle.textContent = data.title;
        modalSubtext.textContent = data.subtext;
        modalImage.src = data.image;

        modalAudio.pause();
        const audioSource = document.getElementById('audioSource');
        if (audioSource) audioSource.src = data.audio;
        modalAudio.load();

        if (modal) modal.classList.add('active');
    }

    // Close button modal cleanup loop sequences
    closeBtn.addEventListener('click', function() { 
        modal.classList.remove('active'); 
        modalAudio.pause(); 
        // Restore background global audio back to normal 40% volume settings on exit
        if (globalAudio && !globalAudio.muted) globalAudio.volume = 0.4;
    });
    
    modal.addEventListener('click', function(e) { 
        if (e.target === modal) { 
            modal.classList.remove('active'); 
            modalAudio.pause(); 
            if (globalAudio && !globalAudio.muted) globalAudio.volume = 0.4;
        } 
    });
}

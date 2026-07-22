console.log("[APP] Multi-Frame Modal Architecture Engine Initializing...");

if (window.pannellum) {
    buildVirtualTourViewer();
} else {
    window.addEventListener('pannellumLibraryReady', buildVirtualTourViewer);
}

function buildVirtualTourViewer() {
    console.log("[APP] Core engine verified. Injecting coordinate registry targets...");

    // 1. Central Data Map Registry: Holds coordinates and unique assets for every single item
    const frameContentRegistry = {
        "tv-center": {
            title: "Television Media Center",
            image: "https://picsum.photos", // Custom placeholder image path
            subtext: "Main monitor screen portal array display. Playing active background telemetry audio track.",
            audio: "https://codesandbox.io"
        },
        "frame-forest": {
            title: "Forest Pathway Art Piece",
            image: "https://picsum.photos", 
            subtext: "High-accent custom forest landscaping fine photography framework situated on the far-left drywall segment layout.",
            audio: "https://soundhelix.com"
        },
        "frame-beach": {
            title: "Beach Boardwalk Art Piece",
            image: "https://picsum.photos",
            subtext: "Lower-accent coastline boardwalk architectural framework print piece anchoring the leftmost perspective geometry planes.",
            audio: "https://soundhelix.com"
        },
        "frame-leaf": {
            title: "Green Monstera Leaf Art",
            image: "https://picsum.photos",
            subtext: "Close-cropped tropical organic green botanical canvas print nestled up right against the main corner divider room columns.",
            audio: "https://soundhelix.com"
        },
        "frame-sunset": {
            title: "Ocean Sunset Art Piece",
            image: "https://picsum.photos",
            subtext: "Horizontal sunset perspective seascape canvas frame anchoring the main right-hand decorative furniture boundary wall layout.",
            audio: "https://soundhelix.com"
        }
    };

    // 2. Map DOM selector elements
    const modal = document.getElementById('mediaModal');
    const closeBtn = document.getElementById('closeModal');
    const audioPlayer = document.getElementById('modalAudio');
    const audioSource = document.getElementById('audioSource');
    const modalTitle = document.getElementById('modalTitle');
    const modalImage = document.getElementById('modalImage');
    const modalSubtext = document.getElementById('modalSubtext');
    const modalNotes = document.getElementById('modalNotes');

    // 3. Initialize the 3D VR Engine Viewport Panel
    const viewer = window.pannellum.viewer('panorama', {
        "type": "equirectangular",
        "panorama": "livingroom.jpg", 
        "autoLoad": true,
        "hfov": 110,
        "pitch": -0.8,   // View port lands directly facing the TV setup frame panel
        "yaw": -0.2,    
        "hotSpots": [
            { "pitch": -5.2, "yaw": -4.8, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("tv-center") },
            { "pitch": 18.5, "yaw": -68.4, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("frame-forest") },
            { "pitch": -12.1, "yaw": -67.9, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("frame-beach") },
            { "pitch": -2.4, "yaw": -32.8, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("frame-leaf") },
            { "pitch": 8.1, "yaw": 42.6, "cssClass": "custom-hotspot", "clickHandlerFunc": () => openSpecificModal("frame-sunset") }
        ]
    });

    // 4. Core Dynamic Data Switcher Mechanism
    function openSpecificModal(frameId) {
        console.log("[APP] Querying configuration profile data indexes for ID: " + frameId);
        const data = frameContentRegistry[frameId];
        
        if (!data) return;

        // Instantly alter content inside the popup modal elements
        modalTitle.textContent = data.title;
        modalSubtext.textContent = data.subtext;
        
        if (data.image) {
            modalImage.src = data.image;
            modalImage.style.display = "block";
        } else {
            modalImage.style.display = "none";
        }

        // Dynamically reload the audio element track pathway
        audioPlayer.pause();
        audioSource.src = data.audio;
        audioPlayer.load(); // Forces HTML5 audio engine to clear old memory paths

        // Clear notes field out or apply individual data tracking values if needed
        modalNotes.value = ""; 

        // Launch modal window
        if (modal) modal.classList.add('active');
    }

    // Close button modal layout sequences
    closeBtn.addEventListener('click', function() { modal.classList.remove('active'); audioPlayer.pause(); });
    modal.addEventListener('click', function(e) { if (e.target === modal) { modal.classList.remove('active'); audioPlayer.pause(); } });
}

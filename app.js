window.addEventListener('load', function() {
    console.log("[MAP-ENGINE] Initializing flat-plane 360 view matrix...");

    const panoramaWrapper = document.getElementById('panorama');
    const modal = document.getElementById('mediaModal');
    const closeBtn = document.getElementById('closeModal');
    const audioPlayer = document.getElementById('modalAudio');

    // Force background setup directly on the view wrapper layout container
    panoramaWrapper.style.backgroundImage = "url('livingroom.jpg')";
    panoramaWrapper.style.backgroundSize = "200% 200%"; // Grants a panoramic field of view zoom ratio
    panoramaWrapper.style.backgroundPosition = "35% 50%"; // Centered directly on the television set plane
    panoramaWrapper.style.position = "relative";
    panoramaWrapper.style.cursor = "grab";

    // Setup coordinate data dictionary to hold all upcoming picture frames easily
    const hotspotMap = [
        { id: "tv-center", x: 35.2, y: 56.4, title: "TV Center Display" },
        { id: "frame-left", x: 15.4, y: 42.1, title: "Gallery Frame Left" },
        { id: "frame-right", x: 78.8, y: 39.5, title: "Gallery Frame Right" }
    ];

    // Build out layout markers onto the map interface container layer
    hotspotMap.forEach(function(spot) {
        const markerNode = document.createElement('div');
        markerNode.className = "custom-hotspot";
        markerNode.id = spot.id;
        
        // Exact flat map percentage mapping positions
        markerNode.style.position = "absolute";
        markerNode.style.left = spot.x + "%";
        markerNode.style.top = spot.y + "%";
        markerNode.setAttribute("title", spot.title);

        // Open modal when any registered node marker is selected
        markerNode.addEventListener('click', function() {
            console.log("[MAP-ENGINE] Opened item: " + spot.title);
            document.querySelector('.modal-title').textContent = spot.title;
            modal.classList.add('active');
        });

        panoramaWrapper.appendChild(markerNode);
    });

    // Panning variable registries
    let isDragging = false;
    let startX, startY;
    let currentXPercent = 35;
    let currentYPercent = 50;

    // Drag-to-pan map controller mechanics
    panoramaWrapper.addEventListener('mousedown', function(e) {
        isDragging = true;
        panoramaWrapper.style.cursor = "grabbing";
        startX = e.clientX;
        startY = e.clientY;
    });

    window.addEventListener('mouseup', function() {
        isDragging = false;
        panoramaWrapper.style.cursor = "grab";
    });

    window.addEventListener('mousemove', function(e) {
        if (!isDragging) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        // Reset mouse start positions for real-time tracking
        startX = e.clientX;
        startY = e.clientY;

        // Tweak background image viewport scroll speeds
        currentXPercent -= deltaX * 0.1;
        currentYPercent -= deltaY * 0.1;

        // Lock boundaries to keep panning smooth
        currentXPercent = Math.max(0, Math.min(100, currentXPercent));
        currentYPercent = Math.max(0, Math.min(100, currentYPercent));

        panoramaWrapper.style.backgroundPosition = currentXPercent + "% " + currentYPercent + "%";

        // Readjust hotspot position tracking locks
        hotspotMap.forEach(function(spot) {
            const node = document.getElementById(spot.id);
            if (node) {
                // Adjusts placement positions dynamically based on current scroll view delta
                const shiftedX = spot.x + (35 - currentXPercent) * 2;
                const shiftedY = spot.y + (50 - currentYPercent) * 2;
                node.style.left = shiftedX + "%";
                node.style.top = shiftedY + "%";
            }
        });
    });

    // Handle closing interaction structures cleanly
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('active');
        audioPlayer.pause();
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            audioPlayer.pause();
        }
    });
});

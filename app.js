window.addEventListener('load', function() {
    console.log("[SPHERICAL-MAP] Initializing equirectangular viewport conversion matrix...");

    const viewer = document.getElementById('panorama');
    const modal = document.getElementById('mediaModal');
    const closeBtn = document.getElementById('closeModal');
    const audioPlayer = document.getElementById('modalAudio');

    // 1. Establish a true immersive spherical 3D canvas simulation wrapper
    viewer.style.position = 'relative';
    viewer.style.overflow = 'hidden';
    viewer.style.backgroundColor = '#000';
    viewer.style.width = '100vw';
    viewer.style.height = '100vh';

    // 2. Build out the panorama track background container layer
    const panoLayer = document.createElement('div');
    panoLayer.style.position = 'absolute';
    panoLayer.style.width = '300%'; // Expanded horizontal layout viewport tracking field
    panoLayer.style.height = '100%';
    panoLayer.style.backgroundImage = "url('livingroom.jpg')";
    panoLayer.style.backgroundSize = 'cover';
    panoLayer.style.backgroundPosition = 'center';
    panoLayer.style.transformOrigin = 'center center';
    panoLayer.style.transition = 'transform 0.1s ease-out';
    viewer.appendChild(panoLayer);

    // 3. Coordinate dictionary map for your TV and Gallery picture frames
    // Uses structural coordinate points that lock permanently to your panorama pixels
    const frameRegistry = [
        { id: 'tv-center', x: 67.2, y: 40.5, title: 'Television Interface' },
        { id: 'frame-forest', x: 15.1, y: 18.5, title: 'Forest Pathway Frame' },
        { id: 'frame-beach', x: 15.3, y: 49.2, title: 'Beach Boardwalk Frame' },
        { id: 'frame-leaf', x: 35.8, y: 43.1, title: 'Green Monstera Leaf Frame' },
        { id: 'frame-sunset', x: 86.9, y: 28.5, title: 'Ocean Sunset Right Frame' }
    ];

    // 4. Inject all registered hotSpot nodes cleanly onto the panorama image plane
    frameRegistry.forEach(function(spot) {
        const pin = document.createElement('div');
        pin.className = 'custom-hotspot';
        pin.id = spot.id;
        pin.style.position = 'absolute';
        pin.style.left = spot.x + '%';
        pin.style.top = spot.y + '%';
        pin.style.transform = 'translate(-50%, -50%)';
        pin.setAttribute('title', spot.title);

        pin.addEventListener('click', function(e) {
            e.stopPropagation(); // Stops background navigation clicks from triggering
            console.log("[VIEWPORT] Selected: " + spot.title);
            document.querySelector('.modal-title').textContent = spot.title;
            modal.classList.add('active');
        });

        panoLayer.appendChild(pin);
    });

    // 5. Immersive viewport position vectors tracking state
    let isPanning = false;
    let baseMouseX = 0, baseMouseY = 0;
    let horizontalScrollRotation = -51.5; // Starts facing the television center console dead-center
    let verticalTiltTranslation = 0;

    // Center viewport tracking initialization
    panoLayer.style.transform = `translate3d(${horizontalScrollRotation}%, ${verticalTiltTranslation}px, 0)`;

    // 6. Navigation Drag-to-Pan engine loop mechanics
    viewer.addEventListener('mousedown', function(e) {
        isPanning = true;
        viewer.style.cursor = 'grabbing';
        baseMouseX = e.clientX;
        baseMouseY = e.clientY;
    });

    window.addEventListener('mouseup', function() {
        isPanning = false;
        viewer.style.cursor = 'grab';
    });

    window.addEventListener('mousemove', function(e) {
        if (!isPanning) return;

        const distanceDeltaX = e.clientX - baseMouseX;
        const distanceDeltaY = e.clientY - baseMouseY;

        baseMouseX = e.clientX;
        baseMouseY = e.clientY;

        // Apply smooth horizontal panning across the panorama view track layout
        horizontalScrollRotation += (distanceDeltaX / window.innerWidth) * 100;
        verticalTiltTranslation += distanceDeltaY * 0.8;

        // Establish mathematical boundaries to stop the viewport track sliding away
        horizontalScrollRotation = Math.max(-100, Math.min(0, horizontalScrollRotation));
        verticalTiltTranslation = Math.max(-220, Math.min(220, verticalTiltTranslation));

        // Render the exact viewport transform changes using hard acceleration profiles
        panoLayer.style.transform = `translate3d(${horizontalScrollRotation}%, ${verticalTiltTranslation}px, 0)`;
    });

    // 7. Modal exit operations
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

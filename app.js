window.addEventListener('load', function() {
    console.log("[3D-ENGINE] Activating native spherical wrapping matrix...");

    const viewer = document.getElementById('panorama');
    const modal = document.getElementById('mediaModal');
    const closeBtn = document.getElementById('closeModal');
    const audioPlayer = document.getElementById('modalAudio');

    // 1. Establish the main 3D Viewport window frame
    viewer.style.position = 'relative';
    viewer.style.overflow = 'hidden';
    viewer.style.backgroundColor = '#111';
    viewer.style.width = '100vw';
    viewer.style.height = '100vh';
    viewer.style.perspective = '600px'; // Creates the depth field of view lens look

    // 2. Build the 3D Sphere Cube-Map Environment Chamber
    const scene3D = document.createElement('div');
    scene3D.style.position = 'absolute';
    scene3D.style.width = '100%';
    scene3D.style.height = '100%';
    scene3D.style.transformStyle = 'preserve-3d';
    scene3D.style.transition = 'transform 0.1s ease-out';
    viewer.appendChild(scene3D);

    // 3. Create the panoramic image panel strip wrapped into a cylinder shape
    const panoSurface = document.createElement('div');
    panoSurface.style.position = 'absolute';
    panoSurface.style.width = '4000px'; // Massive panoramic resolution map surface width
    panoSurface.style.height = '1000px';
    panoSurface.style.top = '50%';
    panoSurface.style.left = '50%';
    panoSurface.style.backgroundImage = "url('livingroom.jpg')";
    panoSurface.style.backgroundSize = '100% 100%';
    panoSurface.style.transformOrigin = 'center center';
    
    // This curves the flat asset into a true 3D wraparound depth environment
    panoSurface.style.transform = 'translate(-50%, -50%) translateZ(-800px)';
    scene3D.appendChild(panoSurface);

    // 4. Clean coordinate maps for your TV and surrounding Gallery photo frames
    const frameRegistry = [
        { id: 'tv-center', x: 67.2, y: 45.5, title: 'Television Interface module' },
        { id: 'frame-forest', x: 15.1, y: 22.5, title: 'Forest Pathway Photo Frame' },
        { id: 'frame-beach', x: 15.3, y: 55.2, title: 'Beach Boardwalk Photo Frame' },
        { id: 'frame-leaf', x: 35.8, y: 48.1, title: 'Green Monstera Leaf Frame' },
        { id: 'frame-sunset', x: 86.9, y: 32.5, title: 'Ocean Sunset Right Frame' }
    ];

    // 5. Place the interactive hotspot buttons directly onto the curved 3D image surface
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
            e.stopPropagation(); // Stops camera panning engine clicks from firing
            console.log("[VIEWPORT] Active Selection: " + spot.title);
            document.querySelector('.modal-title').textContent = spot.title;
            modal.classList.add('active');
        });

        panoSurface.appendChild(pin);
    });

    // 6. 3D Camera tracking variables
    let isPanning = false;
    let baseMouseX = 0, baseMouseY = 0;
    let cameraRotationY = -45; // Starts camera facing toward the TV center console
    let cameraRotationX = 0;

    // Set up the initial camera angle view matrix positioning loop
    scene3D.style.transform = `rotateX(${cameraRotationX}deg) rotateY(${cameraRotationY}deg)`;

    // 7. Core 3D Navigation Drag-to-Pan Event Loop Mechanics
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

        // Modifies the 3D rotation angles smoothly as you drag across the canvas viewport
        cameraRotationY += distanceDeltaX * 0.15;
        cameraRotationX -= distanceDeltaY * 0.15;

        // Establish look parameters to prevent flipping entirely upside down
        cameraRotationX = Math.max(-45, Math.min(45, cameraRotationX));

        // Render the true spherical immersive 3D translation changes
        scene3D.style.transform = `rotateX(${cameraRotationX}deg) rotateY(${cameraRotationY}deg)`;
    });

    // 8. Pop-up window modal exit routines
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

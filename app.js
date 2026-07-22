window.addEventListener('load', function() {
    console.log("[3D-CYLINDER] Constructing immersive 360 panoramic wraparound bubble...");

    const viewer = document.getElementById('panorama');
    const modal = document.getElementById('mediaModal');
    const closeBtn = document.getElementById('closeModal');
    const audioPlayer = document.getElementById('modalAudio');

    // 1. Configure the Main 3D Viewport window frame
    viewer.style.position = 'relative';
    viewer.style.overflow = 'hidden';
    viewer.style.backgroundColor = '#000';
    viewer.style.width = '100vw';
    viewer.style.height = '100vh';
    viewer.style.perspective = '700px'; // Field of view depth lens matrix config

    // 2. Build the central 3D Environment pivot hub room
    const stage3D = document.createElement('div');
    stage3D.style.position = 'absolute';
    stage3D.style.width = '100%';
    stage3D.style.height = '100%';
    stage3D.style.transformStyle = 'preserve-3d';
    stage3D.style.transition = 'transform 0.05s ease-out';
    viewer.appendChild(stage3D);

    // 3. Segment the single flat image asset into a real wrapped 3D cylinder
    // We break the panorama into 12 distinct panels wrapped in a seamless 360 ring
    const totalPanels = 12;
    const panelWidth = 530; // Optimal panel tracking segment width pixel metrics
    const cylinderRadius = Math.round((panelWidth / 2) / Math.tan(Math.PI / totalPanels)); // Distance from core pivot center

    for (let i = 0; i < totalPanels; i++) {
        const panelDeg = i * (360 / totalPanels);
        const slice = document.createElement('div');
        
        slice.style.position = 'absolute';
        slice.style.width = panelWidth + 'px';
        slice.style.height = '800px';
        slice.style.top = '50%';
        slice.style.left = '50%';
        slice.style.marginTop = '-400px';
        slice.style.marginLeft = -(panelWidth / 2) + 'px';
        
        // Map the panoramic background slice image texture onto each segment
        slice.style.backgroundImage = "url('livingroom.jpg')";
        slice.style.backgroundSize = `${totalPanels * 100}% 100%`;
        slice.style.backgroundPosition = `${(i / (totalPanels - 1)) * 100}% 0%`;
        slice.style.backfaceVisibility = 'hidden';
        
        // Distribute the panels perfectly into a circular wraparound ring shape
        slice.style.transform = `rotateY(${-panelDeg}deg) translateZ(${cylinderRadius}px)`;
        stage3D.appendChild(slice);

        // 4. Inject specific hotspots onto the panels matching their visible features
        // Panel 2 contains the television monitor glass surface panel interface
        if (i === 2) {
            createHotspotNode(slice, "tv-center", 35, 52, "Television Display", modal);
        }
        // Panel 0 contains the forest picture frames cluster layout
        if (i === 0) {
            createHotspotNode(slice, "frame-forest", 62, 28, "Forest Pathway Frame", modal);
            createHotspotNode(slice, "frame-beach", 63, 62, "Beach Boardwalk Frame", modal);
        }
        // Panel 1 contains the leaf frames close to the wall corners
        if (i === 1) {
            createHotspotNode(slice, "frame-leaf", 45, 54, "Green Monstera Leaf Frame", modal);
        }
        // Panel 3 contains the sunset framing array on the right-hand wall
        if (i === 3) {
            createHotspotNode(slice, "frame-sunset", 48, 38, "Ocean Sunset Right Frame", modal);
        }
    }

    // Hotspot generator utility structure helper function
    function createHotspotNode(parentPanel, id, pctX, pctY, frameTitle, modalWindow) {
        const pin = document.createElement('div');
        pin.className = 'custom-hotspot';
        pin.id = id;
        pin.style.position = 'absolute';
        pin.style.left = pctX + '%';
        pin.style.top = pctY + '%';
        pin.style.transform = 'translate(-50%, -50%)';
        pin.setAttribute('title', frameTitle);

        pin.addEventListener('click', function(e) {
            e.stopPropagation(); // Stops camera panning events from triggering
            console.log("[CYLINDER] Opened: " + frameTitle);
            document.querySelector('.modal-title').textContent = frameTitle;
            modalWindow.classList.add('active');
        });

        parentPanel.appendChild(pin);
    }

    // 5. Camera tracking state logic controllers
    let isDragging = false;
    let baseMouseX = 0, baseMouseY = 0;
    let cameraRotationY = -62; // Starts looking directly forward at the TV console unit
    let cameraRotationX = 0;

    // Trigger starting angle setup position parameters
    stage3D.style.transform = `translateZ(0px) rotateX(${cameraRotationX}deg) rotateY(${cameraRotationY}deg)`;

    // 6. Navigation Drag-to-Pan 360 Environment Loop Event Handlers
    viewer.addEventListener('mousedown', function(e) {
        isDragging = true;
        viewer.style.cursor = 'grabbing';
        baseMouseX = e.clientX;
        baseMouseY = e.clientY;
    });

    window.addEventListener('mouseup', function() {
        isDragging = false;
        viewer.style.cursor = 'grab';
    });

    window.addEventListener('mousemove', function(e) {
        if (!isDragging) return;

        const deltaX = e.clientX - baseMouseX;
        const deltaY = e.clientY - baseMouseY;

        baseMouseX = e.clientX;
        baseMouseY = e.clientY;

        // Modifies view rotation vectors as you drag inside the 360 bubble container
        cameraRotationY += deltaX * 0.2;
        cameraRotationX -= deltaY * 0.2;

        // Clamp camera vertical tilt range so it doesn't flip completely upside down
        cameraRotationX = Math.max(-25, Math.min(25, cameraRotationX));

        // Render the smooth immersive look matrix changes instantly
        stage3D.style.transform = `translateZ(0px) rotateX(${cameraRotationX}deg) rotateY(${cameraRotationY}deg)`;
    });

    // 7. Pop-up panel modal window exit click tracking listeners
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

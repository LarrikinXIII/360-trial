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
        "panorama": "beach.jpeg", 
        "autoLoad": true,
        "hfov": 100,
        "pitch": 0,
        "yaw": 190,    
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


 const container = document.getElementById('canvas-container');
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const geometry = new THREE.SphereGeometry(500, 64, 40);
  geometry.scale(-1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 1 });
  scene.add(new THREE.Mesh(geometry, material));

  const textures = [];
  const loader = new THREE.TextureLoader();
  let viewerStarted = false;

  function startViewer() {
    if (viewerStarted) return;
    viewerStarted = true;
    material.map = textures[0]; material.needsUpdate = true;
    const el = document.getElementById('loading');
    el.style.opacity = '0'; setTimeout(() => el.style.display = 'none', 400);
    animate();
    // Load remaining scenes lazily
    loadNextScene(1);
  }

  function loadNextScene(i) {
    if (i >= SCENES.length) return;
    const dataUrl = 'data:image/jpeg;base64,' + SCENES[i].b64;
    // Set thumbnail lazily
    const thumbImg = document.getElementById('thumb-img-' + i);
    if (thumbImg) thumbImg.src = dataUrl;
    loader.load(dataUrl, tex => {
      tex.minFilter = THREE.LinearFilter; tex.magFilter = THREE.LinearFilter;
      textures[i] = tex;
      // Load next one after this completes
      loadNextScene(i + 1);
    });
  }

  // Load scene 0 first, start viewer immediately when ready
  document.getElementById('loading-text').textContent = 'Loading panorama…';
  const dataUrl0 = 'data:image/jpeg;base64,' + SCENES[0].b64;
  document.getElementById('thumb-img-0').src = dataUrl0;
  loader.load(dataUrl0, tex => {
    tex.minFilter = THREE.LinearFilter; tex.magFilter = THREE.LinearFilter;
    textures[0] = tex;
    document.getElementById('loading-bar').style.width = '100%';
    startViewer();
  }, undefined, (err) => {
    console.error('Failed to load scene 0', err);
  });

  let lon=SCENES[0].initialLon,lat=0,targetLon=SCENES[0].initialLon,targetLat=0,fov=75,autoRotate=false,currentScene=0,switching=false;
  let isDown=false,pSX=0,pSY=0,lonS=0,latS=0;
  function pDown(e){isDown=true;pSX=e.clientX??e.touches[0].clientX;pSY=e.clientY??e.touches[0].clientY;lonS=targetLon;latS=targetLat;}
  function pMove(e){if(!isDown)return;const cx=e.clientX??e.touches[0].clientX,cy=e.clientY??e.touches[0].clientY;targetLon=lonS-(cx-pSX)*0.28;targetLat=Math.max(-85,Math.min(85,latS+(cy-pSY)*0.28));}
  function pUp(){isDown=false;}
  container.addEventListener('mousedown',pDown);container.addEventListener('mousemove',pMove);
  container.addEventListener('mouseup',pUp);container.addEventListener('mouseleave',pUp);
  container.addEventListener('touchstart',pDown,{passive:true});container.addEventListener('touchmove',pMove,{passive:true});container.addEventListener('touchend',pUp);
  container.addEventListener('dblclick',resetView);
  container.addEventListener('wheel',e=>{fov=Math.max(30,Math.min(120,fov+e.deltaY*0.05));camera.fov=fov;camera.updateProjectionMatrix();document.getElementById('fov').value=fov;document.getElementById('fov-val').textContent=Math.round(fov)+'°';});

  function animate(){
    requestAnimationFrame(animate);
    if(autoRotate&&!isDown)targetLon+=0.12;
    lon+=(targetLon-lon)*0.08;lat+=(targetLat-lat)*0.08;
    const phi=THREE.MathUtils.degToRad(90-lat),theta=THREE.MathUtils.degToRad(lon);
    camera.lookAt(500*Math.sin(phi)*Math.cos(theta),500*Math.cos(phi),500*Math.sin(phi)*Math.sin(theta));
    renderer.render(scene,camera);
  }
  window.addEventListener('resize',()=>{camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight);});

  function switchScene(idx){
    if(idx===currentScene||switching)return;
    if(!textures[idx]){
      // Not loaded yet — load on demand then switch
      document.getElementById('scene-title').textContent='Loading…';
      const dataUrl = 'data:image/jpeg;base64,' + SCENES[idx].b64;
      loader.load(dataUrl, tex => {
        tex.minFilter = THREE.LinearFilter; tex.magFilter = THREE.LinearFilter;
        textures[idx] = tex;
        doSwitch(idx);
      });
      return;
    }
    doSwitch(idx);
  }
  function doSwitch(idx){
    switching=true;
    const overlay=document.getElementById('fade-overlay');overlay.classList.add('fading');
    setTimeout(()=>{currentScene=idx;material.map=textures[idx];material.needsUpdate=true;
      document.getElementById('scene-title').textContent=SCENES[idx].title;
      document.querySelectorAll('.scene-thumb').forEach((el,i)=>el.classList.toggle('active',i===idx));
      targetLon=SCENES[idx].initialLon;targetLat=0;overlay.classList.remove('fading');switching=false;},350);
  }
  function toggleAutoplay(){autoRotate=!autoRotate;const btn=document.getElementById('autoplay-btn');btn.textContent=autoRotate?'⏸ Pause':'▶ Auto Rotate';btn.classList.toggle('active',autoRotate);}
  function resetView(){targetLon=SCENES[currentScene].initialLon;targetLat=0;fov=75;camera.fov=75;camera.updateProjectionMatrix();document.getElementById('fov').value=75;document.getElementById('fov-val').textContent='75°';}
  function setFov(v){fov=+v;camera.fov=fov;camera.updateProjectionMatrix();document.getElementById('fov-val').textContent=Math.round(fov)+'°';}
  function toggleFullscreen(){if(!document.fullscreenElement)document.documentElement.requestFullscreen();else document.exitFullscreen();}

// --- 1. SETUP THREE.JS SCENE ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x020204, 0.002); // Fog menyatu dengan bg

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// --- 2. CREATE OBJECTS ---

// A. The Core (Torus Knot - Lebih kompleks & keren)
const geometryCore = new THREE.TorusKnotGeometry(6, 1.8, 150, 20);
const materialCore = new THREE.MeshStandardMaterial({ 
    color: 0x111111, 
    roughness: 0.1, 
    metalness: 0.9,
    wireframe: false
});
const coreMesh = new THREE.Mesh(geometryCore, materialCore);
scene.add(coreMesh);

// B. Wireframe Overlay (Icosahedron)
const geoWire = new THREE.IcosahedronGeometry(12, 1);
const matWire = new THREE.MeshBasicMaterial({ 
    color: 0x00f2ff, 
    wireframe: true, 
    transparent: true, 
    opacity: 0.1 
});
const wireMesh = new THREE.Mesh(geoWire, matWire);
scene.add(wireMesh);

// C. Star Particles (Bintang)
const starGeo = new THREE.BufferGeometry();
const starCount = 2000;
const starPos = new Float32Array(starCount * 3);
for(let i=0; i<starCount*3; i++) {
    starPos[i] = (Math.random() - 0.5) * 200; // Sebar luas
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const starMat = new THREE.PointsMaterial({
    color: 0xffffff, size: 0.15, transparent: true, opacity: 0.8
});
const starMesh = new THREE.Points(starGeo, starMat);
scene.add(starMesh);

// --- 3. LIGHTING ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Neon Lights
const pointLight1 = new THREE.PointLight(0x00f2ff, 2, 50);
pointLight1.position.set(10, 10, 10);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xbd00ff, 2, 50);
pointLight2.position.set(-10, -10, 10);
scene.add(pointLight2);

// --- 4. INTERACTION & ANIMATION LOGIC ---
let mouseX = 0; let mouseY = 0;
let targetX = 0; let targetY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2);
    mouseY = (e.clientY - window.innerHeight / 2);
});

// Raycaster untuk interaksi klik
const raycaster = new THREE.Raycaster();
const mouseVector = new THREE.Vector2();

document.addEventListener('click', (e) => {
    mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouseVector, camera);
    const intersects = raycaster.intersectObjects([coreMesh]);

    if (intersects.length > 0) {
        // Efek Putar Cepat saat klik
        gsap.to(coreMesh.rotation, {
            y: coreMesh.rotation.y + Math.PI,
            duration: 1.5,
            ease: "power3.out"
        });
        // Efek Scale
        gsap.to(coreMesh.scale, {
            x: 1.2, y: 1.2, z: 1.2,
            duration: 0.2, yoyo: true, repeat: 1
        });
        // Flash Color
        const oldColor = pointLight1.color.getHex();
        pointLight1.color.setHex(0xff00ff);
        setTimeout(() => pointLight1.color.setHex(oldColor), 300);
    }
});

// --- 5. RENDER LOOP ---
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();
    const scrollY = window.scrollY;

    // Rotasi Otomatis
    coreMesh.rotation.x += 0.002;
    coreMesh.rotation.y += 0.003;
    wireMesh.rotation.x -= 0.001;
    wireMesh.rotation.y -= 0.001;

    // Mouse Interaction (Parallax)
    targetX = mouseX * 0.0005;
    targetY = mouseY * 0.0005;
    coreMesh.rotation.y += 0.1 * (targetX - coreMesh.rotation.y);
    coreMesh.rotation.x += 0.1 * (targetY - coreMesh.rotation.x);

    // SCROLL ANIMATION (Warp Speed Effect & Object Movement)
    // 1. Bintang bergerak cepat saat scroll (Warp effect)
    starMesh.position.y = scrollY * 0.05; 
    starMesh.rotation.z = scrollY * 0.0002;

    // 2. Pindahkan Objek Utama ke kiri saat scroll (Agar tidak menutupi teks)
    let moveX = Math.max(-15, Math.min(0, -scrollY * 0.02)); 
    coreMesh.position.x = 5 + moveX;
    wireMesh.position.x = 5 + moveX;

    // 3. Zoom Out sedikit saat scroll
    camera.position.z = 30 + (scrollY * 0.01);

    renderer.render(scene, camera);
}
animate();

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- 6. UI ANIMATIONS (GSAP) ---

// Hapus Loader
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        loader.style.transform = "translateY(-100%)";
        
        // Intro Animations
        gsap.from(".glitch", { duration: 1, y: 50, opacity: 0, ease: "power4.out", delay: 0.5 });
        gsap.from(".hero-subtitle", { duration: 1, y: 30, opacity: 0, ease: "power3.out", delay: 0.8 });
        gsap.from(".btn-neon", { duration: 0.8, scale: 0, opacity: 0, ease: "back.out(1.7)", delay: 1.1 });
    }, 1000);
});

// Scroll Reveal
gsap.registerPlugin(ScrollTrigger);

const revealElements = document.querySelectorAll('.reveal-up');
revealElements.forEach(element => {
    gsap.fromTo(element, 
        { y: 50, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 1, ease: "power3.out",
            scrollTrigger: {
                trigger: element,
                start: "top 85%", // Animasi mulai saat elemen 85% dari atas layar
                toggleActions: "play none none reverse"
            }
        }
    );
});

// Custom Cursor Logic
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;
    
    // Dot instant
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;
    
    // Outline smooth
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// Hover Effects for Cursor
document.querySelectorAll('.hover-trigger').forEach(el => {
    el.addEventListener('mouseenter', () => cursorOutline.classList.add('active'));
    el.addEventListener('mouseleave', () => cursorOutline.classList.remove('active'));
});
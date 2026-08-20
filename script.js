// --- 1. SETUP THREE.JS SCENE ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x020204, 0.002);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// --- 2. CREATE OBJECTS ---

// A. The Core (Torus Knot)
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
    starPos[i] = (Math.random() - 0.5) * 200;
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
        gsap.to(coreMesh.rotation, {
            y: coreMesh.rotation.y + Math.PI,
            duration: 1,
            ease: "power3.out"
        });
        gsap.to(coreMesh.scale, {
            x: 1.2, y: 1.2, z: 1.2,
            duration: 0.2, yoyo: true, repeat: 1
        });
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

    coreMesh.rotation.x += 0.002;
    coreMesh.rotation.y += 0.003;
    wireMesh.rotation.x -= 0.001;
    wireMesh.rotation.y -= 0.001;

    targetX = mouseX * 0.0005;
    targetY = mouseY * 0.0005;
    coreMesh.rotation.y += 0.1 * (targetX - coreMesh.rotation.y);
    coreMesh.rotation.x += 0.1 * (targetY - coreMesh.rotation.x);

    starMesh.position.y = scrollY * 0.05; 
    starMesh.rotation.z = scrollY * 0.0002;

    let moveX = Math.max(-15, Math.min(0, -scrollY * 0.02)); 
    coreMesh.position.x = 5 + moveX;
    wireMesh.position.x = 5 + moveX;

    camera.position.z = 30 + (scrollY * 0.01);

    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- 6. UI ANIMATIONS (GSAP) - DIPERCEPAT ---

window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        loader.style.transform = "translateY(-100%)";
        
        // Animasi Intro Hero Section (Dibuat lebih cepat & jeda dipersingkat)
        gsap.from(".glitch", { duration: 0.5, y: 30, opacity: 0, ease: "power2.out", delay: 0.2 });
        gsap.from(".hero-subtitle", { duration: 0.5, y: 20, opacity: 0, ease: "power2.out", delay: 0.4 });
        gsap.from(".btn-neon", { duration: 0.4, scale: 0.8, opacity: 0, ease: "back.out(1.5)", delay: 0.6 });
    }, 400); // Waktu loading screen hilang dipercepat
});

// Scroll Reveal Section (Animasi muncul elemen saat di-scroll dibuat jauh lebih cepat)
gsap.registerPlugin(ScrollTrigger);

const revealElements = document.querySelectorAll('.reveal-up');
revealElements.forEach(element => {
    gsap.fromTo(element, 
        { y: 30, opacity: 0 },
        {
            y: 0, 
            opacity: 1, 
            duration: 0.4, // Dipercepat dari 1s menjadi 0.4s
            ease: "power2.out",
            scrollTrigger: {
                trigger: element,
                start: "top 90%", // Muncul lebih awal ketika elemen mendekati layar
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
    
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;
    
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 250, fill: "forwards" });
});

document.querySelectorAll('.hover-trigger').forEach(el => {
    el.addEventListener('mouseenter', () => cursorOutline.classList.add('active'));
    el.addEventListener('mouseleave', () => cursorOutline.classList.remove('active'));
});
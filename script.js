// --- TRANSLATION DICTIONARY ---
const translations = {
    id: {
        "nav-home": "Home",
        "nav-about": "About",
        "nav-projects": "Projects",
        "nav-achievements": "Prestasi",
        "nav-hobbies": "Hobbies",
        "nav-contact": "Contact",
        "hero-tag": "HELLO WORLD, I AM",
        "hero-sub": "Fullstack Web Developer (Frontend & Backend Enthusiast). Building modern & scalable web applications.",
        "hero-btn": "Explore My Work",
        "about-title": "About <span>Me</span>",
        "about-p1": "Halo! Nama saya <strong class=\"highlight\">Gilten Rexcia</strong>. Saya adalah seorang <strong class=\"highlight\">Fullstack Web Developer</strong> yang memiliki passion mendalam dalam membangun aplikasi web utuh dari sisi Frontend hingga Backend.",
        "about-p2": "Saat ini saya berusia <strong>17 tahun</strong>, berjenis kelamin <strong>Laki-laki</strong>.",
        "about-p3": "Saya terbiasa merancang antarmuka yang modern, responsif, serta mengelola logika server dan basis data secara efisien.",
        "tech-all": "All",
        "projects-title": "Featured <span>Projects</span>",
        "proj-1-desc": "Aplikasi web interaktif dengan sistem autentikasi dan manajemen data real-time.",
        "proj-2-desc": "Backend API berkinerja tinggi untuk pengelolaan data terintegrasi database.",
        "proj-3-desc": "Website profil perusahaan interaktif dengan tampilan modern dan animasi halus.",
        "btn-visit": "<i class=\"fas fa-external-link-alt\"></i> Visit Website",
        "achievements-title": "My <span>Achievements</span>",
        "ach-1-title": "Juara 1 Bahasa Inggris",
        "ach-1-desc": "Kompetisi tingkat sekolah.",
        "ach-2-desc": "Prestasi akademik unggulan.",
        "hobbies-title": "My <span>Hobbies</span>",
        "hobby-1-title": "Berenang",
        "hobby-1-desc": "Menjaga stamina tubuh.",
        "hobby-2-desc": "Strategi & Refreshing.",
        "hobby-3-desc": "Melatih reflek & fokus.",
        "hobby-4-desc": "Akurasi & Konsentrasi.",
        "contact-title": "Get In <span>Touch</span>",
        "email-label": "Email (Klik untuk salin)",
        "wa-label": "WhatsApp (Klik untuk salin)"
    },
    en: {
        "nav-home": "Home",
        "nav-about": "About",
        "nav-projects": "Projects",
        "nav-achievements": "Achievements",
        "nav-hobbies": "Hobbies",
        "nav-contact": "Contact",
        "hero-tag": "HELLO WORLD, I AM",
        "hero-sub": "Fullstack Web Developer (Frontend & Backend Enthusiast). Building modern & scalable web applications.",
        "hero-btn": "Explore My Work",
        "about-title": "About <span>Me</span>",
        "about-p1": "Hello! My name is <strong class=\"highlight\">Gilten Rexcia</strong>. I am a <strong class=\"highlight\">Fullstack Web Developer</strong> with a deep passion for building complete web applications from Frontend to Backend.",
        "about-p2": "I am currently <strong>17 years old</strong>, male.",
        "about-p3": "I am used to designing modern, responsive user interfaces, and managing server-side logic and databases efficiently.",
        "tech-all": "All",
        "projects-title": "Featured <span>Projects</span>",
        "proj-1-desc": "Interactive web application featuring user authentication and real-time data management.",
        "proj-2-desc": "High-performance backend API service integrated with efficient database management.",
        "proj-3-desc": "Interactive company profile website with a sleek modern design and smooth animations.",
        "btn-visit": "<i class=\"fas fa-external-link-alt\"></i> Visit Website",
        "achievements-title": "My <span>Achievements</span>",
        "ach-1-title": "1st Place English Contest",
        "ach-1-desc": "School-level competition.",
        "ach-2-desc": "Excellence in academic achievement.",
        "hobbies-title": "My <span>Hobbies</span>",
        "hobby-1-title": "Swimming",
        "hobby-1-desc": "Maintaining body stamina.",
        "hobby-2-desc": "Strategy & Refreshing.",
        "hobby-3-desc": "Reflexes & Focus training.",
        "hobby-4-desc": "Accuracy & Concentration.",
        "contact-title": "Get In <span>Touch</span>",
        "email-label": "Email (Click to copy)",
        "wa-label": "WhatsApp (Click to copy)"
    }
};

let currentLang = 'id';

function setLanguage(lang) {
    currentLang = lang;
    const elements = document.querySelectorAll('[data-lang]');
    elements.forEach(el => {
        const key = el.getAttribute('data-lang');
        if (translations[lang] && translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    const switchToggle = document.getElementById('switch-toggle');
    const idText = document.getElementById('lang-id-text');
    const enText = document.getElementById('lang-en-text');

    if (lang === 'en') {
        switchToggle.classList.add('en');
        enText.classList.add('active');
        idText.classList.remove('active');
    } else {
        switchToggle.classList.remove('en');
        idText.classList.add('active');
        enText.classList.remove('active');
    }
}

document.getElementById('lang-switcher').addEventListener('click', () => {
    playSound(700, 'sine', 0.05);
    const newLang = currentLang === 'id' ? 'en' : 'id';
    setLanguage(newLang);
});

document.getElementById('lang-id-text').classList.add('active');

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
const geometryCore = new THREE.TorusKnotGeometry(6, 1.8, 150, 20);
const materialCore = new THREE.MeshStandardMaterial({ 
    color: 0x111111, 
    roughness: 0.1, 
    metalness: 0.9,
    wireframe: false
});
const coreMesh = new THREE.Mesh(geometryCore, materialCore);
scene.add(coreMesh);

const geoWire = new THREE.IcosahedronGeometry(12, 1);
const matWire = new THREE.MeshBasicMaterial({ 
    color: 0x00f2ff, 
    wireframe: true, 
    transparent: true, 
    opacity: 0.1 
});
const wireMesh = new THREE.Mesh(geoWire, matWire);
scene.add(wireMesh);

const starGeo = new THREE.BufferGeometry();
const starCount = 2500;
const starPos = new Float32Array(starCount * 3);
for(let i=0; i<starCount*3; i++) {
    starPos[i] = (Math.random() - 0.5) * 200;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const starMat = new THREE.PointsMaterial({
    color: 0x00f2ff, size: 0.18, transparent: true, opacity: 0.7
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

const raycaster = new THREE.Raycaster();
const mouseVector = new THREE.Vector2();

document.addEventListener('click', (e) => {
    mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouseVector, camera);
    const intersects = raycaster.intersectObjects([coreMesh]);

    if (intersects.length > 0) {
        playSound(600, 'triangle', 0.2);
        gsap.to(coreMesh.rotation, {
            y: coreMesh.rotation.y + Math.PI,
            duration: 0.5,
            ease: "power3.out"
        });
        gsap.to(coreMesh.scale, {
            x: 1.25, y: 1.25, z: 1.25,
            duration: 0.15, yoyo: true, repeat: 1
        });
        const oldColor = pointLight1.color.getHex();
        pointLight1.color.setHex(0xff00ff);
        setTimeout(() => pointLight1.color.setHex(oldColor), 200);
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

    targetX = mouseX * 0.0008;
    targetY = mouseY * 0.0008;
    coreMesh.rotation.y += 0.1 * (targetX - coreMesh.rotation.y);
    coreMesh.rotation.x += 0.1 * (targetY - coreMesh.rotation.x);

    starMesh.rotation.y = elapsedTime * 0.02 + (mouseX * 0.0001);
    starMesh.rotation.x = (mouseY * 0.0001);

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

// --- 6. UI ANIMATIONS ---
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    loader.style.transform = "translateY(-100%)";
    
    gsap.from(".glitch", { duration: 0.25, y: 15, opacity: 0, ease: "power2.out" });
    gsap.from(".hero-subtitle", { duration: 0.25, y: 10, opacity: 0, ease: "power2.out", delay: 0.05 });
    gsap.from(".btn-neon", { duration: 0.25, scale: 0.95, opacity: 0, ease: "back.out(1.5)", delay: 0.1 });
});

gsap.registerPlugin(ScrollTrigger);

const revealElements = document.querySelectorAll('.reveal-up');
revealElements.forEach(element => {
    gsap.fromTo(element, 
        { y: 15, opacity: 0 },
        {
            y: 0, 
            opacity: 1, 
            duration: 0.25,
            ease: "power2.out",
            scrollTrigger: {
                trigger: element,
                start: "top 95%",
                toggleActions: "play none none reverse"
            }
        }
    );
});

const tiltCards = document.querySelectorAll('.info-card');
tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
});

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
    }, { duration: 100, fill: "forwards" });
});

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(freq, type = 'sine', duration = 0.08) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

document.querySelectorAll('.hover-trigger, .btn-neon, .contact-box, .btn-project').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorOutline.classList.add('active');
        playSound(440, 'sine', 0.05);
    });
    el.addEventListener('mouseleave', () => {
        cursorOutline.classList.remove('active');
    });
});

function copyToClipboard(text, message) {
    playSound(880, 'triangle', 0.1);
    navigator.clipboard.writeText(text).then(() => {
        showToast(message);
    });
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function filterTech(category, event) {
    playSound(520, 'sine', 0.08);
    const items = document.querySelectorAll('.tech-item');
    const buttons = document.querySelectorAll('.tab-btn');

    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    items.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = 'block';
            gsap.fromTo(item, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.15 });
        } else {
            item.style.display = 'none';
        }
    });
}

// --- BGM CONTROLLER LOGIC ---
const bgmAudio = document.getElementById('bgm-audio');
const bgmPlayBtn = document.getElementById('bgm-play-btn');
const bgmMuteBtn = document.getElementById('bgm-mute-btn');

let isPlaying = false;

function startBGM() {
    if (!isPlaying) {
        bgmAudio.play().then(() => {
            isPlaying = true;
            bgmPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
            bgmPlayBtn.classList.add('active');
            removeAutoPlayListeners();
        }).catch(err => {
            console.log("Autoplay terhalang kebijakan browser, menunggu interaksi user:", err);
        });
    }
}

startBGM();

function handleFirstInteraction() {
    startBGM();
}

function removeAutoPlayListeners() {
    window.removeEventListener('click', handleFirstInteraction);
    window.removeEventListener('scroll', handleFirstInteraction);
    window.removeEventListener('mousemove', handleFirstInteraction);
    window.removeEventListener('keydown', handleFirstInteraction);
}

window.addEventListener('click', handleFirstInteraction);
window.addEventListener('scroll', handleFirstInteraction);
window.addEventListener('mousemove', handleFirstInteraction);
window.addEventListener('keydown', handleFirstInteraction);

bgmPlayBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isPlaying) {
        bgmAudio.pause();
        bgmPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
        bgmPlayBtn.classList.remove('active');
        isPlaying = false;
    } else {
        bgmAudio.play();
        bgmPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
        bgmPlayBtn.classList.add('active');
        isPlaying = true;
    }
});

bgmMuteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    bgmAudio.muted = !bgmAudio.muted;
    if (bgmAudio.muted) {
        bgmMuteBtn.innerHTML = '<i class="fas fa-volume-xmark"></i>';
        bgmMuteBtn.classList.add('active');
    } else {
        bgmMuteBtn.innerHTML = '<i class="fas fa-volume-high"></i>';
        bgmMuteBtn.classList.remove('active');
    }
});

// --- AI CHATBOT ASSISTANT LOGIC (PANGGIL VERCEL SERVERLESS FUNCTION) ---
const aiToggleBtn = document.getElementById('ai-toggle-btn');
const aiCloseBtn = document.getElementById('ai-close-btn');
const aiChatBox = document.getElementById('ai-chat-box');
const aiSendBtn = document.getElementById('ai-send-btn');
const aiUserInput = document.getElementById('ai-user-input');
const aiMessagesContainer = document.getElementById('ai-chat-messages');

aiToggleBtn.addEventListener('click', () => {
    playSound(600, 'sine', 0.05);
    aiChatBox.classList.toggle('active');
});

aiCloseBtn.addEventListener('click', () => {
    aiChatBox.classList.remove('active');
});

async function handleSendAIMessage() {
    const text = aiUserInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    aiUserInput.value = '';
    playSound(500, 'sine', 0.05);

    const loadingMsg = appendMessage("Sedang berpikir...", 'bot');

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: text })
        });

        const data = await response.json();

        if (data.error) {
            loadingMsg.innerText = `Error: ${data.error}`;
            return;
        }

        loadingMsg.innerText = data.reply;
        playSound(800, 'sine', 0.05);
    } catch (err) {
        console.error("Error Fetch:", err);
        loadingMsg.innerText = "Maaf, terjadi masalah koneksi AI.";
    }
}

function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `ai-msg ${sender}`;
    msgDiv.innerText = text;
    aiMessagesContainer.appendChild(msgDiv);
    aiMessagesContainer.scrollTop = aiMessagesContainer.scrollHeight;
    return msgDiv;
}

aiSendBtn.addEventListener('click', handleSendAIMessage);
aiUserInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSendAIMessage();
});
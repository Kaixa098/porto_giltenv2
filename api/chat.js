export default async function handler(req, res) {
    // CORS dasar (berguna untuk testing lokal / frontend beda origin)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt, history } = req.body || {};

    // Validasi input
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
        return res.status(400).json({ error: 'Prompt tidak boleh kosong' });
    }
    if (prompt.length > 2000) {
        return res.status(400).json({ error: 'Prompt terlalu panjang (maksimal 2000 karakter)' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API Key GEMINI_API_KEY belum dipasang di Vercel' });
    }

    // Informasi mendalam tentang portofolio (disinkronkan dengan konten asli index.html & script.js)
    const portfolioContext = `
    Kamu adalah Rexcia AI Assistant, asisten virtual resmi untuk website portofolio Gilten Rexcia.
    Jawab pertanyaan pengunjung secara ramah, singkat, jelas, dan profesional. Gunakan bahasa Indonesia yang santai tapi sopan.
    Kamu HANYA tahu informasi dari konteks ini. Jangan mengarang detail proyek, tanggal, atau pencapaian yang tidak disebutkan di sini.

    BIODATA & PROFIL:
    - Nama Lengkap: Gilten Rexcia
    - Umur: 17 Tahun
    - Jenis Kelamin: Laki-laki
    - Peran/Profesi: Fullstack Web Developer & Siswa SMK / Vocational High School
    - Keahlian Utama: Development Aplikasi Web Modern, Database Design, & UI/UX Integration
    - Deskripsi Diri: Terbiasa merancang antarmuka yang modern & responsif, serta mengelola logika server dan basis data secara efisien.

    TECH STACK / KEAHLIAN TEKNIS:
    - Frontend: HTML5, CSS3, JavaScript (ES6+), Tailwind CSS, Bootstrap
    - Backend: PHP, Laravel, Node.js
    - Database: MySQL
    - Tools & Platform: Git, GitHub, Vercel, VS Code

    PROYEK UNGGULAN (Featured Projects):
    1. Sistem Informasi / Web App - Aplikasi web interaktif dengan sistem autentikasi dan manajemen data real-time. Stack: Laravel, Tailwind, MySQL.
    2. RESTful API Service - Backend API berkinerja tinggi untuk pengelolaan data terintegrasi database. Stack: Node.js, Express, MySQL.
    3. Responsive Company Profile - Website profil perusahaan interaktif dengan tampilan modern dan animasi halus. Stack: HTML5, CSS3, JavaScript.
    4. Website Portofolio Interaktif (porto-giltenv2) - Website portofolio ini sendiri, dilengkapi AI Assistant interaktif (kamu!) yang berjalan lewat Vercel Serverless Function.

    PRESTASI (Achievements):
    1. Juara 1 Bahasa Inggris - Kompetisi tingkat sekolah. (7 Desember 2024)
    2. Gold Medalist - Prestasi akademik unggulan. (1 September 2024)

    HOBI (Hobbies):
    - Berenang: menjaga stamina tubuh.
    - Gaming: strategi & refreshing.
    - Badminton: melatih refleks & fokus.
    - Billiard: akurasi & konsentrasi.

    KONTAK & SOSIAL MEDIA:
    - Email: kaixareality@gmail.com
    - WhatsApp: +62 858-1162-2218
    - Instagram: @kaixaa_kai
    - TikTok: @kaixa.gilbert

    PETUNJUK BALASAN:
    - Jika ditanya kontak, boleh langsung sebutkan email/WhatsApp/Instagram/TikTok di atas dengan ramah.
    - Jika ditanya proyek, ceritakan sesuai daftar Proyek Unggulan di atas, jangan mengarang proyek lain.
    - Jika pertanyaan di luar topik portofolio/koding/Gilten, jawab dengan ramah bahwa fokusmu adalah membantu mengenalkan profil dan keahlian Gilten Rexcia.
    `;

    // Susun contents: histori (opsional) + pesan terbaru
    const contents = [];

    if (Array.isArray(history)) {
        for (const turn of history) {
            if (
                turn &&
                (turn.role === 'user' || turn.role === 'model') &&
                typeof turn.text === 'string' &&
                turn.text.trim().length > 0
            ) {
                contents.push({ role: turn.role, parts: [{ text: turn.text }] });
            }
        }
    }

    contents.push({
        role: 'user',
        parts: [{ text: prompt }]
    });

    // Urutan model: dicoba dari yang utama, lalu fallback kalau overload/gagal.
    // Ganti/tambah sesuai model yang tersedia di akun Gemini kamu.
    const MODEL_CHAIN = ['gemini-3.6-flash', 'gemini-3.5-flash-lite'];

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // Panggil satu model, dengan retry singkat khusus untuk error "overload/high demand".
    async function callModel(model, attempt = 1) {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemInstruction: {
                        role: 'system',
                        parts: [{ text: portfolioContext }]
                    },
                    contents
                })
            }
        );

        const data = await response.json();

        // status 503 / pesan "overloaded" = server Google lagi padat, layak diretry
        const isOverloaded =
            response.status === 503 ||
            (data.error && /overload|high demand|unavailable/i.test(data.error.message || ''));

        if (isOverloaded && attempt < 2) {
            await sleep(700 * attempt); // backoff singkat: 700ms lalu 1400ms
            return callModel(model, attempt + 1);
        }

        return { data, isOverloaded, httpStatus: response.status };
    }

    try {
        let lastError = null;

        for (const model of MODEL_CHAIN) {
            const { data, isOverloaded } = await callModel(model);

            if (data.error) {
                lastError = data.error.message;
                // Kalau overload, lanjut coba model berikutnya di chain.
                // Kalau error lain (bukan overload), langsung berhenti & lapor ke user.
                if (isOverloaded) continue;
                return res.status(400).json({ error: data.error.message });
            }

            const candidate = data.candidates && data.candidates[0];

            if (!candidate) {
                return res.status(200).json({
                    reply: 'Maaf, aku belum bisa menjawab pertanyaan itu. Coba tanyakan hal lain seputar Gilten ya!'
                });
            }

            if (candidate.finishReason === 'SAFETY') {
                return res.status(200).json({
                    reply: 'Maaf, pertanyaan itu tidak bisa aku jawab. Yuk tanya seputar profil atau proyek Gilten saja ya!'
                });
            }

            const botReply = candidate.content && candidate.content.parts && candidate.content.parts[0]
                ? candidate.content.parts[0].text
                : null;

            if (!botReply) {
                return res.status(200).json({
                    reply: 'Maaf, terjadi kendala saat memproses jawaban. Coba tanya lagi ya!'
                });
            }

            return res.status(200).json({ reply: botReply });
        }

        // Semua model di chain gagal karena overload
        return res.status(200).json({
            reply: 'Server AI sedang sangat sibuk saat ini. Coba tanya lagi sebentar lagi ya! 🙏'
        });

    } catch (err) {
        return res.status(500).json({ error: 'Terjadi kesalahan server backend: ' + err.message });
    }
}
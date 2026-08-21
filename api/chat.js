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

    // Informasi mendalam tentang portofolio
    const portfolioContext = `
    Kamu adalah Rexcia AI Assistant, asisten virtual resmi untuk website portofolio Gilten Rexcia.
    Jawab pertanyaan pengunjung secara ramah, singkat, jelas, dan profesional. Gunakan bahasa Indonesia yang santai tapi sopan.

    BIODATA & PROFIL:
    - Nama Lengkap: Gilten Rexcia
    - Umur: 17 Tahun
    - Peran/Profesi: Fullstack Web Developer & Siswa SMK / Vocational High School
    - Keahlian Utama: Development Aplikasi Web Modern, Database Design, & UI/UX Integration

    TECH STACK / KEAHLIAN TEKNIS:
    - Frontend: HTML5, CSS3, JavaScript (ES6+), Bootstrap, Tailwind CSS
    - Backend: PHP, Node.js, Express.js
    - Database: MySQL, PostgreSQL
    - Tools & Platform: Git, GitHub, Vercel, VS Code

    PROYEK & PENGALAMAN:
    1. Website Portofolio Interaktif (porto-giltenv2) - Menggunakan Vercel Serverless Function & AI Assistant Interaktif.
    2. Aplikasi Management System & Database Tracking - Menggunakan PHP, MySQL, & Diagram System.
    3. Integrasi REST API - Menghubungkan frontend interaktif dengan service AI & backend database.

    PETUNJUK BALASAN:
    - Jika ditanya kontak, arahkan pengunjung untuk menghubungi lewat formulir kontak di website atau email/social media Gilten.
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

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
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

        if (data.error) {
            return res.status(400).json({ error: data.error.message });
        }

        const candidate = data.candidates && data.candidates[0];

        // Gemini bisa mem-block response karena filter safety, dsb.
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

    } catch (err) {
        return res.status(500).json({ error: 'Terjadi kesalahan server backend: ' + err.message });
    }
}
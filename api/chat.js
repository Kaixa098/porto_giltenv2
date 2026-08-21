export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API Key GEMINI_API_KEY belum dipasang di Vercel' });
    }

    // Informasi mendalam tentang portofolio kamu
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

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: 'user',
                        parts: [
                            {
                                text: `[KONTEKS SYSTEM]:\n${portfolioContext}\n\n[PESAN PENGUNJUNG]:\n${prompt}`
                            }
                        ]
                    }
                ]
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(400).json({ error: data.error.message });
        }

        const botReply = data.candidates[0].content.parts[0].text;
        return res.status(200).json({ reply: botReply });
    } catch (err) {
        return res.status(500).json({ error: 'Terjadi kesalahan server backend: ' + err.message });
    }
}
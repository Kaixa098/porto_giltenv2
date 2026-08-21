export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;

    try {
        const response = await fetch('https://text.pollinations.ai/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'system',
                        content: 'Kamu adalah Rexcia AI Assistant untuk portofolio Gilten Rexcia, seorang Fullstack Web Developer. Jawab pertanyaan pengunjung secara ramah, singkat, dan profesional.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                model: 'openai'
            })
        });

        const botReply = await response.text();
        return res.status(200).json({ reply: botReply });
    } catch (err) {
        return res.status(500).json({ error: 'Terjadi kesalahan server backend: ' + err.message });
    }
}
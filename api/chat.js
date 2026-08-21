export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;
    const apiKey = process.env.HF_TOKEN;

    if (!apiKey) {
        return res.status(500).json({ error: 'HF_TOKEN belum dikonfigurasi di Vercel' });
    }

    try {
        const response = await fetch('https://api-inference.huggingface.co/models/Qwen/Qwen2.5-Coder-32B-Instruct/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'Qwen/Qwen2.5-Coder-32B-Instruct',
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
                max_tokens: 500
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(400).json({ error: typeof data.error === 'string' ? data.error : data.error.message });
        }

        const botReply = data.choices[0].message.content;
        return res.status(200).json({ reply: botReply });
    } catch (err) {
        return res.status(500).json({ error: 'Terjadi kesalahan server backend' });
    }
}
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API Key OpenRouter belum dikonfigurasi di Vercel' });
    }

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://porto-giltenv2.vercel.app',
                'X-Title': 'Portfolio Rexcia AI'
            },
            body: JSON.stringify({
                models: [
                    'qwen/qwen-2.5-7b-instruct:free',
                    'mistralai/mistral-7b-instruct:free',
                    'meta-llama/llama-3.1-8b-instruct:free'
                ],
                messages: [
                    {
                        role: 'system',
                        content: 'Kamu adalah Rexcia AI Assistant untuk portofolio Gilten Rexcia, seorang Fullstack Web Developer. Jawab pertanyaan pengunjung secara ramah, singkat, dan profesional.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(400).json({ error: data.error.message });
        }

        const botReply = data.choices[0].message.content;
        return res.status(200).json({ reply: botReply });
    } catch (err) {
        return res.status(500).json({ error: 'Terjadi kesalahan server backend' });
    }
}
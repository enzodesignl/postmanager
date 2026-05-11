export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ erro: "Método não permitido" });
  }

  try {
    const { mensagem } = req.body;

    const prompt = `
Crie uma imagem quadrada pronta para postar no Instagram.

Tema do post:
${mensagem}

Estilo visual:
- design premium
- fundo preto
- detalhes em laranja
- tipografia moderna
- composição minimalista
- visual de carrossel profissional
- alta legibilidade
- formato 1:1
- pronto para publicar

A imagem deve parecer um slide de carrossel feito por designer.
`;

    const resposta = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: prompt,
        size: "1024x1024"
      })
    });

    const data = await resposta.json();

    if (!resposta.ok) {
      return res.status(500).json({
        erro: data.error?.message || "Erro ao gerar imagem"
      });
    }

    return res.status(200).json({
      imagem: data.data[0].b64_json
    });

  } catch (erro) {
    return res.status(500).json({
      erro: erro.message
    });
  }
}

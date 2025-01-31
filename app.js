require('dotenv').config();
const express = require("express");
const axios = require("axios");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '.')));

app.get('/converter', async (req, res) => {
    console.log("Rota /converter acessada!");
    console.log("__dirname:", __dirname);
    console.log("Query parameters:", req.query);

    const { valor, moedaOrigem, moedaDestino } = req.query;

    if (!valor || !moedaOrigem || !moedaDestino) {
        return res.status(400).json({ erro: "Parâmetros valor, moedaOrigem e moedaDestino são obrigatórios." });
    }

    try {

        //Por algum motivo, a porcaria abaixo nao funciona
        // aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa


        // const apiKey = process.env.API_KEY;
        // if (!apiKey) {
        //     console.error("Chave de API não configurada no .env");
        //     return res.status(500).json({ erro: "Erro de configuração do servidor (API Key não configurada)" }); // Mensagem mais específica
        // }

        const url = `https://v6.exchangerate-api.com/v6/b083f6e8bb052e70709e5f55/latest/${moedaOrigem.toUpperCase()}`; // Converte moedaOrigem para maiúsculas
        console.log("URL da API externa", url);

        const response = await axios.get(url);
        console.log("Resposta da API:", response); // Imprime a resposta completa para debug

        //Verifica se a resposta possui o campo 'result'
        if (!response.data || !response.data.result) {
            console.error("Resposta da API em formato inesperado", response.data)
            return res.status(500).json({ erro: "Resposta da API em formato inesperado." });
        }

        const data = response.data;

        if (data.result !== "success") {
            console.error("Erro na API de câmbio:", data);
            return res.status(500).json({ erro: `Erro na API de câmbio: ${data['error-type'] || 'Erro desconhecido'}` }); //acessando o erro com colchetes para caso o nome da chave tenha hifen
        }

        let taxaCambio;

        if (moedaOrigem.toUpperCase() === moedaDestino.toUpperCase()) { // Compara em maiúsculas
            taxaCambio = 1;
        } else if (data.conversion_rates && data.conversion_rates[moedaDestino.toUpperCase()]) { // Verifica se conversion_rates existe e a moedaDestino existe dentro dele. Converte moedaDestino para maiúsculas
            taxaCambio = data.conversion_rates[moedaDestino.toUpperCase()];
        } else {
            console.error("Moeda de destino não encontrada:", moedaDestino);
            return res.status(400).json({ erro: "Moeda de destino não encontrada." });
        }

        const valorConvertido = parseFloat(valor);

        if (isNaN(valorConvertido)) {
            return res.status(400).json({ erro: "Valor informado é inválido." });
        }

        const resultado = valorConvertido * taxaCambio;
        res.json({ resultado: resultado.toFixed(2) });
        console.log("Resposta enviada com sucesso:", { resultado: resultado.toFixed(2) });

    } catch (error) {
        console.error("Erro na conversão:", error);
        if (error.response) {
            console.error("Dados da resposta:", error.response.data);
            console.error("Status da resposta:", error.response.status);
            console.error("Headers da resposta:", error.response.headers);
        } else if (error.request) {
            console.error("Nao houve resposta do servidor.");
        } else {
            console.error('Erro na configuração da requisição:', error.message);
        }
        res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

// git branch -M main
// git push -u origin main
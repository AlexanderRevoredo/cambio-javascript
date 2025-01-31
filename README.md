# conversor-moedas

 Este projeto é um conversor de moedas simples, mas funcional, que desenvolvi para praticar minhas habilidades com Node.js, Express e consumo de APIs. A ideia principal era criar uma ferramenta rápida para converter valores entre diferentes moedas usando dados atualizados.

## O que ele faz?

Basicamente, ele pega um valor, a moeda de origem e a moeda de destino, e retorna o valor convertido com a taxa de câmbio atual. Bem direto ao ponto!

## Por que usar uma API de câmbio?

As taxas de câmbio mudam o tempo todo. Para ter informações precisas e atualizadas, é necessário usar uma fonte confiável que forneça esses dados em tempo real. É aí que entram as APIs de câmbio, como a ExchangeRate-API, que este projeto utiliza. Sem uma API, seria muito difícil (e trabalhoso) manter as taxas de câmbio atualizadas manualmente.

## Como funciona por baixo dos panos?

*   Uso o Node.js com o framework Express para criar um servidor web.
*   Para buscar as taxas de câmbio, estou usando a API da ExchangeRate-API (v6).
*   O Axios me ajuda a fazer as requisições HTTP para essa API.
*   Usei o dotenv para gerenciar as variáveis de ambiente, principalmente a chave da API, para não expor ela no código.
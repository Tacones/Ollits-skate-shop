# Importação do catálogo Osso Skate Shop

Este diretório é a fronteira entre a fonte autorizada do fornecedor e o catálogo consumido pela loja.

## Fonte

- Fornecedor: Osso Skate Shop
- Arquivo de entrada atual: `supplier-catalog.json`
- Estado atual: vazio, aguardando o catálogo real autorizado.

## Campos aceitos

Cada produto deve trazer somente dados presentes na fonte do fornecedor:

- `id` / SKU
- nome
- marca
- categoria
- preço
- preço promocional, quando existir
- variações/tamanhos
- descrição
- especificações
- imagens e textos alternativos
- disponibilidade e estoque, quando informado

Não preencher campos ausentes com valores estimados, fictícios ou derivados sem confirmação.

Após receber o arquivo real, ele pode ser transformado no contrato de `src/data/catalog-schema.ts`, mantendo a camada visual desacoplada da origem.

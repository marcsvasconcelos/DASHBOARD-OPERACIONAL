# Dashboard Operacional

Dashboard de indicadores operacionais desenvolvido como projeto web. A interface é responsiva, está em português brasileiro e utiliza somente HTML, CSS e JavaScript puro.

**Acesse o site:** [Dashboard Operacional](https://marcsvasconcelos.github.io/DASHBOARD-OPERACIONAL/)

## O que o painel mostra

- Total de casos, casos abertos e casos fechados.
- SLA percentual: casos fechados dentro do prazo divididos pelo total de casos fechados.
- Gráfico de barras com casos abertos e fechados por mês.
- Tabela com os resultados por empresa.
- Filtro por empresa que atualiza os indicadores, o gráfico e a tabela.

Todos os dados são **fictícios** e estão definidos em `script.js`. Os indicadores são calculados a partir desses registros. O projeto não usa APIs, backend, frameworks nem serviços externos.

## Como abrir localmente

Baixe ou clone o repositório e abra `index.html` no navegador. Não é necessário instalar dependências.

## Arquivos principais

| Arquivo | Responsabilidade |
| --- | --- |
| `index.html` | Estrutura e conteúdo da página. |
| `style.css` | Layout, aparência e adaptação a diferentes telas. |
| `script.js` | Dados fictícios, cálculos, gráfico, tabela e filtro. |

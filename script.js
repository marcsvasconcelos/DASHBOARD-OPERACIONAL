"use strict";

// Cada registro reúne casos fictícios de uma empresa, pelo mês de abertura.
// "No prazo" considera somente os casos fechados. Abertos + fechados = total.
const registros = [
  { empresa: "Aurora Tecnologia", mes: 0, abertos: 12, fechados: 56, noPrazo: 52 },
  { empresa: "Aurora Tecnologia", mes: 1, abertos: 15, fechados: 62, noPrazo: 59 },
  { empresa: "Aurora Tecnologia", mes: 2, abertos: 10, fechados: 74, noPrazo: 70 },
  { empresa: "Aurora Tecnologia", mes: 3, abertos: 18, fechados: 68, noPrazo: 63 },
  { empresa: "Aurora Tecnologia", mes: 4, abertos: 14, fechados: 82, noPrazo: 79 },
  { empresa: "Aurora Tecnologia", mes: 5, abertos: 22, fechados: 88, noPrazo: 84 },
  { empresa: "Horizonte Logística", mes: 0, abertos: 8, fechados: 42, noPrazo: 38 },
  { empresa: "Horizonte Logística", mes: 1, abertos: 11, fechados: 48, noPrazo: 45 },
  { empresa: "Horizonte Logística", mes: 2, abertos: 9, fechados: 51, noPrazo: 47 },
  { empresa: "Horizonte Logística", mes: 3, abertos: 14, fechados: 58, noPrazo: 55 },
  { empresa: "Horizonte Logística", mes: 4, abertos: 12, fechados: 62, noPrazo: 58 },
  { empresa: "Horizonte Logística", mes: 5, abertos: 18, fechados: 66, noPrazo: 62 },
  { empresa: "Nexo Serviços", mes: 0, abertos: 6, fechados: 35, noPrazo: 34 },
  { empresa: "Nexo Serviços", mes: 1, abertos: 7, fechados: 39, noPrazo: 37 },
  { empresa: "Nexo Serviços", mes: 2, abertos: 8, fechados: 44, noPrazo: 42 },
  { empresa: "Nexo Serviços", mes: 3, abertos: 10, fechados: 47, noPrazo: 46 },
  { empresa: "Nexo Serviços", mes: 4, abertos: 9, fechados: 53, noPrazo: 51 },
  { empresa: "Nexo Serviços", mes: 5, abertos: 13, fechados: 60, noPrazo: 58 },
  { empresa: "Vértice Comércio", mes: 0, abertos: 9, fechados: 28, noPrazo: 25 },
  { empresa: "Vértice Comércio", mes: 1, abertos: 6, fechados: 34, noPrazo: 31 },
  { empresa: "Vértice Comércio", mes: 2, abertos: 11, fechados: 38, noPrazo: 36 },
  { empresa: "Vértice Comércio", mes: 3, abertos: 8, fechados: 41, noPrazo: 38 },
  { empresa: "Vértice Comércio", mes: 4, abertos: 12, fechados: 46, noPrazo: 43 },
  { empresa: "Vértice Comércio", mes: 5, abertos: 16, fechados: 52, noPrazo: 49 }
];

const periodo = { ano: 2026, meses: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"] };
const empresas = [...new Set(registros.map((registro) => registro.empresa))];
const numero = new Intl.NumberFormat("pt-BR");
const percentual = new Intl.NumberFormat("pt-BR", { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 });

const elementos = {
  filtro: document.querySelector("#empresa"),
  limpar: document.querySelector("#limpar-filtro"),
  resumo: document.querySelector("#resumo-filtro"),
  total: document.querySelector("#total-casos"),
  abertos: document.querySelector("#casos-abertos"),
  fechados: document.querySelector("#casos-fechados"),
  sla: document.querySelector("#sla"),
  eixo: document.querySelector("#eixo-grafico"),
  barras: document.querySelector("#barras-grafico"),
  tabela: document.querySelector("#corpo-tabela"),
  rodape: document.querySelector("#rodape-tabela"),
  contador: document.querySelector("#contador-empresas")
};

function calcularIndicadores(dados) {
  const soma = dados.reduce((totais, registro) => {
    totais.abertos += registro.abertos;
    totais.fechados += registro.fechados;
    totais.noPrazo += registro.noPrazo;
    return totais;
  }, { abertos: 0, fechados: 0, noPrazo: 0 });

  return {
    ...soma,
    total: soma.abertos + soma.fechados,
    // Evita divisão por zero; sem casos fechados, o SLA ainda não se aplica.
    sla: soma.fechados > 0 ? soma.noPrazo / soma.fechados : null
  };
}

function atualizarIndicadores(indicadores) {
  elementos.total.textContent = numero.format(indicadores.total);
  elementos.abertos.textContent = numero.format(indicadores.abertos);
  elementos.fechados.textContent = numero.format(indicadores.fechados);
  elementos.sla.textContent = indicadores.sla === null ? "—" : percentual.format(indicadores.sla);
}

function atualizarGrafico(dados) {
  const meses = periodo.meses.map((nome, indice) => ({
    nome,
    ...calcularIndicadores(dados.filter((registro) => registro.mes === indice))
  }));

  // A escala se adapta ao filtro e deixa espaço acima da barra mais alta.
  const maiorTotal = Math.max(0, ...meses.map((mes) => mes.total));
  const passo = Math.max(1, Math.ceil((maiorTotal * 1.15) / 4 / 10) * 10);
  const limite = passo * 4;

  elementos.eixo.replaceChildren();
  for (let indice = 4; indice >= 0; indice -= 1) {
    const marca = document.createElement("span");
    marca.textContent = numero.format(indice * passo);
    elementos.eixo.append(marca);
  }

  elementos.barras.replaceChildren();
  meses.forEach((mes) => {
    const coluna = document.createElement("li");
    coluna.className = "chart-column";
    coluna.setAttribute("aria-label", `${mes.nome}: ${numero.format(mes.total)} casos, ${numero.format(mes.abertos)} abertos e ${numero.format(mes.fechados)} fechados.`);

    const barra = document.createElement("div");
    barra.className = "bar";
    barra.style.height = `${(mes.total / limite) * 100}%`;
    barra.setAttribute("aria-hidden", "true");
    barra.title = `${mes.nome}: ${numero.format(mes.total)} casos (${numero.format(mes.abertos)} abertos / ${numero.format(mes.fechados)} fechados)`;

    const valor = document.createElement("span");
    valor.className = "bar-value";
    valor.textContent = numero.format(mes.total);

    const abertos = document.createElement("span");
    abertos.className = "bar-open";
    abertos.style.height = `${mes.total > 0 ? (mes.abertos / mes.total) * 100 : 0}%`;

    const fechados = document.createElement("span");
    fechados.className = "bar-closed";
    fechados.style.height = `${mes.total > 0 ? (mes.fechados / mes.total) * 100 : 0}%`;

    const legenda = document.createElement("span");
    legenda.className = "bar-label";
    legenda.textContent = mes.nome;
    legenda.setAttribute("aria-hidden", "true");

    barra.append(valor, abertos, fechados);
    coluna.append(barra, legenda);
    elementos.barras.append(coluna);
  });
}

function adicionarCelula(linha, valor, classe = "") {
  const celula = document.createElement("td");
  const conteudo = document.createElement("span");
  conteudo.textContent = numero.format(valor);
  if (classe) conteudo.className = `number-pill ${classe}`;
  celula.append(conteudo);
  linha.append(celula);
}

function atualizarTabela(dados, indicadores) {
  const empresasVisiveis = empresas.filter((empresa) => dados.some((registro) => registro.empresa === empresa));
  elementos.tabela.replaceChildren();

  empresasVisiveis.forEach((empresa) => {
    const totais = calcularIndicadores(dados.filter((registro) => registro.empresa === empresa));
    const linha = document.createElement("tr");
    const nome = document.createElement("th");
    nome.scope = "row";
    const identificacao = document.createElement("span");
    identificacao.className = "company-cell";
    const avatar = document.createElement("span");
    avatar.className = "company-avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = empresa.split(" ").map((palavra) => palavra[0]).slice(0, 2).join("");
    identificacao.append(avatar, document.createTextNode(empresa));
    nome.append(identificacao);
    linha.append(nome);
    adicionarCelula(linha, totais.total);
    adicionarCelula(linha, totais.abertos, "open");
    adicionarCelula(linha, totais.fechados, "closed");
    elementos.tabela.append(linha);
  });

  const rodape = document.createElement("tr");
  const rotulo = document.createElement("th");
  rotulo.scope = "row";
  rotulo.textContent = "Total do período";
  rodape.append(rotulo);
  adicionarCelula(rodape, indicadores.total);
  adicionarCelula(rodape, indicadores.abertos);
  adicionarCelula(rodape, indicadores.fechados);
  elementos.rodape.replaceChildren(rodape);
  elementos.contador.textContent = `${empresasVisiveis.length} ${empresasVisiveis.length === 1 ? "empresa" : "empresas"}`;
}

function atualizarDashboard() {
  const empresaSelecionada = elementos.filtro.value;
  const dados = registros.filter((registro) => !empresaSelecionada || registro.empresa === empresaSelecionada);
  const indicadores = calcularIndicadores(dados);

  atualizarIndicadores(indicadores);
  atualizarGrafico(dados);
  atualizarTabela(dados, indicadores);

  elementos.limpar.disabled = !empresaSelecionada;
  elementos.resumo.textContent = `${empresaSelecionada || "Todas as empresas"} · ${numero.format(indicadores.total)} casos no período`;
}

function iniciar() {
  document.querySelector("#periodo").textContent = `${periodo.meses[0]} – ${periodo.meses[periodo.meses.length - 1]} de ${periodo.ano}`;
  elementos.filtro.add(new Option("Todas as empresas", ""));
  empresas.forEach((empresa) => elementos.filtro.add(new Option(empresa, empresa)));

  elementos.filtro.addEventListener("change", atualizarDashboard);
  elementos.limpar.addEventListener("click", () => {
    elementos.filtro.value = "";
    atualizarDashboard();
    elementos.filtro.focus();
  });

  atualizarDashboard();
}

iniciar();

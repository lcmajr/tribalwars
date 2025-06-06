let executando = false;

function esperarElemento(seletor, textoOpcional, callback, tentativas = 30) {
  const intervalo = setInterval(() => {
    const elementos = Array.from(document.querySelectorAll(seletor));
    const encontrado = textoOpcional
      ? elementos.find(el => el.innerText.trim().toUpperCase() === textoOpcional.toUpperCase())
      : elementos[0];

    if (encontrado) {
      clearInterval(intervalo);
      callback(encontrado);
    }

    if (--tentativas <= 0) {
      clearInterval(intervalo);
      console.warn("Elemento não apareceu a tempo:", seletor);
    }
  }, 10000);
}

function clicarBotaoPlanFarms() {
  console.log("entrei");
  const botoes = Array.from(document.querySelectorAll('input.btn.optionButton'));
  const botao = botoes.find(btn => btn.value.trim().toUpperCase() === 'PLAN FARMS');

  if (botao) {
    botao.click();
    console.log('[Fase 2] Botão "Plan farms" clicado.');

    setTimeout(() => {
      const eventoEnter = new KeyboardEvent('keydown', {
        key: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true
      });

      const tabela = document.querySelector("#content_value > div.vis.farmGodContent > table");
      const linhas = tabela?.querySelectorAll("tbody tr");

      if (linhas) {
        console.log("Total de linhas na tabela:", linhas.length);
        for (let i = 0; i < linhas.length - 2; i++) {
          setTimeout(() => {
            document.dispatchEvent(eventoEnter);
            console.log('[Fase 2] Tecla ENTER pressionada após clique em "Plan farms".');
            console.log("Índice:", i);

            // Se for o último, marcamos como finalizado
            if (i === linhas.length - 3) {
              console.log("Execução finalizada.");
              executando = false;

            }
          }, i * 3000);
        }
      } else {
        console.warn("Tabela ou linhas não encontradas.");
        executando = false;
      }
    }, 10000);


  } else {
    console.warn('Botão "Plan farms" não encontrado.');
    executando = false;
  }
}

function executarFarmGod() {
  if (executando && executando) {
    console.log("Execução já em andamento, aguardando finalizar...");
    return;
  }

  executando = true;

  const fase = localStorage.getItem('faseFarmGod') || 'inicio';

  if (fase === 'inicio') {
    esperarElemento('a.quickbar_link', 'FARMGOD', (link) => {
      link.click();
      localStorage.setItem('faseFarmGod', 'segunda');
      console.log('[Fase 1] Primeiro clique no FARMGOD feito. Aguardando nova página...');
    });
  }

  else if (fase === 'segunda') {
    esperarElemento('a.quickbar_link', 'FARMGOD', (link) => {
      setTimeout(() => {
        link.click();
      }, 10000);

      console.log('[Fase 2] Segundo clique no FARMGOD feito. Aguardando pop-up...');

      esperarElemento('#popup_box_FarmGod', null, () => {
        console.log('[Fase 2] Pop-up detectado. Aguardando botão "Plan farms"...');
        clicarBotaoPlanFarms();
      });
    });
  }

}

executarFarmGod();
setInterval(executarFarmGod, 180000); // Roda a cada 1h

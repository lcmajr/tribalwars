//VERSÃO 1.0.1



function clicarBotaoPlanFarms() {

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

        }
        }, i * 1000);
    }
    } else {
    console.warn("Tabela ou linhas não encontradas.");
    }
}, 3000);
 
}

function executarFarmGod() {
    clicarBotaoPlanFarms();
    
}

executarFarmGod();

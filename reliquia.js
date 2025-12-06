javascript:(async function () {

    UI.InfoMessage("Coletando relíquias dos relatórios...", 3000);

    const reportUrls = [];
    jQuery("#report_list .report-link").each(function () {
        const url = jQuery(this).attr("href");
        if (url) reportUrls.push(url);
    });

    if (reportUrls.length === 0) {
        UI.ErrorMessage("Nenhum relatório encontrado!");
        return;
    }

    function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

    const relics = [];

    function detectQuality(text) {
        const low = text.toLowerCase();

        if (/de\s+m[áa]\s+qualidade|m[áa]\s+qualidade/.test(low))
            return { q: "De má qualidade", color: "#999", level: "N1" };

        if (/b[áa]sic[oa]/.test(low))
            return { q: "Básico", color: "green", level: "N2" };

        if (/aprimorad[oa]s?/.test(low))
            return { q: "Aprimorado", color: "blue", level: "N3" };

        if (/superior[a]?/.test(low))
            return { q: "Superior", color: "purple", level: "N4" };

        if (/reconhecid[oa]s?/.test(low))
            return { q: "Reconhecido", color: "gold", level: "N5" };

        return { q: "Desconhecido", color: "#999", level: "—" };
    }

    for (let i = 0; i < reportUrls.length; i++) {

        UI.InfoMessage(`Lendo relatório ${i + 1}/${reportUrls.length}`, 400);

        await delay(250);

        let html;
        try {
            html = await fetch(reportUrls[i], { credentials: "same-origin" }).then(r => r.text());
        } catch {
            continue;
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // extrair coordenada do DEFENSOR (última ocorr.)
        const titleText = (
            doc.querySelector(".quickedit-label")?.textContent ||
            doc.querySelector(".report-title")?.textContent ||
            ""
        ).trim();

        const coordsMatch = titleText.match(/\d{1,3}\|\d{1,3}/g);
        const defenderCoord = coordsMatch?.length >= 2 ? coordsMatch[coordsMatch.length - 1] : "???";

        // criar link para mapa
        let defenderHref = "#";
        if (defenderCoord !== "???") {
            const [x, y] = defenderCoord.split("|");
            defenderHref = `/game.php?screen=map&x=${x}&y=${y}`;
        }

        const relicElems = Array.from(doc.querySelectorAll(
            "[class*='relic'], img[src*='relic'], .inline-relic, .relic-icon-small"
        ));

        relicElems.forEach(elem => {
            const raw = (elem.textContent || elem.getAttribute("title") || "").trim();
            if (!raw) return;

            const low = raw.toLowerCase();
            if (!(
                low.includes("qualidade") ||
                low.includes("reli") ||
                low.match(/aprimorad|b[áa]sic|superior|reconhecid|má qualidade|ma qualidade/)
            )) return;

            const qc = detectQuality(raw);

            relics.push({
                village: defenderCoord,
                villageHref: defenderHref,
                relic: raw,
                quality: qc.q,
                color: qc.color,
                level: qc.level
            });
        });
    }

    if (relics.length === 0) {
        UI.ErrorMessage("Nenhuma relíquia encontrada!");
        return;
    }

    let html = `
        <h2>Relíquias Encontradas</h2>
        <table class="vis">
            <tr>
                <th>Aldeia</th>
                <th>Relíquia</th>
                <th>Qualidade</th>
                <th>Nível</th>
            </tr>
    `;

    relics.forEach(r => {
        html += `
            <tr>
                <td><a href="${r.villageHref}">${r.village}</a></td>
                <td style="max-width:380px;word-break:break-word">${r.relic}</td>
                <td style="color:${r.color}">${r.quality}</td>
                <td>${r.level}</td>
            </tr>
        `;
    });

    html += `</table>`;

    Dialog.show("relicScanner", html);

})();

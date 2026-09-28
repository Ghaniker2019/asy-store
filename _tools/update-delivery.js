// Régénère delivery-data.js depuis l'API E-com Delivery (appels en lecture seule).
// Usage : ECOM_KEY=... ECOM_TOKEN=... node _tools/update-delivery.js
// Les identifiants ne doivent jamais être écrits dans le dépôt : le code et le site sont publics.
const fs = require('fs');
const path = require('path');

const BASE = 'https://ecom-dz.com/api_v2';
const { ECOM_KEY, ECOM_TOKEN } = process.env;
if (!ECOM_KEY || !ECOM_TOKEN) {
    console.error('Variables ECOM_KEY et ECOM_TOKEN requises.');
    process.exit(1);
}

// Wilayas créées en 2025 (59 à 69), inconnues d'E-com : rattachées à leur wilaya d'origine
const ALIASES = { 59: 3, 60: 5, 61: 14, 62: 17, 63: 17, 64: 28, 65: 32, 66: 7, 67: 12, 68: 26, 69: 13 };

async function get(p) {
    const res = await fetch(BASE + p, {
        headers: { 'X-API-Key': ECOM_KEY, 'X-API-Token': ECOM_TOKEN, Accept: 'application/json' }
    });
    if (!res.ok) throw new Error(p + ' : HTTP ' + res.status + ' ' + (await res.text()).slice(0, 200));
    return res.json();
}

(async function () {
    const [wilayas, tarifs, communes, bureaux] = await Promise.all([
        get('/wilayas'), get('/tarifs'), get('/communes'), get('/stopdesks')
    ]);
    const tarif = new Map(tarifs.wilayas.map(t => [t.wilaya, t]));
    const byName = (a, b) => a.localeCompare(b, 'fr');

    const lines = wilayas.map(w => {
        const t = tarif.get(w.id) || {};
        const communesW = communes.filter(c => c.id_wilaya === w.id && c.livrable).map(c => c.commune).sort(byName);
        const bureauxW = bureaux.filter(b => b.id_wilaya === w.id)
            .map(b => ({ code: b.code_stopdesk, nom: b.nom_bureau, adresse: b.adresse, commune: b.commune, maps: b.adresse_maps || '' }))
            .sort((a, b) => a.code.localeCompare(b.code, 'fr', { numeric: true }));
        // A mode is offered only if E-com serves it, has a price, and has somewhere to deliver
        const entry = {
            domicile: w.domicile && t.domicile > 0 && communesW.length ? t.domicile : null,
            stopdesk: w.stopdesk && t.stopdesk > 0 && bureauxW.length ? t.stopdesk : null,
            communes: communesW,
            bureaux: bureauxW
        };
        return '        "' + w.id + '": ' + JSON.stringify(entry);
    });

    const file = path.join(__dirname, '..', 'delivery-data.js');
    fs.writeFileSync(file,
        '/* ASY Store — livraison E-com Delivery : tarifs, communes livrables et bureaux stop desk.\n' +
        '   Fichier généré par _tools/update-delivery.js : ne pas modifier à la main. */\n' +
        'var ASY_DELIVERY = {\n' +
        '    updated: ' + JSON.stringify(new Date().toISOString().slice(0, 10)) + ',\n' +
        '    aliases: ' + JSON.stringify(ALIASES) + ',\n' +
        '    wilayas: {\n' + lines.join(',\n') + '\n    }\n};\n');
    console.log('delivery-data.js : ' + wilayas.length + ' wilayas, ' +
        communes.filter(c => c.livrable).length + ' communes livrables, ' + bureaux.length + ' bureaux.');
})().catch(e => { console.error(e.message); process.exit(1); });

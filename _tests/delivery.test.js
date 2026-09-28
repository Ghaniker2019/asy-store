const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const D = require('../delivery.js');

const data = {
    aliases: { 59: 3 },
    wilayas: {
        3: { domicile: 800, stopdesk: 500, communes: ['Aflou', 'Laghouat'], bureaux: [{ code: '3A', nom: 'Laghouat', adresse: 'x', commune: 'Laghouat', maps: '' }] },
        16: { domicile: 400, stopdesk: null, communes: ['Alger Centre'], bureaux: [] },
        50: { domicile: null, stopdesk: null, communes: [], bureaux: [] }
    }
};

test('wilayaNumber lit le numéro des options du formulaire', () => {
    assert.equal(D.wilayaNumber('16 - Alger'), 16);
    assert.equal(D.wilayaNumber('01 - Adrar'), 1);
    assert.equal(D.wilayaNumber(''), null);
    assert.equal(D.wilayaNumber('abc'), null);
    assert.equal(D.wilayaNumber(undefined), null);
});

test('forWilaya : wilaya connue d’E-com', () => {
    const w = D.forWilaya(data, '16 - Alger');
    assert.equal(w.id, 16);
    assert.equal(w.served, true);
    assert.equal(w.domicile, 400);
    assert.equal(w.stopdesk, null);
});

test('forWilaya : nouvelle wilaya rattachée à sa wilaya d’origine', () => {
    const w = D.forWilaya(data, '59 - Aflou');
    assert.equal(w.id, 3);
    assert.deepEqual(w.communes, ['Aflou', 'Laghouat']);
    assert.equal(w.bureaux[0].code, '3A');
});

test('forWilaya : wilaya non desservie, inconnue ou vide', () => {
    assert.equal(D.forWilaya(data, '50 - Bordj Badji Mokhtar').served, false);
    assert.equal(D.forWilaya(data, '99 - Nulle part'), null);
    assert.equal(D.forWilaya(data, ''), null);
});

test('fee : prix du mode choisi, null si indisponible', () => {
    assert.equal(D.fee(data, '59 - Aflou', 'domicile'), 800);
    assert.equal(D.fee(data, '59 - Aflou', 'stopdesk'), 500);
    assert.equal(D.fee(data, '16 - Alger', 'stopdesk'), null);
    assert.equal(D.fee(data, '50 - Bordj Badji Mokhtar', 'domicile'), null);
    assert.equal(D.fee(data, '16 - Alger', 'avion'), null);
    assert.equal(D.fee(data, '', 'domicile'), null);
});

test('delivery-data.js généré : les 69 wilayas du site sont couvertes, seules 50 et 54 ne sont pas desservies', () => {
    const ctx = {};
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'delivery-data.js'), 'utf8'), ctx);
    const real = ctx.ASY_DELIVERY;
    const unserved = [];
    for (let n = 1; n <= 69; n++) {
        const w = D.forWilaya(real, String(n).padStart(2, '0') + ' - x');
        assert.ok(w, 'wilaya ' + n + ' absente');
        if (!w.served) { unserved.push(n); continue; }
        if (w.domicile !== null) assert.ok(w.domicile > 0 && w.communes.length > 0, 'domicile incohérent : ' + n);
        if (w.stopdesk !== null) assert.ok(w.stopdesk > 0 && w.bureaux.length > 0, 'stop desk incohérent : ' + n);
    }
    assert.deepEqual(unserved, [50, 54]);
});

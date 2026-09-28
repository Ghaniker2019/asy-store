const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../cart.js');

function memoryStorage(initial) {
    const data = Object.assign({}, initial);
    return {
        getItem: (k) => (k in data ? data[k] : null),
        setItem: (k, v) => { data[k] = String(v); },
        data
    };
}

test('parsePrice lit les chiffres et renvoie null sans chiffre', () => {
    assert.equal(C.parsePrice('4 500 DA'), 4500);
    assert.equal(C.parsePrice('12 000 DA'), 12000);
    assert.equal(C.parsePrice('Sur demande'), null);
    assert.equal(C.parsePrice(''), null);
    assert.equal(C.parsePrice(undefined), null);
});

test('parsePrice accepte les écritures libres de l’admin, refuse les fourchettes', () => {
    assert.equal(C.parsePrice('4500 DA'), 4500);
    assert.equal(C.parsePrice('4.500 DA'), 4500);
    assert.equal(C.parsePrice('4 500,00 DA'), 4500);
    assert.equal(C.parsePrice('1 234 567 DA'), 1234567);
    assert.equal(C.parsePrice('3 000 – 5 000 DA'), null);
});

test('formatDA groupe les milliers', () => {
    assert.equal(C.formatDA(500), '500 DA');
    assert.equal(C.formatDA(4500), '4 500 DA');
    assert.equal(C.formatDA(1234567), '1 234 567 DA');
});

test('clampQty borne entre 1 et MAX_QTY', () => {
    assert.equal(C.clampQty(0), 1);
    assert.equal(C.clampQty(-3), 1);
    assert.equal(C.clampQty('abc'), 1);
    assert.equal(C.clampQty(undefined), 1);
    assert.equal(C.clampQty(4), 4);
    assert.equal(C.clampQty(99), C.MAX_QTY);
});

test('add cumule les quantités et persiste', () => {
    const s = memoryStorage();
    const cart = C.createCart(s, 'k');
    cart.add('7');
    cart.add('7', 2);
    cart.add('12');
    assert.deepEqual(cart.items(), [{ key: '7', qty: 3 }, { key: '12', qty: 1 }]);
    assert.equal(cart.count(), 4);
    assert.deepEqual(JSON.parse(s.data.k), [{ key: '7', qty: 3 }, { key: '12', qty: 1 }]);
});

test('add ne dépasse pas MAX_QTY', () => {
    const cart = C.createCart(memoryStorage(), 'k');
    cart.add('1', 8);
    cart.add('1', 8);
    assert.equal(cart.items()[0].qty, C.MAX_QTY);
});

test('setQty, remove et clear', () => {
    const cart = C.createCart(memoryStorage(), 'k');
    cart.add('1');
    cart.add('2');
    cart.setQty('1', 5);
    cart.setQty('inconnu', 5);
    cart.remove('2');
    assert.deepEqual(cart.items(), [{ key: '1', qty: 5 }]);
    cart.clear();
    assert.deepEqual(cart.items(), []);
    assert.equal(cart.count(), 0);
});

test('le panier est relu depuis le stockage, entrées invalides ignorées', () => {
    const s = memoryStorage({ k: JSON.stringify([{ key: '3', qty: 2 }, { qty: 1 }, null, { key: '4', qty: 50 }]) });
    assert.deepEqual(C.createCart(s, 'k').items(), [{ key: '3', qty: 2 }, { key: '4', qty: C.MAX_QTY }]);
});

test('stockage corrompu ou absent : panier vide, aucune exception', () => {
    assert.deepEqual(C.createCart(memoryStorage({ k: '{pas du json' }), 'k').items(), []);
    const cart = C.createCart(null, 'k');
    cart.add('1');
    assert.deepEqual(cart.items(), [{ key: '1', qty: 1 }]);
});

const catalog = {
    '7': { id: 7, price: '6 000 DA', name: 'Main Dorée' },
    '20': { id: 20, price: 'Sur demande', name: 'Showroom' },
    'fb1': { price: '3 000 DA', name: 'Produit Firebase' }
};
const find = (k) => catalog[k] || null;

test('resolveLines associe les produits et ignore ceux qui ont disparu', () => {
    const lines = C.resolveLines([{ key: '7', qty: 2 }, { key: 'disparu', qty: 1 }], find);
    assert.equal(lines.length, 1);
    assert.equal(lines[0].unit, 6000);
    assert.equal(lines[0].qty, 2);
    assert.equal(lines[0].product, catalog['7']);
});

test('summarize additionne les prix connus et signale les prix sur demande', () => {
    const lines = C.resolveLines([{ key: '7', qty: 2 }, { key: '20', qty: 1 }, { key: 'fb1', qty: 1 }], find);
    assert.deepEqual(C.summarize(lines), { total: 15000, onRequest: true });
    assert.deepEqual(C.summarize([]), { total: 0, onRequest: false });
});

test('formatLines : quantité, nom, référence si id, montant de la ligne', () => {
    const lines = C.resolveLines([{ key: '7', qty: 2 }, { key: '20', qty: 1 }, { key: 'fb1', qty: 1 }], find);
    assert.equal(
        C.formatLines(lines, (p) => p.name, 'réf.'),
        '2 × Main Dorée (réf. 7) : 12 000 DA\n1 × Showroom (réf. 20) : Sur demande\n1 × Produit Firebase : 3 000 DA'
    );
});

test('whatsappUrl encode le texte', () => {
    assert.equal(C.whatsappUrl('213556877546'), 'https://wa.me/213556877546');
    assert.equal(C.whatsappUrl('213556877546', 'Bonjour ASY & co'), 'https://wa.me/213556877546?text=Bonjour%20ASY%20%26%20co');
});

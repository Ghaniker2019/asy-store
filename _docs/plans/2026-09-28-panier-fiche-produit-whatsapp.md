# Panier, fiche produit, bouton WhatsApp — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter à ASY Store un panier persistant, une fiche produit (photos, description, ajout/achat) et un bouton WhatsApp « écrire » vers le +213 556 87 75 46.

**Architecture:** Site statique GitHub Pages. Données produits sorties dans `products.js`, logique pure du panier dans `cart.js` (testée sous Node), affichage dans `index.html` (IIFE existante). Commande envoyée par formsubmit (e-mail) ou WhatsApp (`wa.me`).

**Tech Stack:** HTML/CSS/JS vanilla (ES5 comme l'existant), Node 20 `node:test` pour les tests, navigateur (Playwright MCP) pour la vérification visuelle.

**Spec:** `_docs/specs/2026-09-28-panier-fiche-produit-whatsapp-design.md`

**Conventions :**
- Tout texte injecté dans le HTML passe par `esc()` (déjà défini dans `index.html`).
- Nouvelles chaînes françaises avec accents ; arabe en caractères UTF-8 directs (le fichier est en UTF-8).
- `data-i18n` uniquement sur des éléments feuilles (le moteur remplace `textContent`).
- Commits avec la ligne `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. **Aucun `git push`.**

---

## Structure des fichiers

| Fichier | Rôle |
|---|---|
| `cart.js` (créé) | Logique pure : `parsePrice`, `formatDA`, `clampQty`, `createCart`, `resolveLines`, `summarize`, `formatLines`, `whatsappUrl`, `MAX_QTY` |
| `_tests/cart.test.js` (créé) | Tests `node:test` de `cart.js` |
| `products.js` (créé, généré) | `var ASY_PRODUCTS = [...]` : 30 produits avec `images`, `name{fr,ar,en}`, `desc{fr,ar,en}` |
| `index.html` (modifié) | Chargement des 2 scripts, panier, validation, fiche, WhatsApp, i18n |
| `admin.html`, `firebase-init.js` | Inchangés |

---

### Task 1 : `cart.js` + tests (TDD)

**Files:**
- Create: `_tests/cart.test.js`
- Create: `cart.js`

- [ ] **Step 1 : Écrire les tests**

`_tests/cart.test.js` :

```js
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
```

- [ ] **Step 2 : Lancer les tests — échec attendu**

Run: `node --test _tests/cart.test.js`
Expected: FAIL — `Cannot find module '../cart.js'`

- [ ] **Step 3 : Implémenter `cart.js`**

```js
/* ASY Store — logique du panier, sans DOM.
   Chargé par index.html (window.ASYCart) et par _tests/cart.test.js (require). */
(function (root) {
    'use strict';

    var MAX_QTY = 10;

    // "4 500 DA" -> 4500 ; "Sur demande" -> null
    function parsePrice(price) {
        var digits = String(price == null ? '' : price).replace(/\D/g, '');
        return digits ? parseInt(digits, 10) : null;
    }

    // 13500 -> "13 500 DA"
    function formatDA(amount) {
        return String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' DA';
    }

    function clampQty(qty) {
        qty = parseInt(qty, 10);
        if (isNaN(qty) || qty < 1) return 1;
        return Math.min(qty, MAX_QTY);
    }

    // Panier persistant : [{ key, qty }] sous storageKey. Stockage absent ou bloqué = panier en mémoire.
    function createCart(storage, storageKey) {
        var items = load();

        function load() {
            try {
                var parsed = JSON.parse(storage.getItem(storageKey) || '[]');
                if (!Array.isArray(parsed)) return [];
                return parsed
                    .filter(function (it) { return it && typeof it.key === 'string'; })
                    .map(function (it) { return { key: it.key, qty: clampQty(it.qty) }; });
            } catch (e) { return []; }
        }

        function save() {
            try { storage.setItem(storageKey, JSON.stringify(items)); } catch (e) { /* panier gardé en mémoire */ }
        }

        function find(key) {
            for (var i = 0; i < items.length; i++) if (items[i].key === key) return items[i];
            return null;
        }

        return {
            items: function () { return items.map(function (it) { return { key: it.key, qty: it.qty }; }); },
            count: function () { return items.reduce(function (n, it) { return n + it.qty; }, 0); },
            add: function (key, qty) {
                var it = find(key);
                if (it) it.qty = clampQty(it.qty + clampQty(qty));
                else items.push({ key: key, qty: clampQty(qty) });
                save();
            },
            setQty: function (key, qty) {
                var it = find(key);
                if (it) { it.qty = clampQty(qty); save(); }
            },
            remove: function (key) {
                items = items.filter(function (it) { return it.key !== key; });
                save();
            },
            clear: function () { items = []; save(); }
        };
    }

    // Associe chaque article à son produit ; ignore ceux dont le produit n'existe plus.
    function resolveLines(items, findProduct) {
        return items.reduce(function (lines, it) {
            var product = findProduct(it.key);
            if (product) lines.push({ key: it.key, qty: it.qty, product: product, unit: parsePrice(product.price) });
            return lines;
        }, []);
    }

    // Total des prix connus ; onRequest = au moins un article "Sur demande".
    function summarize(lines) {
        return lines.reduce(function (s, l) {
            if (l.unit === null) s.onRequest = true;
            else s.total += l.unit * l.qty;
            return s;
        }, { total: 0, onRequest: false });
    }

    // "2 × Nom (réf. 12) : 9 000 DA", une ligne par article.
    function formatLines(lines, nameOf, refLabel) {
        return lines.map(function (l) {
            var ref = l.product.id != null ? ' (' + refLabel + ' ' + l.product.id + ')' : '';
            var amount = l.unit === null ? l.product.price : formatDA(l.unit * l.qty);
            return l.qty + ' × ' + nameOf(l.product) + ref + ' : ' + amount;
        }).join('\n');
    }

    function whatsappUrl(phone, text) {
        return 'https://wa.me/' + phone + (text ? '?text=' + encodeURIComponent(text) : '');
    }

    var api = {
        MAX_QTY: MAX_QTY, parsePrice: parsePrice, formatDA: formatDA, clampQty: clampQty,
        createCart: createCart, resolveLines: resolveLines, summarize: summarize,
        formatLines: formatLines, whatsappUrl: whatsappUrl
    };

    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.ASYCart = api;
})(this);
```

- [ ] **Step 4 : Lancer les tests — succès attendu**

Run: `node --test _tests/cart.test.js`
Expected: `# pass 12`, `# fail 0`

- [ ] **Step 5 : Commit**

```bash
git add cart.js _tests/cart.test.js
git commit -m "Panier : logique pure (cart.js) + tests node:test"
```

---

### Task 2 : Descriptions des 30 produits (contenu)

**Files:**
- Create (hors dépôt) : `$SCRATCH/desc-01-10.json`, `$SCRATCH/desc-11-20.json`, `$SCRATCH/desc-21-30.json`, puis `$SCRATCH/descriptions.json`
  (`$SCRATCH` = répertoire scratchpad de la session)

- [ ] **Step 1 : Lancer 3 agents en parallèle (10 produits chacun)**

Chaque agent reçoit sa liste (id, fichier photo, catégorie, usage, nom FR, nom EN — tirés de `defaultProducts` et `productNames.fr/en` dans `index.html`) et cette consigne :

> Tu rédiges les descriptions produit du site ASY Store (appliques murales, Alger). Pour chaque produit, ouvre la photo avec l'outil Read (`<chemin absolu du dépôt>/Products/<fichier>`) et écris 2 à 3 phrases par langue : français (avec accents), arabe standard moderne, anglais. Décris uniquement ce qui est visible : forme, finition/couleur apparente, style, effet de lumière, pièces où l'installer (salon, chambre, couloir, entrée, extérieur si usage extérieur). **N'invente aucune caractéristique technique** : pas de dimensions, puissance, lumens, matériaux précis (dis « finition dorée », pas « laiton massif »), garantie ni douille. Ton : chaleureux, sobre, vendeur sans superlatifs creux. Le produit 20 est une vue du showroom : explique que c'est un aperçu de la collection en magasin et invite à demander les modèles et prix sur WhatsApp. Écris le résultat en JSON strict dans `<fichier de sortie>` au format `{"<id>": {"fr": "...", "ar": "...", "en": "..."}}` et réponds seulement « OK <nombre> produits ».

- [ ] **Step 2 : Fusionner et vérifier**

```bash
cd "$SCRATCH" && node -e '
const fs = require("fs");
const all = Object.assign({}, ...["desc-01-10.json","desc-11-20.json","desc-21-30.json"].map(f => JSON.parse(fs.readFileSync(f, "utf8"))));
for (let id = 1; id <= 30; id++) {
  const d = all[id];
  if (!d || !d.fr || !d.ar || !d.en) throw new Error("manquant : " + id);
  if (/\b\d+\s?(w|cm|mm|lm|watts?)\b/i.test(d.fr + " " + d.en)) console.warn("caractéristique chiffrée à vérifier : " + id);
}
fs.writeFileSync("descriptions.json", JSON.stringify(all, null, 2));
console.log("OK", Object.keys(all).length);
'
```
Expected: `OK 30`, aucun avertissement (sinon réécrire la description concernée).

---

### Task 3 : `products.js` et branchement des données

**Files:**
- Create: `$SCRATCH/build-products.js` (outil jetable, hors dépôt)
- Create: `products.js`
- Modify: `index.html` (bloc `productNames` + `defaultProducts` ≈ l. 969-1032 ; fonctions `getProductName`, `getProductImg` ≈ l. 1102-1114 ; balises `<script>` ≈ l. 823)

- [ ] **Step 1 : Générateur**

`$SCRATCH/build-products.js` :

```js
// Génère products.js depuis les données en dur d'index.html + descriptions.json
const fs = require('fs');
const vm = require('vm');
const [htmlPath, descPath] = process.argv.slice(2);
const html = fs.readFileSync(htmlPath, 'utf8');
const names = vm.runInNewContext('(' + html.match(/const productNames = (\{[\s\S]*?\n {8}\});/)[1] + ')');
const products = vm.runInNewContext(html.match(/var defaultProducts = (\[[\s\S]*?\n\s*\]);/)[1]);
const desc = JSON.parse(fs.readFileSync(descPath, 'utf8'));
const q = JSON.stringify;
const out = products.map(function (p) {
    const d = desc[p.id];
    if (!d || !d.fr || !d.ar || !d.en) throw new Error('Description manquante : produit ' + p.id);
    const i = p.id - 1;
    return [
        '    {',
        '        id: ' + p.id + ', cat: ' + q(p.cat) + ', spec: ' + q(p.spec) + ', price: ' + q(p.price) + (p.badge ? ', badge: ' + q(p.badge) : '') + ',',
        '        images: [' + q(p.img) + '],',
        '        name: { fr: ' + q(names.fr[i]) + ', ar: ' + q(names.ar[i]) + ', en: ' + q(names.en[i]) + ' },',
        '        desc: {',
        '            fr: ' + q(d.fr) + ',',
        '            ar: ' + q(d.ar) + ',',
        '            en: ' + q(d.en),
        '        }',
        '    }'
    ].join('\n');
});
process.stdout.write(
    "/* ASY Store — catalogue par défaut (utilisé tant que Firebase n'est pas configuré).\n" +
    '   Ajouter des photos à un produit : compléter son tableau images (la première est la photo principale).\n' +
    '   Les descriptions ont été rédigées d\'après les photos : à faire valider par la boutique. */\n' +
    'var ASY_PRODUCTS = [\n' + out.join(',\n') + '\n];\n'
);
```

- [ ] **Step 2 : Générer et contrôler**

```bash
node "$SCRATCH/build-products.js" index.html "$SCRATCH/descriptions.json" > products.js
node -e 'const vm=require("vm"),fs=require("fs");const c={};vm.runInNewContext(fs.readFileSync("products.js","utf8"),c);const P=c.ASY_PRODUCTS;console.log(P.length, P.every(p=>p.images.length===1&&p.name.ar&&p.desc.en&&fs.existsSync(p.images[0])))'
```
Expected: `30 true`

- [ ] **Step 3 : Charger les scripts dans `index.html`**

Après `<script src="firebase-init.js"></script>` ajouter :

```html
    <script src="products.js"></script>
    <script src="cart.js"></script>
```

- [ ] **Step 4 : Remplacer les données en dur**

Supprimer tout le bloc `// Product names per language` … `products = defaultProducts.slice();` et le remplacer par :

```js
        // ── Product Data (Firebase OR products.js defaults) ──
        var useAdmin = false;
        var products = ASY_PRODUCTS.slice();
```

- [ ] **Step 5 : Accesseurs produit**

Remplacer `getProductName` et `getProductImg` par :

```js
        function getProductName(product, lang) {
            lang = lang || currentLang;
            // Admin products have nameFr/nameAr/nameEn directly
            if (product.nameFr) {
                var nameMap = { fr: product.nameFr, ar: product.nameAr || product.nameFr, en: product.nameEn || product.nameFr };
                return nameMap[lang] || product.nameFr;
            }
            // Default products (products.js)
            return (product.name && (product.name[lang] || product.name.fr)) || '';
        }

        function getProductImages(product) {
            if (product.images && product.images.length) return product.images;
            var single = product.imageUrl || product.imgData || product.img;
            return single ? [single] : [];
        }

        function getProductImg(product) {
            return getProductImages(product)[0] || '';
        }

        function getProductDesc(product) {
            // Defaults: desc.{fr,ar,en} ; admin products: descFr/descAr/descEn
            if (product.desc) return product.desc[currentLang] || product.desc.fr || '';
            var map = { fr: product.descFr, ar: product.descAr, en: product.descEn };
            return map[currentLang] || product.descFr || '';
        }
```

- [ ] **Step 6 : Vérifier dans le navigateur**

Serveur : `python3 -m http.server 8765` (en arrière-plan, depuis la racine du dépôt). Ouvrir `http://localhost:8765/`, vérifier : 30 cartes, noms FR, bascule AR/EN change les noms, console sans erreur.

- [ ] **Step 7 : Commit**

```bash
git add products.js index.html
git commit -m "Catalogue sorti dans products.js avec descriptions FR/AR/EN"
```

---

### Task 4 : i18n, toast générique, bouton WhatsApp

**Files:**
- Modify: `index.html` (objet `T` ≈ l. 833-967, `setLang`, toast HTML ≈ l. 815, bloc Success, footer Contact, CSS toast)

- [ ] **Step 1 : Nouvelles chaînes**

Dans `T.fr`, remplacer `btn_buy: "Commander"` par :

```js
                // Cart & product page
                cart_title: "Mon panier", cart_open: "Ouvrir le panier",
                cart_empty: "Votre panier est vide.", cart_browse: "Voir les produits",
                cart_total: "Total", cart_excl_delivery: "hors livraison",
                cart_on_request: "+ articles au prix sur demande",
                cart_checkout: "Valider la commande", cart_edit: "Modifier le panier",
                cart_remove: "Retirer", cart_added: "Ajouté au panier",
                btn_add_cart: "Ajouter au panier", btn_buy_now: "Acheter",
                product_close: "Fermer", product_prev: "Photo précédente", product_next: "Photo suivante",
                ref_label: "réf.", order_summary: "Votre commande", order_via_whatsapp: "Commander via WhatsApp",
                // WhatsApp
                wa_label: "Écrire sur WhatsApp", wa_greeting: "Bonjour ASY Store, j'ai une question.",
                wa_product_question: "Une question sur ce produit ?", wa_product_msg: "Bonjour ASY Store, j'ai une question sur ce produit :",
                wa_order_intro: "Bonjour ASY Store, je souhaite commander :", wa_message: "Message"
```

Dans `T.ar`, remplacer `btn_buy: "اطلب"` par :

```js
                cart_title: "سلة المشتريات", cart_open: "فتح السلة",
                cart_empty: "سلتك فارغة.", cart_browse: "تصفح المنتجات",
                cart_total: "المجموع", cart_excl_delivery: "دون احتساب التوصيل",
                cart_on_request: "+ منتجات سعرها عند الطلب",
                cart_checkout: "تأكيد الطلب", cart_edit: "تعديل السلة",
                cart_remove: "حذف", cart_added: "تمت الإضافة إلى السلة",
                btn_add_cart: "أضف إلى السلة", btn_buy_now: "اشترِ الآن",
                product_close: "إغلاق", product_prev: "الصورة السابقة", product_next: "الصورة التالية",
                ref_label: "مرجع", order_summary: "طلبك", order_via_whatsapp: "اطلب عبر واتساب",
                wa_label: "راسلنا على واتساب", wa_greeting: "مرحباً ASY Store، لدي سؤال.",
                wa_product_question: "سؤال حول هذا المنتج؟", wa_product_msg: "مرحباً ASY Store، لدي سؤال حول هذا المنتج:",
                wa_order_intro: "مرحباً ASY Store، أرغب في طلب:", wa_message: "رسالة"
```

Dans `T.en`, remplacer `btn_buy: "Order"` par :

```js
                cart_title: "My cart", cart_open: "Open cart",
                cart_empty: "Your cart is empty.", cart_browse: "Browse products",
                cart_total: "Total", cart_excl_delivery: "excl. delivery",
                cart_on_request: "+ items priced on request",
                cart_checkout: "Checkout", cart_edit: "Edit cart",
                cart_remove: "Remove", cart_added: "Added to cart",
                btn_add_cart: "Add to cart", btn_buy_now: "Buy now",
                product_close: "Close", product_prev: "Previous photo", product_next: "Next photo",
                ref_label: "ref.", order_summary: "Your order", order_via_whatsapp: "Order via WhatsApp",
                wa_label: "Chat on WhatsApp", wa_greeting: "Hello ASY Store, I have a question.",
                wa_product_question: "A question about this product?", wa_product_msg: "Hello ASY Store, I have a question about this product:",
                wa_order_intro: "Hello ASY Store, I would like to order:", wa_message: "Message"
```

Supprimer dans les 3 langues les clés devenues inutiles : `form_product`, `form_product_ph`, `form_confirm` (leurs consommateurs disparaissent en Task 6).

- [ ] **Step 2 : Traduction des `aria-label`**

Dans `setLang`, après le bloc « Translate placeholders » :

```js
            // Translate aria-labels
            document.querySelectorAll('[data-i18n-aria]').forEach(el => {
                const key = el.getAttribute('data-i18n-aria');
                if (T[lang] && T[lang][key]) el.setAttribute('aria-label', T[lang][key]);
            });
```

- [ ] **Step 3 : Toast générique**

HTML du toast :

```html
    <div class="toast" id="toast" role="status" aria-live="polite">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <p><span id="toastMain"></span><strong id="toastSub"></strong></p>
    </div>
```

JS, après la déclaration `const langBtns` :

```js
        var toastTimer = null;
        function showToast(main, sub, duration) {
            document.getElementById('toastMain').textContent = main;
            document.getElementById('toastSub').textContent = sub || '';
            toast.classList.add('show');
            clearTimeout(toastTimer);
            toastTimer = setTimeout(function() { toast.classList.remove('show'); }, duration || 2500);
        }
```

CSS : dans `.toast`, `bottom: 32px` → `bottom: 100px` (au-dessus du bouton WhatsApp).

- [ ] **Step 4 : Bouton WhatsApp flottant + pied de page**

HTML, juste avant `<!-- ══════════ TOAST ══════════ -->` :

```html
    <!-- ══════════ WHATSAPP ══════════ -->
    <a class="wa-fab" id="waFab" href="https://wa.me/213556877546" target="_blank" rel="noopener" aria-label="Écrire sur WhatsApp" data-i18n-aria="wa_label">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    </a>
```

Pied de page, colonne Contact, en premier `<li>` :

```html
                        <li><a href="https://wa.me/213556877546" id="footerWhatsapp" target="_blank" rel="noopener">WhatsApp : 0556 87 75 46</a></li>
```

CSS, avant `/* ── RESPONSIVE ── */` :

```css
        /* ── WHATSAPP ── */
        .wa-fab {
            position: fixed; bottom: 24px; right: 24px; z-index: 1500;
            width: 56px; height: 56px; border-radius: 50%;
            background: #25D366; color: #fff; display: flex; align-items: center; justify-content: center;
            box-shadow: 0 8px 24px rgba(37,211,102,0.35); transition: var(--transition);
        }
        .wa-fab:hover { transform: translateY(-3px) scale(1.05); box-shadow: 0 12px 32px rgba(37,211,102,0.45); }
        .wa-fab svg { width: 30px; height: 30px; }
        html[dir="rtl"] .wa-fab { right: auto; left: 24px; }
        body.overlay-open .wa-fab { display: none; }
```

Dans `@media (max-width: 768px)` :

```css
            .toast { left: 16px; right: 16px; bottom: 88px; }
            html[dir="rtl"] .toast { left: 16px; right: 16px; }
            .wa-fab { bottom: 16px; right: 16px; }
            html[dir="rtl"] .wa-fab { right: auto; left: 16px; }
```

JS, après `showToast` :

```js
        var WA_PHONE = '213556877546';

        function updateWhatsappLinks() {
            var href = ASYCart.whatsappUrl(WA_PHONE, T[currentLang].wa_greeting);
            document.getElementById('waFab').href = href;
            document.getElementById('footerWhatsapp').href = href;
        }

        // Show/hide scroll lock + floating buttons while a modal or the cart is open
        function setOverlay(open) {
            document.body.classList.toggle('overlay-open', open);
            document.body.style.overflow = open ? 'hidden' : '';
        }
```

Dans `setLang`, à la fin : `updateWhatsappLinks();`

- [ ] **Step 5 : Succès de commande via `showToast`**

Remplacer le bloc `// ── Success ──` par (le vidage du panier sera ajouté en Task 5) :

```js
        // ── Success ──
        if (window.location.search.indexOf('success=1') !== -1) {
            showToast(T[currentLang].toast_success, T[currentLang].toast_followup, 5000);
            window.history.replaceState({}, '', window.location.pathname + window.location.hash);
        }
```

- [ ] **Step 6 : Vérifier**

`http://localhost:8765/` : bouton vert en bas à droite (à gauche en AR), `href` = `https://wa.me/213556877546?text=Bonjour%20ASY%20Store%2C%20j'ai%20une%20question.` en FR et texte arabe encodé en AR. `http://localhost:8765/?success=1` : toast « Commande envoyée… » au-dessus du bouton.

- [ ] **Step 7 : Commit**

```bash
git add index.html
git commit -m "Bouton WhatsApp (message écrit), toast générique, chaînes i18n panier/fiche"
```

---

### Task 5 : Panier (en-tête, panneau, cartes produits)

**Files:**
- Modify: `index.html` (header ≈ l. 521-538, `renderProducts`, `setLang`, nouveau HTML panneau, CSS, bloc Success)

- [ ] **Step 1 : Bouton panier dans l'en-tête**

Dans `.header-right`, entre `</nav>` et `<button class="menu-toggle"…>` :

```html
                <button class="cart-toggle" id="cartToggle" aria-label="Ouvrir le panier" data-i18n-aria="cart_open">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
                    <span class="cart-count" id="cartCount" hidden>0</span>
                </button>
```

- [ ] **Step 2 : Panneau panier**

HTML, après `</footer>` :

```html
    <!-- ══════════ CART DRAWER ══════════ -->
    <div class="cart-backdrop" id="cartBackdrop"></div>
    <aside class="cart-drawer" id="cartDrawer" role="dialog" aria-labelledby="cartTitle" aria-hidden="true">
        <div class="cart-head">
            <h3 id="cartTitle" data-i18n="cart_title">Mon panier</h3>
            <button class="modal-close" id="cartClose" aria-label="Fermer" data-i18n-aria="product_close">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        </div>
        <div class="cart-lines" id="cartLines"></div>
        <div class="cart-foot" id="cartFoot" hidden>
            <div class="cart-total-row">
                <span><span data-i18n="cart_total">Total</span> <small data-i18n="cart_excl_delivery">hors livraison</small></span>
                <strong id="cartTotal">0 DA</strong>
            </div>
            <p class="cart-note" id="cartNote" data-i18n="cart_on_request" hidden>+ articles au prix sur demande</p>
            <button type="button" class="btn-submit" id="cartCheckout" data-i18n="cart_checkout">Valider la commande</button>
        </div>
    </aside>
```

- [ ] **Step 3 : CSS panier**

Avant `/* ── WHATSAPP ── */` :

```css
        /* ── CART ── */
        .cart-toggle {
            position: relative; width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
            border: 1px solid var(--border); background: var(--bg-card); color: var(--text-primary);
            display: flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition);
        }
        .cart-toggle:hover { border-color: var(--blue); color: var(--blue); }
        .cart-toggle svg { width: 20px; height: 20px; }
        .cart-toggle.bump { animation: cartBump 0.4s ease; }
        @keyframes cartBump { 50% { transform: scale(1.15); } }
        .cart-count {
            position: absolute; top: -4px; right: -4px; min-width: 20px; height: 20px; padding: 0 5px;
            border-radius: 50px; background: var(--blue); color: #fff; font-size: 0.68rem; font-weight: 700;
            display: flex; align-items: center; justify-content: center; line-height: 1;
        }
        .cart-count[hidden] { display: none; }
        html[dir="rtl"] .cart-count { right: auto; left: -4px; }

        .cart-backdrop {
            position: fixed; inset: 0; background: rgba(0,0,0,0.35); backdrop-filter: blur(4px); z-index: 2100;
            opacity: 0; visibility: hidden; transition: opacity 0.3s ease, visibility 0.3s;
        }
        .cart-backdrop.active { opacity: 1; visibility: visible; }
        .cart-drawer {
            position: fixed; top: 0; right: 0; height: 100%; width: min(420px, 100%); z-index: 2200;
            background: var(--bg-card); box-shadow: -20px 0 60px rgba(0,0,0,0.12);
            display: flex; flex-direction: column;
            transform: translateX(100%); visibility: hidden; transition: transform 0.35s ease, visibility 0.35s;
        }
        .cart-drawer.active { transform: translateX(0); visibility: visible; }
        html[dir="rtl"] .cart-drawer { right: auto; left: 0; transform: translateX(-100%); box-shadow: 20px 0 60px rgba(0,0,0,0.12); }
        html[dir="rtl"] .cart-drawer.active { transform: translateX(0); }
        .cart-head { position: relative; padding: 24px 24px 20px; border-bottom: 1px solid var(--border); }
        .cart-head h3 { font-family: var(--font-display); font-size: 1.5rem; font-weight: 600; }
        .cart-head .modal-close { top: 20px; }
        .cart-lines { flex: 1; overflow-y: auto; padding: 0 24px; }
        .cart-line { display: grid; grid-template-columns: 64px 1fr auto; gap: 14px; align-items: center; padding: 16px 0; border-bottom: 1px solid var(--border); }
        .cart-line img { width: 64px; height: 64px; object-fit: cover; border-radius: var(--radius); background: #f0ece6; }
        .cart-line-name { font-family: var(--font-display); font-size: 1.05rem; font-weight: 600; line-height: 1.25; }
        .cart-line-price { font-size: 0.82rem; color: var(--gold); font-weight: 600; margin-top: 2px; }
        .cart-line-remove { background: none; border: none; color: var(--text-muted); font-family: var(--font-body); font-size: 0.72rem; cursor: pointer; padding: 0; margin-top: 6px; text-decoration: underline; }
        .cart-line-remove:hover { color: #c0392b; }
        .cart-empty { text-align: center; padding: 48px 0; color: var(--text-muted); }
        .cart-empty p { margin-bottom: 20px; }
        .cart-foot { padding: 20px 24px 24px; border-top: 1px solid var(--border); }
        .cart-foot[hidden] { display: none; }
        .cart-total-row { display: flex; justify-content: space-between; align-items: baseline; }
        .cart-total-row small { color: var(--text-muted); font-size: 0.75rem; }
        .cart-total-row strong { font-family: var(--font-display); font-size: 1.5rem; color: var(--gold); }
        .cart-note { font-size: 0.75rem; color: var(--text-muted); margin-top: 4px; }

        .qty { display: inline-flex; align-items: center; border: 1px solid var(--border); border-radius: 50px; overflow: hidden; }
        .qty button { width: 32px; height: 32px; border: none; background: transparent; color: var(--text-primary); font-size: 1rem; cursor: pointer; transition: var(--transition); }
        .qty button:hover:not(:disabled) { background: rgba(67,162,226,0.08); color: var(--blue); }
        .qty button:disabled { color: var(--border); cursor: default; }
        .qty span { min-width: 28px; text-align: center; font-size: 0.88rem; font-weight: 600; }
```

Dans `@media (max-width: 768px)` :

```css
            .header-right { gap: 12px; }
            .cart-toggle { width: 40px; height: 40px; }
```

- [ ] **Step 4 : Logique panier**

JS, juste avant `// ── Language Switcher ──` :

```js
        // ══════════════════════════════════════════
        // CART
        // ══════════════════════════════════════════
        var storage = null;
        try { storage = window.localStorage; } catch (e) { /* storage blocked: in-memory cart */ }
        var cart = ASYCart.createCart(storage, 'asy_cart');
        var cartDrawer = document.getElementById('cartDrawer');
        var cartBackdrop = document.getElementById('cartBackdrop');
        var cartToggle = document.getElementById('cartToggle');

        function findProduct(key) {
            return products.find(function(p) { return getProductKey(p) === key; }) || null;
        }

        function cartLines() {
            return ASYCart.resolveLines(cart.items(), findProduct);
        }

        function lineAmount(line) {
            return line.unit === null ? line.product.price : ASYCart.formatDA(line.unit * line.qty);
        }

        function qtyControl(key, qty) {
            return '<div class="qty" data-key="' + esc(key) + '">' +
                '<button type="button" data-step="-1" aria-label="-"' + (qty <= 1 ? ' disabled' : '') + '>&minus;</button>' +
                '<span>' + qty + '</span>' +
                '<button type="button" data-step="1" aria-label="+"' + (qty >= ASYCart.MAX_QTY ? ' disabled' : '') + '>+</button>' +
            '</div>';
        }

        function renderCart() {
            var t = T[currentLang];
            var lines = cartLines();
            var sum = ASYCart.summarize(lines);
            var count = lines.reduce(function(n, l) { return n + l.qty; }, 0);

            var badge = document.getElementById('cartCount');
            badge.textContent = count;
            badge.hidden = count === 0;

            document.getElementById('cartLines').innerHTML = lines.length ? lines.map(function(l) {
                return '<div class="cart-line">' +
                    '<img src="' + esc(getProductImg(l.product)) + '" alt="">' +
                    '<div><div class="cart-line-name">' + esc(getProductName(l.product)) + '</div>' +
                        '<div class="cart-line-price">' + esc(lineAmount(l)) + '</div>' +
                        '<button type="button" class="cart-line-remove" data-remove="' + esc(l.key) + '">' + esc(t.cart_remove) + '</button></div>' +
                    qtyControl(l.key, l.qty) +
                '</div>';
            }).join('') : '<div class="cart-empty"><p>' + esc(t.cart_empty) + '</p>' +
                '<a href="#produits" class="btn-secondary" data-close-cart>' + esc(t.cart_browse) + '</a></div>';

            document.getElementById('cartFoot').hidden = !lines.length;
            document.getElementById('cartTotal').textContent = ASYCart.formatDA(sum.total);
            document.getElementById('cartNote').hidden = !sum.onRequest;
        }

        function openCart() {
            renderCart();
            cartDrawer.classList.add('active');
            cartBackdrop.classList.add('active');
            cartDrawer.setAttribute('aria-hidden', 'false');
            setOverlay(true);
            document.getElementById('cartClose').focus();
        }

        function closeCart() {
            if (!cartDrawer.classList.contains('active')) return;
            cartDrawer.classList.remove('active');
            cartBackdrop.classList.remove('active');
            cartDrawer.setAttribute('aria-hidden', 'true');
            setOverlay(false);
        }

        function addToCart(product, qty) {
            cart.add(getProductKey(product), qty);
            renderCart();
            cartToggle.classList.remove('bump');
            void cartToggle.offsetWidth; // restart the animation
            cartToggle.classList.add('bump');
            showToast(T[currentLang].cart_added, getProductName(product));
        }

        cartToggle.addEventListener('click', openCart);
        document.getElementById('cartClose').addEventListener('click', closeCart);
        cartBackdrop.addEventListener('click', closeCart);
        document.getElementById('cartCheckout').addEventListener('click', function() {
            closeCart();
            document.getElementById('commander').scrollIntoView({ behavior: 'smooth' });
        });
        cartDrawer.addEventListener('click', function(e) {
            var step = e.target.closest('.qty button');
            if (step) {
                var key = step.parentNode.getAttribute('data-key');
                var item = cart.items().find(function(it) { return it.key === key; });
                if (item) cart.setQty(key, item.qty + parseInt(step.getAttribute('data-step'), 10));
                renderCart();
                return;
            }
            var remove = e.target.closest('[data-remove]');
            if (remove) { cart.remove(remove.getAttribute('data-remove')); renderCart(); return; }
            if (e.target.closest('[data-close-cart]')) closeCart();
        });
```

- [ ] **Step 5 : Cartes produits → « Ajouter au panier » / ouverture de fiche**

Dans `renderProducts`, après `card.style.animationDelay = …` :

```js
                card.setAttribute('data-key', getProductKey(p));
                card.tabIndex = 0;
```

Remplacer le bouton :

```js
                            '<button class="btn-add" aria-label="' + esc(T[currentLang].btn_add_cart) + '">' +
                                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>' +
                                ' ' + esc(T[currentLang].btn_add_cart) +
                            '</button>' +
```

Supprimer la boucle `document.querySelectorAll('.btn-add').forEach(…)` à la fin de `renderProducts`, et ajouter après la fonction (délégation, liée une seule fois) :

```js
        grid.addEventListener('click', function(e) {
            var card = e.target.closest('.product-card');
            var product = card && findProduct(card.getAttribute('data-key'));
            if (!product) return;
            if (e.target.closest('.btn-add')) addToCart(product, 1);
            else openProduct(product);
        });
        grid.addEventListener('keydown', function(e) {
            if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('product-card')) {
                e.preventDefault();
                var product = findProduct(e.target.getAttribute('data-key'));
                if (product) openProduct(product);
            }
        });
```

Stub temporaire (remplacé en Task 7), juste après :

```js
        function openProduct(product) { /* Task 7 */ }
```

- [ ] **Step 6 : Rafraîchir le panier au changement de langue et vider après succès**

Dans `setLang`, à la fin : `renderCart();`
Dans le bloc Success, avant `showToast(…)` : `cart.clear();`

- [ ] **Step 7 : Vérifier**

`http://localhost:8765/` : « Ajouter au panier » sur 2 produits (dont le n° 20) → pastille 2, toast avec le nom. Panneau : quantités −/+ (− désactivé à 1, + à 10), total hors n° 20 + mention « sur demande », « Retirer ». Recharger → panier conservé. AR : panneau à gauche. Console sans erreur.

- [ ] **Step 8 : Commit**

```bash
git add index.html
git commit -m "Panier : bouton d'en-tête, panneau latéral, ajout depuis les cartes"
```

---

### Task 6 : Validation de commande (section `#commander`)

**Files:**
- Modify: `index.html` (formulaire ≈ l. 676-716, modale de commande ≈ l. 772-812 à supprimer, JS `produitSelect`/`populateProductSelect`/`openModal`/`closeModal`, CSS `.modal-product-preview*`)

- [ ] **Step 1 : Formulaire**

Dans `#orderForm`, après `<input type="text" name="_honey" style="display:none">` ajouter :

```html
                        <input type="hidden" name="Commande" id="orderItems">
                        <input type="hidden" name="Total" id="orderTotal">
                        <div class="form-group">
                            <label data-i18n="order_summary">Votre commande</label>
                            <div class="order-summary" id="orderSummary"></div>
                        </div>
```

Champ téléphone :

```html
                                <input type="tel" id="tel" name="Telephone" placeholder="0X XX XX XX XX" pattern="0[5-7]( ?[0-9]){8}" title="Numéro mobile algérien : 05, 06 ou 07 + 8 chiffres" required>
```

Supprimer les deux `form-group` « Produit souhaité » (`#produit`) et « Quantité » (`#quantite`).

Remplacer le bouton d'envoi par :

```html
                        <button type="submit" class="btn-submit" id="orderSubmit" data-i18n="form_submit">Envoyer la commande</button>
                        <button type="button" class="btn-whatsapp" id="orderWhatsapp">
                            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="(même path que .wa-fab)"/></svg>
                            <span data-i18n="order_via_whatsapp">Commander via WhatsApp</span>
                        </button>
```
(le `d` du `<path>` est identique à celui du bouton `.wa-fab` de la Task 4).

- [ ] **Step 2 : Supprimer l'ancienne modale de commande**

- HTML : tout le bloc `<!-- ══════════ MODAL ══════════ -->` (`#orderModal`).
- JS : `const modal`, `const modalClose`, `const produitSelect`, la ligne `modalFormNext`, la ligne `// Copy wilayas to modal` + sa ligne, `populateProductSelect()` (fonction et appel dans `setLang`), le bloc `// ── Modal ──` (`openModal`, `closeModal`, 3 écouteurs).
- CSS : règles `.modal-product-preview`, `.modal-product-preview img`, `.modal-product-preview h4`, `.modal-product-preview .price` (garder `.modal-overlay`, `.modal-content`, `.modal-close`, `@keyframes modalIn`).

- [ ] **Step 3 : CSS récapitulatif + bouton WhatsApp**

Après `.btn-submit:hover { … }` :

```css
        .btn-whatsapp {
            width: 100%; padding: 15px; margin-top: 12px; display: flex; align-items: center; justify-content: center; gap: 10px;
            background: transparent; color: #1da851; border: 1px solid #25D366; border-radius: var(--radius);
            font-family: var(--font-body); font-size: 0.92rem; font-weight: 600; cursor: pointer; transition: var(--transition);
        }
        .btn-whatsapp:hover { background: #25D366; color: #fff; box-shadow: 0 8px 24px rgba(37,211,102,0.3); }
        .btn-whatsapp svg { width: 20px; height: 20px; }
        .btn-submit:disabled, .btn-whatsapp:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; transform: none; }
        .btn-whatsapp:disabled:hover { background: transparent; color: #1da851; }

        .order-summary { background: var(--bg-deep); border: 1px solid var(--border); border-radius: var(--radius); padding: 8px 16px 12px; }
        .order-summary-line { display: grid; grid-template-columns: 40px 1fr auto; gap: 12px; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 0.85rem; }
        .order-summary-line img { width: 40px; height: 40px; object-fit: cover; border-radius: 8px; }
        .order-summary-amount { color: var(--gold); font-weight: 600; white-space: nowrap; }
        .order-summary-total { display: flex; justify-content: space-between; align-items: baseline; padding-top: 12px; }
        .order-summary-total small { color: var(--text-muted); font-size: 0.72rem; }
        .order-summary-total strong { font-family: var(--font-display); font-size: 1.3rem; color: var(--gold); }
        .order-summary-edit { background: none; border: none; color: var(--blue); font-family: var(--font-body); font-size: 0.8rem; cursor: pointer; padding: 8px 0 0; text-decoration: underline; }
        .order-summary-empty { font-size: 0.85rem; color: var(--text-muted); padding: 8px 0; }
        .order-summary-empty a { color: var(--blue); }
```

- [ ] **Step 4 : JS récapitulatif, e-mail, WhatsApp**

Ajouter après le bloc CART :

```js
        // ══════════════════════════════════════════
        // CHECKOUT
        // ══════════════════════════════════════════
        var orderForm = document.getElementById('orderForm');
        var orderSummary = document.getElementById('orderSummary');

        function renderOrderSummary() {
            var t = T[currentLang];
            var lines = cartLines();
            var sum = ASYCart.summarize(lines);
            orderSummary.innerHTML = lines.length ? lines.map(function(l) {
                return '<div class="order-summary-line"><img src="' + esc(getProductImg(l.product)) + '" alt="">' +
                    '<span>' + l.qty + ' &times; ' + esc(getProductName(l.product)) + '</span>' +
                    '<span class="order-summary-amount">' + esc(lineAmount(l)) + '</span></div>';
            }).join('') +
                '<div class="order-summary-total"><span>' + esc(t.cart_total) + ' <small>' + esc(t.cart_excl_delivery) + '</small></span>' +
                '<strong>' + esc(ASYCart.formatDA(sum.total)) + '</strong></div>' +
                (sum.onRequest ? '<p class="cart-note">' + esc(t.cart_on_request) + '</p>' : '') +
                '<button type="button" class="order-summary-edit" data-edit-cart>' + esc(t.cart_edit) + '</button>'
            : '<div class="order-summary-empty">' + esc(t.cart_empty) + ' <a href="#produits">' + esc(t.cart_browse) + '</a></div>';
            document.getElementById('orderSubmit').disabled = !lines.length;
            document.getElementById('orderWhatsapp').disabled = !lines.length;
        }

        orderSummary.addEventListener('click', function(e) {
            if (e.target.closest('[data-edit-cart]')) openCart();
        });

        // E-mail (formsubmit): item list always in French for the shop
        orderForm.addEventListener('submit', function(e) {
            var lines = cartLines();
            if (!lines.length) { e.preventDefault(); return; }
            var sum = ASYCart.summarize(lines);
            document.getElementById('orderItems').value = ASYCart.formatLines(lines, function(p) { return getProductName(p, 'fr'); }, T.fr.ref_label);
            document.getElementById('orderTotal').value = ASYCart.formatDA(sum.total) + ' ' + T.fr.cart_excl_delivery + (sum.onRequest ? ' ' + T.fr.cart_on_request : '');
        });

        // WhatsApp: same order, in the site language, with the fields already filled in
        document.getElementById('orderWhatsapp').addEventListener('click', function() {
            var lines = cartLines();
            if (!lines.length) return;
            var t = T[currentLang];
            var sum = ASYCart.summarize(lines);
            var parts = [
                t.wa_order_intro,
                ASYCart.formatLines(lines, function(p) { return getProductName(p); }, t.ref_label),
                '',
                t.cart_total + ' : ' + ASYCart.formatDA(sum.total) + ' (' + t.cart_excl_delivery + ')' + (sum.onRequest ? '\n' + t.cart_on_request : '')
            ];
            var fields = [
                [t.form_name, orderForm.elements.Nom.value],
                [t.form_phone, orderForm.elements.Telephone.value],
                [t.form_wilaya, orderForm.elements.Wilaya.value],
                [t.wa_message, orderForm.elements.Message.value]
            ].filter(function(f) { return f[1] && f[1].trim(); });
            if (fields.length) parts.push('', fields.map(function(f) { return f[0] + ' : ' + f[1].trim(); }).join('\n'));
            window.open(ASYCart.whatsappUrl(WA_PHONE, parts.join('\n')), '_blank', 'noopener');
        });
```

Dans `renderCart`, à la fin : `renderOrderSummary();`

- [ ] **Step 5 : Vérifier**

Panier vide → récapitulatif « Votre panier est vide », 2 boutons désactivés. 2 articles → lignes, total, « Modifier le panier » ouvre le panneau. Téléphone « 05 56 87 75 46 » accepté, « 12345 » refusé. Intercepter l'envoi e-mail sans l'envoyer (`orderForm.addEventListener('submit', e => e.preventDefault())` ajouté depuis la console) : `orderItems.value` = lignes en français avec `réf.`, `orderTotal.value` correct. WhatsApp : intercepter `window.open` depuis la console et contrôler le texte décodé (FR puis AR).

- [ ] **Step 6 : Commit**

```bash
git add index.html
git commit -m "Validation : récapitulatif du panier, envoi e-mail et WhatsApp, ancienne modale supprimée"
```

---

### Task 7 : Fiche produit

**Files:**
- Modify: `index.html` (HTML modale, CSS, JS ; remplace le stub `openProduct`)

- [ ] **Step 1 : HTML**

Après le panneau panier :

```html
    <!-- ══════════ PRODUCT MODAL ══════════ -->
    <div class="modal-overlay" id="productModal">
        <div class="modal-content product-modal" role="dialog" aria-modal="true" aria-labelledby="pmName">
            <button class="modal-close" id="pmClose" aria-label="Fermer" data-i18n-aria="product_close">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <div class="pm-gallery">
                <div class="pm-main">
                    <img src="" alt="" id="pmImg">
                    <button type="button" class="pm-nav pm-prev" id="pmPrev" aria-label="Photo précédente" data-i18n-aria="product_prev" hidden>&#8249;</button>
                    <button type="button" class="pm-nav pm-next" id="pmNext" aria-label="Photo suivante" data-i18n-aria="product_next" hidden>&#8250;</button>
                </div>
                <div class="pm-thumbs" id="pmThumbs"></div>
            </div>
            <div class="pm-info">
                <div class="product-category" id="pmCat"></div>
                <h3 class="pm-name" id="pmName"></h3>
                <div id="pmSpec"></div>
                <div class="pm-price" id="pmPrice"></div>
                <p class="pm-desc" id="pmDesc"></p>
                <div class="pm-qty"><span data-i18n="form_qty">Quantite</span><div id="pmQty"></div></div>
                <div class="pm-actions">
                    <button type="button" class="btn-secondary" id="pmAdd" data-i18n="btn_add_cart">Ajouter au panier</button>
                    <button type="button" class="btn-primary" id="pmBuy" data-i18n="btn_buy_now">Acheter</button>
                </div>
                <a class="pm-question" id="pmQuestion" href="https://wa.me/213556877546" target="_blank" rel="noopener">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="(même path que .wa-fab)"/></svg>
                    <span data-i18n="wa_product_question">Une question sur ce produit ?</span>
                </a>
            </div>
        </div>
    </div>
```

- [ ] **Step 2 : CSS**

Avant `/* ── CART ── */` :

```css
        /* ── PRODUCT MODAL ── */
        .product-modal { max-width: 920px; padding: 0; display: grid; grid-template-columns: 1.05fr 1fr; }
        .product-modal .modal-close { z-index: 2; background: rgba(255,255,255,0.92); }
        .pm-gallery { background: #f0ece6; display: flex; flex-direction: column; }
        .pm-main { position: relative; aspect-ratio: 3 / 4; }
        .pm-main img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .pm-nav {
            position: absolute; top: 50%; transform: translateY(-50%); width: 40px; height: 40px; border-radius: 50%;
            border: none; background: rgba(255,255,255,0.92); color: var(--text-primary); font-size: 1.6rem; line-height: 1;
            cursor: pointer; box-shadow: 0 4px 16px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center;
        }
        .pm-nav[hidden] { display: none; }
        .pm-prev { inset-inline-start: 12px; }
        .pm-next { inset-inline-end: 12px; }
        html[dir="rtl"] .pm-nav { transform: translateY(-50%) scaleX(-1); }
        .pm-thumbs { display: flex; gap: 8px; padding: 12px; overflow-x: auto; }
        .pm-thumbs:empty { display: none; }
        .pm-thumbs button { flex: 0 0 56px; height: 56px; border-radius: 8px; overflow: hidden; border: 2px solid transparent; padding: 0; cursor: pointer; background: none; }
        .pm-thumbs button.active { border-color: var(--gold); }
        .pm-thumbs img { width: 100%; height: 100%; object-fit: cover; }
        .pm-info { padding: 48px 36px 32px; }
        .pm-name { font-family: var(--font-display); font-size: 1.9rem; font-weight: 600; line-height: 1.15; margin-bottom: 12px; }
        .pm-price { font-family: var(--font-display); font-size: 1.8rem; font-weight: 700; color: var(--gold); margin-bottom: 16px; }
        .pm-desc { color: var(--text-secondary); font-size: 0.92rem; line-height: 1.8; margin-bottom: 24px; }
        .pm-desc:empty { display: none; }
        .pm-qty { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; font-size: 0.85rem; color: var(--text-secondary); }
        .pm-actions { display: flex; gap: 12px; flex-wrap: wrap; }
        .pm-actions button { flex: 1 1 160px; justify-content: center; padding-left: 20px; padding-right: 20px; }
        .pm-question { display: inline-flex; align-items: center; gap: 8px; margin-top: 20px; color: #1da851; font-size: 0.85rem; text-decoration: none; }
        .pm-question:hover { text-decoration: underline; }
        .pm-question svg { width: 18px; height: 18px; }
```

Dans `@media (max-width: 768px)` :

```css
            .product-modal { grid-template-columns: 1fr; }
            .pm-main { aspect-ratio: 1 / 1; }
            .pm-info { padding: 24px 20px; }
            .pm-name { font-size: 1.5rem; }
```

- [ ] **Step 3 : JS**

Remplacer le stub `function openProduct(product) { /* Task 7 */ }` par :

```js
        // ══════════════════════════════════════════
        // PRODUCT MODAL
        // ══════════════════════════════════════════
        var productModal = document.getElementById('productModal');
        var pm = { product: null, images: [], index: 0, qty: 1 };

        function showPmImage(i) {
            if (!pm.images.length) return;
            pm.index = (i + pm.images.length) % pm.images.length;
            document.getElementById('pmImg').src = pm.images[pm.index];
            document.querySelectorAll('#pmThumbs button').forEach(function(b, j) { b.classList.toggle('active', j === pm.index); });
        }

        function renderPmQty() {
            document.getElementById('pmQty').innerHTML = qtyControl('pm', pm.qty);
        }

        // Texts that depend on the language (also called by setLang while open)
        function fillProductModal() {
            var p = pm.product, t = T[currentLang], name = getProductName(p);
            var ref = p.id != null ? ' (' + t.ref_label + ' ' + p.id + ')' : '';
            document.getElementById('pmCat').textContent = getCategoryLabel(p.cat);
            document.getElementById('pmName').textContent = name;
            document.getElementById('pmSpec').innerHTML = p.spec ? '<div class="' + getSpecClass(p.spec) + '">' + getSpecIcon(p.spec) + ' ' + esc(getSpecText(p.spec)) + '</div>' : '';
            document.getElementById('pmPrice').textContent = p.price;
            document.getElementById('pmDesc').textContent = getProductDesc(p);
            document.getElementById('pmImg').alt = name;
            document.getElementById('pmQuestion').href = ASYCart.whatsappUrl(WA_PHONE, t.wa_product_msg + ' ' + name + ref);
        }

        function openProduct(product) {
            pm.product = product;
            pm.images = getProductImages(product);
            pm.qty = 1;
            var multi = pm.images.length > 1;
            document.getElementById('pmPrev').hidden = !multi;
            document.getElementById('pmNext').hidden = !multi;
            document.getElementById('pmThumbs').innerHTML = multi ? pm.images.map(function(src, i) {
                return '<button type="button" data-index="' + i + '"><img src="' + esc(src) + '" alt=""></button>';
            }).join('') : '';
            fillProductModal();
            showPmImage(0);
            renderPmQty();
            productModal.classList.add('active');
            setOverlay(true);
            history.replaceState(null, '', '#produit-' + encodeURIComponent(getProductKey(product)));
        }

        function closeProduct() {
            if (!productModal.classList.contains('active')) return;
            productModal.classList.remove('active');
            setOverlay(false);
            pm.product = null;
            history.replaceState(null, '', window.location.pathname + window.location.search);
        }

        function openProductFromHash() {
            var m = /^#produit-(.+)$/.exec(window.location.hash);
            if (!m) return;
            var key;
            try { key = decodeURIComponent(m[1]); } catch (e) { return; }
            var product = findProduct(key);
            if (product) openProduct(product);
        }

        document.getElementById('pmClose').addEventListener('click', closeProduct);
        document.getElementById('pmPrev').addEventListener('click', function() { showPmImage(pm.index - 1); });
        document.getElementById('pmNext').addEventListener('click', function() { showPmImage(pm.index + 1); });
        productModal.addEventListener('click', function(e) {
            if (e.target === productModal) { closeProduct(); return; }
            var thumb = e.target.closest('#pmThumbs button');
            if (thumb) { showPmImage(parseInt(thumb.getAttribute('data-index'), 10)); return; }
            var step = e.target.closest('#pmQty .qty button');
            if (step) {
                pm.qty = ASYCart.clampQty(pm.qty + parseInt(step.getAttribute('data-step'), 10));
                renderPmQty();
            }
        });
        document.getElementById('pmAdd').addEventListener('click', function() {
            addToCart(pm.product, pm.qty);
            closeProduct();
        });
        document.getElementById('pmBuy').addEventListener('click', function() {
            cart.add(getProductKey(pm.product), pm.qty);
            renderCart();
            closeProduct();
            document.getElementById('commander').scrollIntoView({ behavior: 'smooth' });
        });
        window.addEventListener('hashchange', openProductFromHash);
        document.addEventListener('keydown', function(e) {
            if (e.key !== 'Escape') return;
            closeProduct();
            closeCart();
        });
```

Dans `setLang`, à la fin : `if (pm.product) fillProductModal();`
Dans `// ── Init ──`, après `setLang(currentLang);` : `openProductFromHash();`

**Attention à l'ordre :** `setLang(currentLang)` (Init) s'exécute en fin d'IIFE ; les blocs CART, CHECKOUT et PRODUCT MODAL (qui déclarent `cart`, `pm`, etc.) doivent être placés **avant** le bloc `// ── Init ──`, et le bloc Success (qui appelle `cart.clear()`) après le bloc CART.

- [ ] **Step 4 : Vérifier**

Clic photo ou nom → fiche (nom, catégorie, usage, prix, description, quantité). Clic sur « Ajouter au panier » à l'intérieur de la carte → **n'ouvre pas** la fiche. Fiche : quantité 3 → « Ajouter au panier » → pastille +3, fiche fermée. « Acheter » → défilement vers le formulaire, article dans le récapitulatif. URL `#produit-12` pendant l'ouverture, retirée à la fermeture. Ouvrir `http://localhost:8765/#produit-12` directement → fiche 12. Échap, croix, clic sur le fond ferment. AR : description arabe, mise en page RTL. Lien « Une question ? » : texte avec nom + réf.

- [ ] **Step 5 : Commit**

```bash
git add index.html
git commit -m "Fiche produit : galerie, description, quantité, ajout/achat, lien partageable"
```

---

### Task 8 : Vérification complète dans le navigateur

- [ ] **Step 1 :** `node --test _tests/cart.test.js` → tout passe.
- [ ] **Step 2 :** Playwright, largeur 1280 puis 390 (mobile), en FR, AR, EN : parcours complet (ajout carte, fiche, quantités, rechargement, récapitulatif, lien `#produit-7`, liens WhatsApp). Captures d'écran : accueil + bouton WhatsApp, fiche, panneau panier, récapitulatif, version AR, version mobile.
- [ ] **Step 3 :** Console : 0 erreur. En-tête mobile : pas de débordement horizontal (`document.documentElement.scrollWidth <= innerWidth`).
- [ ] **Step 4 :** Corriger ce qui ne va pas, recommencer le parcours concerné, commit `"Corrections après vérification navigateur"` si besoin.

### Task 9 : Remise

- [ ] **Step 1 :** `git log --oneline` et `git status` propres.
- [ ] **Step 2 :** Résumé à l'utilisateur, captures, points à faire valider (descriptions, accents manquants dans les anciens textes, envoi e-mail réel non testé). **Demander l'accord avant tout `git push`.**

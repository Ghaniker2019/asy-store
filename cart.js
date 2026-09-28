/* ASY Store — logique du panier, sans DOM.
   Chargé par index.html (window.ASYCart) et par _tests/cart.test.js (require). */
(function (root) {
    'use strict';

    var MAX_QTY = 10;

    // "4 500 DA" -> 4500 ; "Sur demande" -> null. Prices are free text in the admin:
    // cents are dropped, and anything that is not a single amount (a range...) counts as "on request".
    function parsePrice(price) {
        var s = String(price == null ? '' : price).replace(/[.,]\d{1,2}(?!\d)/g, '');
        var numbers = s.match(/\d{1,3}(?:[ .  ]\d{3})+(?!\d)|\d+/g);
        if (!numbers || numbers.length !== 1) return null;
        return parseInt(numbers[0].replace(/\D/g, ''), 10);
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

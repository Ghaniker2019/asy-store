/* ASY Store — livraison : wilaya du formulaire -> tarifs, communes et bureaux E-com (sans DOM).
   Chargé par index.html (window.ASYDelivery) et par _tests/delivery.test.js (require). */
(function (root) {
    'use strict';

    // "16 - Alger" -> 16
    function wilayaNumber(value) {
        var n = parseInt(String(value == null ? '' : value), 10);
        return isNaN(n) ? null : n;
    }

    // The 11 wilayas created in 2025 (59-69) are unknown to E-com: they use their former wilaya.
    // Returns null for an empty or unknown wilaya; served = at least one delivery mode.
    function forWilaya(data, siteWilaya) {
        var n = wilayaNumber(siteWilaya);
        if (n === null) return null;
        var id = data.aliases[n] || n;
        var w = data.wilayas[id];
        if (!w) return null;
        return {
            id: id, domicile: w.domicile, stopdesk: w.stopdesk, communes: w.communes, bureaux: w.bureaux,
            served: w.domicile !== null || w.stopdesk !== null
        };
    }

    // Price of a delivery mode ('domicile' | 'stopdesk'), null when not offered
    function fee(data, siteWilaya, mode) {
        var w = forWilaya(data, siteWilaya);
        if (!w || (mode !== 'domicile' && mode !== 'stopdesk')) return null;
        return w[mode];
    }

    var api = { wilayaNumber: wilayaNumber, forWilaya: forWilaya, fee: fee };

    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.ASYDelivery = api;
})(this);

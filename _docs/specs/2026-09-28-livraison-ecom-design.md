# ASY Store — Frais de livraison E-com Delivery

Date : 28 septembre 2026 — conception validée

## Périmètre

Afficher au client les vrais frais E-com Delivery et le total à payer. Adnane continue de créer
les colis lui-même dans E-com (pas de création automatique, pas de serveur).

## Décisions

- Prix client = tarif E-com exact (domicile / stop desk, par wilaya).
- Stop desk : le client choisit le bureau (liste E-com de la wilaya, adresse affichée).
- Domicile : commune (livrables E-com) + adresse obligatoires.
- Wilayas 59 à 69 (créées en 2025, inconnues d'E-com) : données de la wilaya d'origine
  (59→3, 60→5, 61→14, 62→17, 63→17, 64→28, 65→32, 66→7, 67→12, 68→26, 69→13).
- Non desservies (50 Bordj Badji Mokhtar, 54 In Guezzam) : message « contactez-nous sur
  WhatsApp », envoi e-mail bloqué. « Livraison 69 wilayas » → « Livraison 67 wilayas ».

## Architecture

- `delivery-data.js` (généré) : `ASY_DELIVERY = { updated, aliases, wilayas: { id: { domicile,
  stopdesk, communes[], bureaux[{code, nom, adresse, commune, maps}] } } }`. Frais `null` = mode indisponible.
- `_tools/update-delivery.js` : lit `/wilayas`, `/tarifs`, `/communes`, `/stopdesks` (API v2,
  lecture seule) avec `ECOM_KEY` / `ECOM_TOKEN` en variables d'environnement. **Aucun identifiant
  dans le dépôt ni sur le site** (dépôt et site publics ; E-com coupe l'accès en cas de fuite).
- `delivery.js` : logique pure (`wilayaNumber`, `forWilaya`, `fee`), testée dans
  `_tests/delivery.test.js` (y compris l'intégrité des données générées).
- `index.html` : bloc « Mode de livraison » après la wilaya, champs commune/adresse ou bureau,
  récapitulatif sous-total / livraison / total, champs e-mail `Mode de livraison`, `Commune`,
  `Adresse`, `Bureau`, `Sous-total`, `Livraison`, `Total` ; message WhatsApp complété.
  Champs masqués = `disabled` (ni validés ni envoyés).

## Mise à jour des tarifs

`ECOM_KEY=… ECOM_TOKEN=… node _tools/update-delivery.js`, vérifier, commit, push.

## Vérification

Tests Node ; navigateur FR/AR/EN, mobile : Alger domicile et stop desk, Aflou (59→Laghouat),
Bordj Badji Mokhtar (bloqué), contenu e-mail (intercepté) et WhatsApp, mise en page RTL.

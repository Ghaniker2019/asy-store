# ASY Store — Panier, fiche produit, bouton WhatsApp

Date : 28 septembre 2026
Statut : conception validée

## Contexte

Site vitrine statique (GitHub Pages) : `index.html` (HTML + CSS + JS en ligne), 30 produits
codés en dur (une photo chacun, aucune description), traductions FR/AR/EN, commande par
e-mail via formsubmit.co vers asystore.dz@gmail.com. Firebase prévu mais non configuré.

Aujourd'hui, le bouton « Commander » d'une carte produit ouvre directement une fenêtre de
commande pour un seul produit. Pas de panier, pas de fiche produit, pas de contact WhatsApp.

## Objectifs

1. Un panier : ajouter plusieurs produits, régler les quantités, valider en une fois.
2. Une fiche produit au clic : photos, description, boutons « Ajouter au panier » et « Acheter ».
3. Un bouton WhatsApp qui ouvre une conversation écrite (pas un appel) avec le +213 556 87 75 46.

## Architecture

- **`products.js` (nouveau)** : données des 30 produits par défaut — `id`, `cat`, `spec`,
  `price`, `images` (tableau, une photo aujourd'hui), `name` et `desc` en `fr`/`ar`/`en`.
  Remplace le tableau `defaultProducts` et l'objet `productNames` d'`index.html`.
  Expose une seule variable globale `ASY_PRODUCTS`.
- **`cart.js` (nouveau)** : logique du panier sans DOM (prix, totaux, quantités, stockage,
  texte de commande, lien WhatsApp). Exposé en `window.ASYCart` dans le navigateur et en
  module Node pour les tests (`_tests/cart.test.js`, lancés avec `node --test`).
- **`index.html`** : HTML, CSS et affichage (panier, fiche, WhatsApp), dans le style du code
  existant (IIFE, `var`/`function`, `esc()` pour tout texte injecté).
- **`admin.html`, `firebase-init.js`** : non modifiés.

Compatibilité Firebase : si un produit Firebase porte `images`, `descFr`, `descAr`, `descEn`,
ils sont utilisés ; sinon repli sur `imageUrl` et pas de description.

## 1. Panier

- Icône panier dans l'en-tête avec pastille de quantité totale (masquée si 0).
- Bouton des cartes produits : « Ajouter au panier » → ajoute 1, message de confirmation
  (toast), pastille mise à jour. Le client reste où il est.
- Panneau latéral (droite ; gauche en arabe), ouvert par l'icône : pour chaque article
  photo, nom, prix unitaire, quantité −/+ (1 à 10), supprimer ; total hors livraison ;
  bouton « Valider la commande » → ferme le panneau, fait défiler jusqu'à `#commander`.
  Panier vide : message + lien vers les produits.
- Stockage : `localStorage` clé `asy_cart`, format `[{ key, qty }]` (clé produit =
  `_key` Firebase ou `String(id)`). Noms et prix résolus à l'affichage (changement de langue
  OK) ; entrée dont le produit n'existe plus = ignorée. Lectures/écritures sous try/catch.
- Prix : texte (« 4 500 DA »). Montant = chiffres extraits. Prix sans chiffre
  (« Sur demande ») : affiché tel quel, exclu du total, mention « + articles sur demande ».

## 2. Validation (section `#commander`)

- Un seul formulaire. Les listes « Produit » et « Quantité » sont remplacées par un
  récapitulatif du panier (lecture seule) + lien « Modifier le panier » (ouvre le panneau).
- Champs conservés : nom, téléphone, wilaya, message. Téléphone : mobile algérien,
  espaces simples acceptés entre les chiffres (motif `0[5-7]( ?[0-9]){8}`, ex. « 05 56 87 75 46 »).
- Panier vide : récapitulatif « Votre panier est vide » + lien vers les produits ; boutons
  d'envoi désactivés.
- « Envoyer la commande » (formsubmit, inchangé côté service) : champs cachés
  `Commande` (une ligne par article : `2 × Nom FR (réf. 12) — 4 500 DA`) et `Total`.
  Noms en français dans l'e-mail, quelle que soit la langue du site.
- Retour `?success=1` : toast existant + vidage du panier.
- « Commander via WhatsApp » : ouvre `https://wa.me/213556877546?text=…` avec salutation,
  lignes du panier (langue du site + réf.), total, et nom / wilaya / message s'ils sont
  remplis. Ne vide pas le panier (l'envoi n'est pas confirmé).
- La fenêtre de commande actuelle (`#orderModal`, `#modalForm`) est supprimée.

## 3. Fiche produit

- Ouverture : clic sur la photo ou le nom d'une carte.
- Contenu : photo principale ; miniatures + flèches seulement si plusieurs photos ;
  nom, catégorie, usage (intérieur/extérieur), prix, description, quantité −/+,
  « Ajouter au panier » (secondaire), « Acheter » (principal), lien « Une question ? WhatsApp »
  pré-rempli avec le nom du produit.
- « Acheter » : ajoute la quantité choisie au panier, ferme la fiche, défile vers `#commander`.
- Lien partageable : ouverture de la fiche → `#produit-<id ou clé>` dans l'URL ; arriver sur
  cette URL ouvre la fiche ; fermer la fiche retire le fragment (`history.replaceState`).
- Fermeture : croix, clic sur le fond, Échap. Deux colonnes sur ordinateur, une sur mobile.
- Descriptions : 2 à 3 phrases par produit en FR/AR/EN, rédigées d'après la photo (style,
  finition, effet de lumière, pièces conseillées). **Aucune caractéristique technique
  inventée** (dimensions, puissance, matériaux). À relire par Adnane.

## 4. Bouton WhatsApp

- Bouton rond vert flottant, bas droite (bas gauche en arabe), au-dessus du contenu mais
  sous les fenêtres ouvertes (masqué quand la fiche ou le panneau panier est ouvert).
- Lien `https://wa.me/213556877546?text=<salutation dans la langue du site>`, nouvel onglet.
- Numéro ajouté dans la colonne Contact du pied de page (même lien).

## Traductions

Toutes les nouvelles chaînes (panier, fiche, WhatsApp, messages) ajoutées à `T.fr`,
`T.ar`, `T.en`. Mise en page RTL vérifiée en arabe.

## Hors périmètre

- Espace admin (ajout de plusieurs photos / descriptions) — à faire quand Firebase sera configuré.
- Frais de livraison par wilaya.
- Pages produit séparées.

## Vérification

Dans un navigateur, en FR / AR / EN, largeur mobile et ordinateur :
ajout depuis carte et fiche, quantités, suppression, persistance après rechargement,
total avec produit « Sur demande », lien `#produit-12`, contenu du lien WhatsApp (panier et
bouton flottant), formulaire bloqué si panier vide. L'envoi e-mail réel n'est pas testé sans
accord (il arriverait sur la vraie boîte).

Rien n'est poussé sur GitHub (site public) sans accord explicite.

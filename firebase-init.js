// ═══════════════════════════════════════════════════════════════
// ASY STORE - Configuration Firebase
// ═══════════════════════════════════════════════════════════════
//
// INSTRUCTIONS POUR CONFIGURER FIREBASE :
//
// 1. Allez sur https://console.firebase.google.com
// 2. Cliquez "Ajouter un projet" → nommez-le "asy-store"
// 3. Desactivez Google Analytics (pas necessaire) → Creer
// 4. Dans le projet, cliquez l'icone </> (Web) pour ajouter une app
// 5. Nommez-la "asy-store-web" → Enregistrer
// 6. Copiez les valeurs firebaseConfig et collez-les ci-dessous
//
// 7. AUTHENTICATION :
//    - Menu gauche → "Authentication" → "Commencer"
//    - Onglet "Sign-in method" → Activer "Google"
//    - Mettre votre email asystore.dz@gmail.com comme email d'assistance
//
// 8. REALTIME DATABASE :
//    - Menu gauche → "Realtime Database" → "Creer une base de donnees"
//    - Choisir emplacement : europe-west1 (Belgique)
//    - Commencer en "mode verrouille"
//    - Puis aller dans l'onglet "Regles" et coller :
//
//    {
//      "rules": {
//        "products": {
//          ".read": true,
//          ".write": "auth != null && auth.token.email === 'asystore.dz@gmail.com'"
//        }
//      }
//    }
//
// 9. STORAGE :
//    - Menu gauche → "Storage" → "Commencer"
//    - Emplacement : europe-west1
//    - Aller dans l'onglet "Rules" et coller :
//
//    rules_version = '2';
//    service firebase.storage {
//      match /b/{bucket}/o {
//        match /products/{allPaths=**} {
//          allow read: if true;
//          allow write: if request.auth != null
//                       && request.auth.token.email == 'asystore.dz@gmail.com';
//        }
//      }
//    }
//
// 10. Collez vos valeurs ci-dessous et deployez !
//
// ═══════════════════════════════════════════════════════════════

const firebaseConfig = {
    apiKey: "COLLER_ICI",
    authDomain: "COLLER_ICI",
    databaseURL: "COLLER_ICI",
    projectId: "COLLER_ICI",
    storageBucket: "COLLER_ICI",
    messagingSenderId: "COLLER_ICI",
    appId: "COLLER_ICI"
};

// ── Initialisation ──
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const storage = firebase.storage();

// ── Helpers ──
function isFirebaseConfigured() {
    return firebaseConfig.apiKey && firebaseConfig.apiKey !== "COLLER_ICI";
}

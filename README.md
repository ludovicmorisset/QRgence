# QRgence — cartes d’urgence privées

Application web statique pour créer une carte d’urgence imprimable avec QR code. La saisie, l’encodage du QR code et la création de l’image sont exécutés dans le navigateur.

## Confidentialité

- Aucun compte, formulaire serveur, base de données, cookie, stockage navigateur, outil d’analyse ou télémétrie.
- Les données saisies ne sont pas incluses dans les requêtes HTTP. Le navigateur télécharge les ressources de l’application, le code de la bibliothèque QR et la police Commissioner depuis Google Fonts.
- Le QR code contient les données de santé et de contact **en clair**. Ce n’est pas un chiffrement : toute personne qui le scanne peut les lire.
- L’hébergeur web peut voir les requêtes ordinaires nécessaires au chargement du site (par exemple l’adresse IP, l’heure et les fichiers demandés). Configurez et vérifiez séparément la rétention des journaux du serveur et du proxy.
- La police Commissioner est chargée depuis Google Fonts. Google reçoit les requêtes normales nécessaires au chargement de la police et peut traiter les métadonnées de connexion conformément à ses propres règles.

N’inscrivez que les informations nécessaires à une intervention. Toute personne détenant une copie de la carte peut scanner son QR code. Remplacez ou détruisez les anciennes copies lorsque les informations changent.

## Démarrer en local

Prérequis : Node.js 20 ou plus récent et npm.

```sh
npm ci
npm run dev
```

Vite affiche l’adresse locale à ouvrir dans le navigateur.

## Construire pour la production

```sh
npm ci
npm run build
```

Le site statique est généré dans `dist/`. Déployez le contenu de ce répertoire sur un hébergement HTTPS statique. Aucun serveur applicatif ni base de données n’est nécessaire. Le répertoire `dist/` est produit par le build et n’est pas versionné.

Pour vérifier localement le build :

```sh
npm run preview
```

## Déploiement avec Docker

Docker et Docker Compose doivent être installés. Depuis la racine du projet, lancez :

```sh
docker compose up --build -d
```

Le site est alors disponible sur le port `8080`. Pour arrêter le service :

```sh
docker compose down
```

Le build utilise `npm ci` dans une étape Node, puis ne conserve que les fichiers de `dist/` dans l’image Nginx finale. Il n’est pas nécessaire d’installer Node.js ou `node_modules` sur la machine hôte.

## Déploiement sur un VPS

1. Construisez le site avec `npm ci && npm run build`.
2. Publiez le contenu de `dist/` avec Nginx, Caddy ou un serveur de fichiers statiques.
3. Activez HTTPS et configurez le serveur pour ne servir que les fichiers statiques.
4. Ne configurez pas de journalisation des corps de requêtes, d’analytics, de proxy tiers, ni de cache applicatif persistant.
5. Vérifiez les logs et paramètres de conservation de Nginx/Caddy, du système et de tout reverse proxy/CDN : ils peuvent conserver des métadonnées de visite, même si cette application n’envoie pas les données saisies.

Le projet ne fournit pas de configuration serveur car les réglages de rétention et de sécurité dépendent du VPS et du reverse proxy utilisés.

## Utilisation

1. Renseignez l’identité, les informations de santé et au moins un numéro de contact.
2. Choisissez un thème et générez la carte.
3. Imprimez-la ou téléchargez-la en image.
4. Scannez le QR code avec un autre appareil pour vérifier son contenu avant impression.

Le QR code généré est un texte brut lisible avec l’appareil photo ou une application de scan compatible.

## Technologies

- Vite
- Bibliothèque `qrcode`
- JavaScript natif, HTML et CSS

## Contrôles

```sh
npm test
npm run build
```

Le contrôle de confidentialité vérifie qu’aucune primitive d’envoi ou de stockage local n’est introduite et que la CSP bloque les connexions sortantes. Il complète la revue du code, sans remplacer la vérification des requêtes et de la configuration du VPS.

Aucun compte, service distant ou variable d’environnement n’est requis pour construire ou exécuter l’application.

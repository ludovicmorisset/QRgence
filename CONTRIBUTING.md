# Contribuer

Merci de contribuer à QRgence. Les changements doivent préserver le fonctionnement sans compte, sans stockage des données saisies et sans transmission de données personnelles.

## Proposer un changement

1. Ouvrez une issue ou une pull request en décrivant le besoin et la solution.
2. N’ajoutez jamais de données médicales ou personnelles réelles dans les issues, captures d’écran, tests ou commits.
3. Gardez l’application statique et n’ajoutez pas de services tiers, analytics, cookies, stockage navigateur ou API recevant des données saisies sans documenter leur impact sur la confidentialité. Google Fonts est l’unique ressource tierce autorisée pour la police Commissioner.
4. Exécutez `npm ci` puis `npm run build` avant de soumettre une pull request.
5. Expliquez toute nouvelle requête réseau et démontrez qu’aucune donnée saisie ne peut y être incluse.

## Vérification de confidentialité

Pour toute modification touchant aux formulaires, au QR code, aux ressources ou au réseau, examinez les requêtes du navigateur et confirmez qu’elles ne contiennent aucune valeur saisie. Mettez à jour `README.md` et `SECURITY.md` si le traitement des données ou les limites de confidentialité changent.

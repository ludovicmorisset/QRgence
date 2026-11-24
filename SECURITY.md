# Sécurité et confidentialité

## Données personnelles

Les informations saisies sont traitées en mémoire dans le navigateur et encodées dans le QR code localement. L’application ne les envoie à aucun endpoint et ne les conserve pas dans le stockage navigateur.

Le QR code n’est pas chiffré. Il expose son contenu à toute personne pouvant le scanner. Ne publiez pas la carte et n’ajoutez que les données nécessaires.

L’hébergement statique reçoit néanmoins des requêtes réseau normales pour servir les fichiers du site. L’adresse IP et les métadonnées de requête peuvent apparaître dans les journaux du serveur, du reverse proxy ou du fournisseur d’hébergement. La configuration de rétention de ces journaux est hors du contrôle de l’application et doit être vérifiée sur le VPS.

## Signaler une vulnérabilité

N’incluez jamais de données personnelles, de données médicales ou une carte réelle dans un rapport. Pour un signalement privé, utilisez la fonction de signalement de vulnérabilité privée de GitHub si elle est activée pour le dépôt, ou contactez directement les mainteneurs.

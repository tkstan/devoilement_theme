# Dévoilement Theme

Application React construite avec Vite pour explorer les différentes éditions d'un dévoilement thématique au travers d'une carte à gratter interactive.

## Démarrer le projet

1. Installer les dépendances :
   ```bash
   npm install
   ```
2. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```

## Structure des ressources

Chaque édition est décrite par un fichier `src/devoilements/<identifiant>/config.js`. Aucun fichier binaire n'est nécessaire : les
fonds et textures sont générés par le navigateur à partir de valeurs CSS.

### Champs essentiels

- `background` : valeur CSS (ex. `linear-gradient(...)`, couleur unie ou `url(...)`) appliquée à l'arrière-plan pleine page.
- `announcement` : contenu textuel dévoilé après le grattage.
- `scratchSettings` : paramètres de la carte à gratter.
  - `width` / `height` : dimensions du canevas.
  - `brushSize` : rayon du pinceau utilisé lors du grattage.
  - `finishPercent` : pourcentage de surface à gratter avant de considérer la carte comme dévoilée.
  - `coverColor` (optionnel) : couleur CSS utilisée pour couvrir la carte.
- `timeline` : étapes clés affichées sous la carte.
- `resources` : liens utiles présentés en pied de carte.

## Ajouter un nouveau dévoilement

1. Dupliquer un dossier existant dans `src/devoilements` et renommez-le (ex. `devoilement-2025`).
2. Mettre à jour le fichier `config.js` dupliqué :
   - `id` doit correspondre au nom du dossier (`devoilement-2025`).
   - Fournir une valeur `background` (dégradé, couleur ou image distante).
   - Ajuster les textes (`title`, `theme`, `subtitle`, `announcement`, `timeline`, `resources`).
   - Adapter `scratchSettings` selon les besoins (dimensions, pinceau, `coverColor`).
3. Importer la nouvelle configuration dans `src/devoilements/index.js` et l'ajouter au tableau `devoilements` pour qu'elle apparaisse dans l'application.

> Astuce : privilégiez des dégradés CSS ou des images hébergées en ligne pour conserver un dépôt léger sans assets binaires.

## Personnalisation supplémentaire

- Les styles globaux se trouvent dans `src/index.css`.
- Les composants réutilisables (carte, surface de grattage) se situent dans `src/components/`.
- Pour changer l'ordre d'affichage, modifiez l'ordre des éléments dans le tableau exporté par `src/devoilements/index.js`.

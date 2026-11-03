# La Sainte Trinité Honoré — site et gestion des inscriptions

Site de l'école (Cotonou) avec pré-inscription en ligne et espace d'administration.

- **Site public** : accueil, l'école, cycles, frais, résultats, équipe, galerie, pré-inscription, contact, mentions légales.
- **Administration** (`/admin`) : suivi des pré-inscriptions (statuts, notes, export Excel), modération des avis, messages de contact, modification de tout le contenu du site (textes, photos, tarifs, équipe…), changement d'identifiant et de mot de passe.

## Technique

- Next.js 16 (App Router, Cache Components), React 19, Tailwind CSS 4
- Base de données Neon Postgres via Drizzle ORM (`src/db/schema.ts`)
- Photos sur Vercel Blob, envoyées directement depuis le navigateur et réduites avant l'envoi
- Hébergement Vercel, région `fra1`

Le contenu modifiable est décrit dans `src/lib/content/sections.ts` (champs des formulaires de l'admin)
et `src/lib/content/defaults.ts` (contenu initial). Ajouter un champ : le déclarer dans les deux fichiers,
puis l'afficher dans la page publique concernée.

## Développement

```bash
npm install
vercel env pull .env.local   # variables : DATABASE_URL, BLOB_READ_WRITE_TOKEN, SESSION_SECRET
npm run dev
```

| Commande | Rôle |
| --- | --- |
| `npm run db:push` | Applique `src/db/schema.ts` à la base |
| `npm run admin:reset [identifiant]` | Crée ou réinitialise le compte admin et affiche un nouveau mot de passe |
| `npm test` | Tests unitaires |
| `npm run build` | Build de production |

Chaque `git push` déclenche un déploiement Vercel : prévisualisation pour les branches, production pour `main`.

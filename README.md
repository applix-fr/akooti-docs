# akooti-docs

Documentation officielle d'**[Akooti](https://github.com/STIFLEUR390/akooti)** — le coffre-fort local-first, zero-knowledge pensé pour les agents IA.

> Site déployé : **https://akooti-docs.vercel.app**

Construit avec Next.js 16, Fumadocs et Tailwind CSS v4. Chaque page existe en MDX dans `content/docs/`, la page d'accueil est un composant React avec une démo interactive du remplissage aveugle.

---

## Démarrage

```bash
bun install
cp .env.example .env.local   # puis ajuster si besoin
bun run dev                  # http://localhost:3000
```

Aucune clé n'est nécessaire pour lire le site : sans configuration IA, seul l'assistant « Ask AI » est inopérant.

## Variables d'environnement

| Variable                | Requis | Rôle                                                                 |
| ----------------------- | ------ | -------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`  | non    | URL canonique (`metadataBase`, Open Graph). Défaut : `https://akooti-docs.vercel.app` |
| `LLM_GATEWAY_API_BASE`  | non    | Endpoint compatible OpenAI pour l'assistant. Défaut : `https://api.llmgateway.io/v1` |
| `LLM_GATEWAY_API_KEY`   | non    | Clé envoyée en `Authorization: Bearer`. `dummy` suffit en local       |
| `LLM_GATEWAY_MODEL`     | non    | Modèle interrogé. Défaut : `anthropic/claude-3.5-sonnet`              |

### Brancher un LLM personnel

L'assistant parle à **n'importe quel serveur compatible OpenAI** : il n'envoie qu'un `POST {base}/chat/completions` avec `{ model, messages }` et l'en-tête `Authorization: Bearer <clé>`. Il suffit donc de pointer `LLM_GATEWAY_API_BASE` (suffixe `/v1` compris) vers votre serveur :

```dotenv
# Ollama
LLM_GATEWAY_API_BASE=http://localhost:11434/v1
LLM_GATEWAY_API_KEY=dummy
LLM_GATEWAY_MODEL=qwen2.5-coder:7b

# LM Studio
LLM_GATEWAY_API_BASE=http://localhost:1234/v1
LLM_GATEWAY_MODEL=llama-3.2-1b

# vLLM / llama.cpp / LiteLLM, ou une passerelle locale multi-fournisseurs
LLM_GATEWAY_API_BASE=http://localhost:10100/v1
LLM_GATEWAY_MODEL=opencode-go/deepseek-v4.1-flash
```

Le modèle doit savoir appeler des outils : l'assistant s'appuie sur un outil `search` (FlexSearch sur le contenu des docs) et boucle jusqu'à cinq étapes avant de répondre.

## Scripts

| Commande             | Effet                                    |
| -------------------- | ---------------------------------------- |
| `bun run dev`        | Serveur de développement                 |
| `bun run build`      | Build de production (SSG + OG images)    |
| `bun run start`      | Serveur de production                    |
| `bun run types:check`| `next typegen` puis `tsc --noEmit`       |
| `bun run lint`       | Biome (lint + format check)              |
| `bun run format`     | Biome, réécriture                        |

## Structure

```
app/
  (home)/            page d'accueil, /donate, layout marketing + footer
  docs/              layout Fumadocs (sidebar, sommaire, « Ask AI »)
  api/chat/          endpoint de l'assistant (streamText + outil search)
  global.css         tailwind, preset Fumadocs, tokens de thème --ak-*
components/          InteractiveDemo, SupportTiers, SiteFooter, UI docs
content/docs/        pages MDX + meta.json (ordre de navigation)
lib/                 source Fumadocs, layout partagé, liens et paliers de don
public/              logo, favicon, image Open Graph
```

## Contenu

| Page                          | Sujet                                                        |
| ----------------------------- | ------------------------------------------------------------ |
| `index.mdx`                   | Présentation, philosophie Local-First / Zero-Knowledge / Zero-Leak, architecture |
| `installation.mdx`            | Application desktop (Linux, Windows, macOS) et extension WXT   |
| `vault-and-routing.mdx`       | Dossiers système, multi-dossiers, routage local, TOTP, passkeys |
| `mcp-and-ai-agents.mdx`       | Serveur MCP, jetons cloisonnés, injection aveugle (CDP)        |
| `sync-and-backups.mdx`        | Supabase E2EE, S3 / MinIO, Google Drive, sauvegardes locales   |
| `importers-and-security.mdx`  | Importateurs (Buttercup, Bitwarden, Proton Pass, KeePassXC, 1Password), audit |

Ajouter une page : créer le `.mdx` dans `content/docs/`, puis l'inscrire dans `content/docs/meta.json` pour l'ordre de la sidebar.

## Thème

Deux jeux de tokens `--ak-*` dans `app/global.css` — `:root` (clair) et `.dark` (reprise de la palette de l'application desktop). Les utilitaires Tailwind (`bg-app`, `border-line`, `text-ink-muted`, `text-signal`…) pointent ces variables via `@theme inline`, donc le basculeur de thème agit sur le site **et** sur la documentation. Défaut : sombre.

## Déploiement

Vercel, sans configuration particulière : framework Next.js, build `bun run build`, URL de production `https://akooti-docs.vercel.app`. Renseigner `NEXT_PUBLIC_SITE_URL` et, si l'assistant doit fonctionner en production, les trois variables `LLM_GATEWAY_*`.

## Licence

MIT — comme [Akooti](https://github.com/STIFLEUR390/akooti).

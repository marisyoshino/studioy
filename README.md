# Studio Y — Cloudflare Worker

Pacote robusto para Git/Cloudflare: o site inteiro está em um único arquivo `site-bundle.tgz` na raiz. O `npm run build` recria automaticamente `dist/`, inclusive `projetos/` e todos os assets.

## Arquivos que precisam aparecer na raiz do repositório

- `package.json`
- `wrangler.jsonc`
- `build.mjs`
- `site-bundle.tgz`
- `README.md`

Não é necessário criar ou enviar manualmente a pasta `projetos/`.

## Cloudflare Builds

Build command: `npm run build`

Deploy command: `npx wrangler deploy`

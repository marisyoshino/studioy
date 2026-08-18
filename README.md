# Studio Y — Cases V2.1

Cloudflare Worker standalone. Todos os arquivos necessários ficam na raiz do repositório; não há dependência de `src/`, `site/` ou `projetos/` no Git.

## Cloudflare Builds

Build command:

    npm run build

Deploy command:

    npx wrangler deploy

## Estrutura esperada na raiz do GitHub

- index.js
- package.json
- wrangler.jsonc
- README.md
- .gitignore

O build apenas valida a sintaxe do Worker. As rotas e páginas de case são servidas diretamente por `index.js`.

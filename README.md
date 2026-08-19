# Studio Y — Cases V2.2

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

## Atualização de conteúdo

O `index.js` contém a versão publicada da home e do case Vellora. O arquivo
`site-bundle.tgz` preserva o site-fonte completo, já sem o case ALG. O script
`sync-content.mjs` sincroniza a home, o Vellora e seus assets no Worker quando
for necessário gerar uma nova versão localmente.

O build apenas valida a sintaxe do Worker. As rotas e páginas de case são servidas diretamente por `index.js`.

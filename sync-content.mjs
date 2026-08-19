import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const siteRoot = resolve(process.argv[2] || '../site-final');
const workerPath = resolve('index.js');
const start = '/* FINAL_STATIC_CONTENT_START */';
const end = '/* FINAL_STATIC_CONTENT_END */';

const [worker, home, vellora, gondola, missao, cronicas, caseCss, gondolaCss, caseHeroJs] = await Promise.all([
  readFile(workerPath, 'utf8'),
  readFile(resolve(siteRoot, 'index.html'), 'utf8'),
  readFile(resolve(siteRoot, 'projetos/vellora/index.html'), 'utf8'),
  readFile(resolve(siteRoot, 'projetos/gondola-pro/index.html'), 'utf8'),
  readFile(resolve(siteRoot, 'projetos/missao-cadete/index.html'), 'utf8'),
  readFile(resolve(siteRoot, 'projetos/cronicas-do-veu/index.html'), 'utf8'),
  readFile(resolve(siteRoot, 'assets/case.css'), 'utf8'),
  readFile(resolve(siteRoot, 'assets/gondola.css'), 'utf8'),
  readFile(resolve(siteRoot, 'assets/case-hero.js'), 'utf8')
]);

const from = worker.indexOf(start);
const to = worker.indexOf(end);
if (from < 0 || to < 0 || to <= from) throw new Error('Marcadores de conteúdo final não encontrados em index.js');

const generated = `${start}\nconst finalHome = ${JSON.stringify(home)};\nconst finalVellora = ${JSON.stringify(vellora)};\nconst finalGondola = ${JSON.stringify(gondola)};\nconst finalMissao = ${JSON.stringify(missao)};\nconst finalCronicas = ${JSON.stringify(cronicas)};\nconst finalCaseCss = ${JSON.stringify(caseCss)};\nconst finalGondolaCss = ${JSON.stringify(gondolaCss)};\nconst finalCaseHeroJs = ${JSON.stringify(caseHeroJs)};\n${end}`;
const output = worker.slice(0, from) + generated + worker.slice(to + end.length);
await writeFile(workerPath, output, 'utf8');
console.log('index.js sincronizado com home, Vellora e Gôndola Pro.');

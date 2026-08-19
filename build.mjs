import { readFile, rm, mkdir, writeFile, access } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { dirname, resolve, normalize, sep } from 'node:path';

const archivePath = resolve('site-bundle.tgz');
const output = resolve('dist');

function readString(buf, start, length) {
  return buf.subarray(start, start + length).toString('utf8').replace(/\0.*$/, '').trim();
}

function readOctal(buf, start, length) {
  const raw = readString(buf, start, length).replace(/\0/g, '').trim();
  return raw ? parseInt(raw, 8) : 0;
}

function safeOutputPath(name) {
  const cleaned = name.replace(/^\.\//, '').replace(/\\/g, '/');
  const normalized = normalize(cleaned);
  if (!normalized || normalized === '.') return output;
  if (normalized.startsWith('..' + sep) || normalized === '..' || normalized.startsWith(sep)) {
    throw new Error(`Caminho inválido no bundle: ${name}`);
  }
  const target = resolve(output, normalized);
  if (!target.startsWith(output + sep) && target !== output) {
    throw new Error(`Caminho fora de dist/: ${name}`);
  }
  return target;
}

async function extractTarGz(buffer) {
  const tar = gunzipSync(buffer);
  let offset = 0;
  let files = 0;

  while (offset + 512 <= tar.length) {
    const header = tar.subarray(offset, offset + 512);
    const empty = header.every((b) => b === 0);
    if (empty) break;

    const name = readString(header, 0, 100);
    const prefix = readString(header, 345, 155);
    const fullName = prefix ? `${prefix}/${name}` : name;
    const size = readOctal(header, 124, 12);
    const type = String.fromCharCode(header[156] || 48);
    offset += 512;

    const target = safeOutputPath(fullName);
    if (type === '5') {
      await mkdir(target, { recursive: true });
    } else if (type === '0' || type === '\0') {
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, tar.subarray(offset, offset + size));
      files++;
    }

    offset += Math.ceil(size / 512) * 512;
  }

  return files;
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

let bundle;
try {
  bundle = await readFile(archivePath);
} catch {
  throw new Error('Arquivo obrigatório ausente na raiz do repositório: site-bundle.tgz');
}

const count = await extractTarGz(bundle);

const required = [
  'index.html',
  'case.css',
  'projetos/missao-cadete/index.html',
  'projetos/cronicas-do-veu/index.html',
  'projetos/gondola-pro/index.html',
  'projetos/vellora/index.html'
];

for (const file of required) {
  try {
    await access(resolve(output, file));
  } catch {
    throw new Error(`Build incompleto: ${file} não foi extraído para dist/.`);
  }
}

console.log(`Studio Y build concluído: ${count} arquivos extraídos de site-bundle.tgz para dist/.`);

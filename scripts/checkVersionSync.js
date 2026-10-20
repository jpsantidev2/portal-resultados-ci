function main() {
9 const versionFile = readText('version.txt');
10 const packageVersion = JSON.parse(readText('package.json')).version;
11 const dataVersion = JSON.parse(readText('data/candidatos.json')).metadata.version;
12 const html = readText('public/index.html');
13 const htmlMatch = html.match(/data-release-version="([^"]+)"/);
14 const htmlVersion = htmlMatch ? htmlMatch[1] : null;
15
16 const versions = {
17 'version.txt': versionFile,
18 'package.json': packageVersion,
19 'data/candidatos.json': dataVersion,
20 'public/index.html': htmlVersion
21 };
22
23 console.log('VERSÕES ENCONTRADAS');
24 Object.entries(versions).forEach(([file, version]) => console.log(`- ${file}: ${version}`));
25
26 const unique = new Set(Object.values(versions));
27 if (unique.has(null) || unique.size !== 1) {
28 console.error('SINCRONIZAÇÃO DE VERSÃO REPROVADA');
29 console.error('Todos os artefatos devem declarar a mesma versão.');
30 process.exit(1);
31 }
32
33 if (!html.includes(`Versão publicada: ${versionFile}`)) {
34 console.error('SINCRONIZAÇÃO DE CONTEÚDO REPROVADA');
35 console.error('O texto visível da página não corresponde ao version.txt.');
36 process.exit(1);
37 }
38
39 console.log(`SINCRONIZAÇÃO APROVADA: ${versionFile}`);
40 }

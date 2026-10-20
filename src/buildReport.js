function main() {
10 const dataset = loadJson('data/candidatos.json');
11 const errors = validateDataset(dataset);
12 if (errors.length > 0) {
13 throw new Error(`build interrompido: ${errors.length} erro(s) de dados`);
14 }
15
16 const summary = summarize(dataset);
17 const approved = dataset.candidates
18 .filter((candidate) => candidate.status === 'APROVADO')
19 .map(({ registration, name, score }) => ({ registration, name, score }));
20
21 ensureDir('dist');
22 fs.copyFileSync('public/index.html', path.join('dist', 'index.html'));
23
24 const report = {
25 process: dataset.metadata.processo,
26 version: dataset.metadata.version,
27 generatedAt: new Date().toISOString(),
28 summary,
29 approved
30 };
31
32 fs.writeFileSync('dist/relatorio.json', `${JSON.stringify(report, null,
2)}\n`);
33 console.log(`RELATÓRIO GERADO: ${approved.length} aprovados de ${summary.total}
candidatos`);
34 }

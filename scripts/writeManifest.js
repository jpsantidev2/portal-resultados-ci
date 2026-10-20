5 function sha256(file) {
6 return
crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
7 }
8
9 function git(command, fallback = 'indisponivel') {
10 try {
11 return execSync(command, { encoding: 'utf8' }).trim();
12 } catch {
13 return fallback;
14 }
15 }
16
17 const manifest = {
18 application: 'portal-resultados-ci',
19 version: fs.readFileSync('version.txt', 'utf8').trim(),
20 commit: process.env.GIT_COMMIT || git('git rev-parse HEAD'),
21 branch: process.env.GIT_BRANCH || git('git branch --show-current'),
22 buildNumber: process.env.BUILD_NUMBER || 'local',
23 generatedAt: new Date().toISOString(),
24 artifacts: {
25 'index.html': sha256('dist/index.html'),
26 'relatorio.json': sha256('dist/relatorio.json')
27 }
28 };
29
30 fs.writeFileSync('dist/manifest.json', `${JSON.stringify(manifest, null,
2)}\n`);
31 console.log(`MANIFESTO GERADO PARA O COMMIT ${manifest.commit}`);

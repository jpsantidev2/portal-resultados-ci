test('aceita lote consistente', () => {
16 assert.deepEqual(validateDataset(validDataset()), []);
17 });
18
19 test('rejeita CPF duplicado', () => {
20 const dataset = validDataset();
21 dataset.candidates[1].cpf = dataset.candidates[0].cpf;
22 assert.match(validateDataset(dataset).join('\n'), /CPF duplicado/);
23 });
24
25 test('rejeita nota fora do intervalo', () => {
26 const dataset = validDataset();
27 dataset.candidates[0].score = 110;
28 assert.match(validateDataset(dataset).join('\n'), /nota fora do intervalo/);
29 });
30
31 test('rejeita status incompatível com a nota', () => {
32 const dataset = validDataset();
33 dataset.candidates[0].status = 'LISTA_ESPERA';
34 assert.match(validateDataset(dataset).join('\n'), /status .* incompatível/);
35 });
36
37 test('resume aprovados e lista de espera', () => {
38 assert.deepEqual(summarize(validDataset()), { total: 2, approved: 1, waiting: 1
});
39 });

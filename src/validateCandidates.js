const fs = require('node:fs');

function validateCandidate(candidate, index, minimumScore) {
  const errors = [];
  const required = ['registration', 'cpf', 'name', 'score', 'status'];

  for (const field of required) {
    if (candidate[field] === undefined || candidate[field] === null || candidate[field] === '') {
      errors.push(`registro ${index + 1}: campo obrigatório ausente: ${field}`);
    }
  }

  if (!/^\d{11}\$/.test(String(candidate.cpf ?? ''))) {
    errors.push(`registro ${index + 1}: CPF deve conter exatamente 11 dígitos`);
  }

  if (!Number.isFinite(candidate.score) || candidate.score < 0 || candidate.score > 100) {
    errors.push(`registro ${index + 1}: nota fora do intervalo (0..100)`);
  }

  const expectedStatus = candidate.score >= minimumScore ? 'APROVADO' : 'LISTA_ESPERA';
  if (candidate.status !== expectedStatus) {
    errors.push(`registro ${index + 1}: status incompatível com a nota`);
  }

  return errors;
}

function validateDataset(dataset) {
  const errors = [];

  if (!dataset.metadata || typeof dataset.metadata !== 'object') {
    errors.push('metadata ausente');
    return errors;
  }

  if (!Array.isArray(dataset.candidates) || dataset.candidates.length === 0) {
    errors.push('lista candidates ausente ou vazia');
    return errors;
  }

  const minimumScore = Number(dataset.metadata.minimumScore);
  if (!Number.isFinite(minimumScore) || minimumScore < 0 || minimumScore > 100) {
    errors.push('metadata.minimumScore inválido');
    return errors;
  }

  const cpfs = new Set();
  const registrations = new Set();

  dataset.candidates.forEach((candidate, index) => {
    errors.push(...validateCandidate(candidate, index, minimumScore));

    if (cpfs.has(candidate.cpf)) {
      errors.push(`registro ${index + 1}: CPF duplicado: ${candidate.cpf}`);
    }
    cpfs.add(candidate.cpf);

    if (registrations.has(candidate.registration)) {
      errors.push(`registro ${index + 1}: inscrição duplicada: ${candidate.registration}`);
    }
    registrations.add(candidate.registration);
  });

  return errors;
}

if (require.main === module) {
  const filePath = process.argv[2] || 'data/candidatos.json';
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const dataset = JSON.parse(raw);
    const errors = validateDataset(dataset);

    if (errors.length > 0) {
      console.error('VALIDAÇÃO REPROVADA');
      errors.forEach(err => console.error(err));
      process.exit(1);
    }
    console.log('VALIDAÇÃO APROVADA');
  } catch (err) {
    console.error('Erro ao ler ou processar o arquivo:', err.message);
    process.exit(1);
  }
}

module.exports = { validateDataset, validateCandidate };

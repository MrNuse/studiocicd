# Progetto di Testing con Vitest + CI/CD

## 🎯 Caratteristiche

- ✅ **Test automatici** con Vitest
- 📊 **Coverage al 80%** con threshold obbligatorio
- 🎨 **Linting** con ESLint + Prettier
- 🚀 **CI/CD** con GitHub Actions
- 📝 **Documentazione** completa

## 🛠️ Comandi Disponibili

### Test
```bash
npm test              # Esegue i test in watch mode
npm run test:coverage # Esegue i test con coverage
npm run test:ui       # Apre l'interfaccia grafica
```

### Linting e Formatting
```bash
npm run lint          # Corregge automaticamente gli errori
npm run lint:check    # Solo controlla (usato in CI)
npm run format        # Formatta tutto il codice
npm run format:check  # Solo controlla formato (usato in CI)
```

## 📋 Workflow di Sviluppo

1. **Scrivi il codice**
2. **Esegui i test**: `npm run test:coverage`
3. **Formatta il codice**: `npm run format`
4. **Controlla il lint**: `npm run lint`
5. **Committa**: `git add . && git commit -m "..."`
6. **Pusha**: `git push`

## 🔧 CI/CD Pipeline

Ogni push esegue automaticamente:
1. **Format Check** - Verifica che il codice sia formattato
2. **Lint Check** - Verifica che non ci siano errori di lint
3. **Tests** - Esegue tutti i test
4. **Coverage** - Verifica che il coverage sia ≥ 80%

Se uno di questi step fallisce, il push viene bloccato.

## 📁 Struttura del Progetto

```
src/
├── andrea/
│   ├── 1.js + 1.test.js    # Test base
│   ├── 2.js + 2.test.js    # Test con mocking
│   ├── 3.js + 3.test.js    # Test async con fake timers
│   └── 4.js + 4.test.js    # Test avanzati con classi
├── index.js
.github/
└── workflows/
    └── test.yml            # GitHub Actions CI/CD
```

## 📖 Documentazione

- [COVERAGE_TUTORIAL.md](./COVERAGE_TUTORIAL.md) - Come funziona il coverage
- [LINTING_TUTORIAL.md](./LINTING_TUTORIAL.md) - Come funziona il linting
- [GITHUB_ACTIONS_TUTORIAL.md](./GITHUB_ACTIONS_TUTORIAL.md) - Come funziona la CI

## 🎓 Concetti Appresi

### Testing
- Mock functions (`vi.fn()`)
- Fake timers (`vi.useFakeTimers()`)
- Async testing
- Snapshot testing
- Parameterized tests (`describe.each`, `it.each`)
- Test hooks (`beforeEach`, `afterEach`)

### Coverage
- Threshold enforcement
- Report generation (HTML, JSON, text)
- Exclusion patterns
- CI integration

### Linting
- ESLint rules
- Prettier formatting
- CI checks
- Pre-commit validation

### CI/CD
- GitHub Actions
- Automated testing
- Quality gates
- Artifact storage

## 🚨 Risoluzione Problemi

### Coverage Sotto 80%
```bash
# Vedi quali file hanno basso coverage
npm run test:coverage

# Apri il report HTML
open coverage/index.html
```

### Errori di Lint
```bash
# Mostra tutti gli errori
npm run lint:check

# Correggi automaticamente
npm run lint
```

### CI Fallisce
1. Controlla i log in GitHub Actions
2. Esegui localmente: `npm run format && npm run lint && npm run test:coverage`
3. Correggi gli errori e re-pusha

## 🎯 Prossimi Passi

- [ ] Aggiungere TypeScript
- [ ] Integrare con database
- [ ] Deploy automatico
- [ ] Notifiche Slack/Email
- [ ] Performance testing
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

### Build e Deploy
```bash
npm run build         # Crea build ottimizzata in dist/
npm run deploy        # Deploy manuale via SFTP (richiede env vars)
```

## 📋 Workflow di Sviluppo

1. **Scrivi il codice**
2. **Esegui i test**: `npm run test:coverage`
3. **Formatta il codice**: `npm run format`
4. **Controlla il lint**: `npm run lint`
5. **Committa**: `git add . && git commit -m "..."`
6. **Pusha**: `git push`

## 🔧 CI/CD Pipeline

### Test Workflow (Ogni Push)
1. **Format Check** - Verifica che il codice sia formattato
2. **Lint Check** - Verifica che non ci siano errori di lint
3. **Tests** - Esegue tutti i test
4. **Coverage** - Verifica che il coverage sia ≥ 80%

### Deploy Workflow (Solo Push su Main)
1. **Esegue Test Workflow** - Deve passare per procedere
2. **Build** - Crea build ottimizzata con `./scripts/build.sh`
3. **Deploy SFTP** - Carica build sul server via `./scripts/deploy.sh`
4. **Backup** - Crea backup del deployment precedente
5. **Verifica** - Controlla che il deploy sia avvenuto correttamente

Se uno di questi step fallisce, il deploy viene bloccato.

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
- [DEPLOY_TUTORIAL.md](./DEPLOY_TUTORIAL.md) - Come configurare e usare il deploy SFTP

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

### Deploy
- Shell scripting per automazione
- SFTP deployment
- GitHub Secrets management
- Backup automatico
- Retry logic e error handling

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

- [x] ✅ Deploy automatico SFTP
- [ ] Aggiungere TypeScript
- [ ] Integrare con database  
- [ ] Notifiche Slack/Email per deploy
- [ ] Performance testing
- [ ] Deploy con chiavi SSH (più sicuro)
- [ ] Multi-environment deploy (staging/production)
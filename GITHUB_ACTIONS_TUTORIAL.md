# GitHub Actions per Test e Coverage - Tutorial

## Cos'è GitHub Actions?

GitHub Actions è un sistema di CI/CD (Continuous Integration/Continuous Deployment) integrato in GitHub che automatizza i tuoi workflow. Nel nostro caso, eseguirà automaticamente i test ogni volta che fai push.

## Come Funziona il Nostro Workflow

### 1. **Trigger (Quando si attiva)**
```yaml
on:
  push:
    branches: [ main, develop, feature/** ]
  pull_request:
    branches: [ main, develop ]
```
- Si attiva quando fai **push** su: main, develop, o qualsiasi branch feature/*
- Si attiva quando apri una **pull request** verso main o develop

### 2. **Jobs (Cosa fa)**

Il workflow esegue questi passaggi:

1. **Checkout**: Scarica il tuo codice
2. **Setup Node.js**: Installa Node.js v20
3. **Install Dependencies**: Esegue `npm ci` (più veloce di `npm install`)
4. **Run Tests**: Esegue `npm run test:coverage`
5. **Upload Coverage**: Salva il report di coverage come artifact
6. **Comment PR**: (Solo per PR) Commenta con i risultati del coverage

### 3. **Struttura del File**

```
.github/
└── workflows/
    └── test.yml
```

## Come Verificare che Funzioni

### 1. Dopo il Push
- Vai su GitHub → Actions tab
- Vedrai il workflow in esecuzione
- Click per vedere i dettagli

### 2. Stati Possibili
- ✅ **Verde**: Tutti i test passano e coverage sopra 80%
- ❌ **Rosso**: Test falliti o coverage sotto 80%
- 🟡 **Giallo**: In esecuzione

### 3. Badge di Stato
Puoi aggiungere un badge al README:
```markdown
![Tests](https://github.com/TUO_USERNAME/TUO_REPO/actions/workflows/test.yml/badge.svg)
```

## Cosa Succede se Fallisce?

### Coverage sotto 80%
```
Error: Coverage for lines (75%) does not meet threshold (80%)
```
**Soluzione**: Aggiungi più test per aumentare il coverage

### Test che falliscono
```
FAIL src/andrea/4.test.js > divide(4, 2) should return 2
```
**Soluzione**: Controlla e correggi il test o il codice

## Vantaggi della CI

1. **Qualità del Codice**: Garantisce che ogni push abbia test che passano
2. **Coverage Minimo**: Impedisce di pushare codice non testato
3. **Feedback Immediato**: Scopri subito se hai rotto qualcosa
4. **Collaborazione**: I tuoi colleghi vedono subito lo stato del codice

## Artifacts (Report Salvati)

Dopo ogni run, puoi scaricare:
- Report HTML del coverage
- Risultati dei test in JSON

Per scaricarli:
1. Vai nella tab Actions
2. Click sul workflow run
3. Scorri fino a "Artifacts"
4. Download "coverage-report"

## Best Practices

1. **Non pushare direttamente su main**: Usa feature branch
2. **Aspetta che i test passino**: Prima di fare merge
3. **Monitora il coverage trend**: Non farlo scendere
4. **Fix immediato**: Se rompi la build, correggila subito

## Comandi Utili Locali

Prima di pushare, verifica localmente:
```bash
# Esegui test con coverage
npm run test:coverage

# Se fallisce, controlla quali file hanno basso coverage
# Apri coverage/index.html nel browser
```

## Prossimi Passi (Opzionali)

Potresti aggiungere:
1. **Linting**: Controllo stile del codice
2. **Type checking**: Se usi TypeScript
3. **Deploy automatico**: Se i test passano
4. **Notifiche**: Email/Slack quando fallisce
# Linting e Formatting con ESLint e Prettier - Tutorial

## Cos'è il Linting?

Il **linting** è il processo di analisi del codice per individuare errori di sintassi, stile e potenziali problemi. **Prettier** formatta automaticamente il codice per mantenerlo consistente.

## Strumenti Configurati

### 1. **ESLint** - Analizza il codice per errori e stile
### 2. **Prettier** - Formatta automaticamente il codice

## Come Funziona

### Script NPM Disponibili

```bash
# Controlla e corregge automaticamente gli errori di lint
npm run lint

# Solo controlla (senza correggere) - usato in CI
npm run lint:check

# Formatta automaticamente tutto il codice
npm run format

# Solo controlla il formato (senza correggere) - usato in CI
npm run format:check
```

## Configurazioni

### ESLint (`eslint.config.js`)
```javascript
rules: {
  'prettier/prettier': 'error',      // Prettier come errore ESLint
  'no-unused-vars': 'error',         // Variabili non usate = errore
  'no-console': 'warn',              // console.log = warning
  'prefer-const': 'error',           // Usa const invece di let
  'no-var': 'error',                 // Non usare var
  'arrow-body-style': 'error',       // Arrow function più concise
}
```

### Prettier (`.prettierrc.json`)
```json
{
  "semi": false,           // Niente punto e virgola
  "singleQuote": true,     // Apici singoli
  "tabWidth": 2,           // Indentazione a 2 spazi
  "printWidth": 100,       // Massimo 100 caratteri per linea
  "trailingComma": "es5"   // Virgola finale dove possibile
}
```

## Integrazione con GitHub Actions

La CI ora esegue questi controlli **prima** dei test:

1. **Format Check**: Verifica che il codice sia formattato correttamente
2. **Lint Check**: Verifica che non ci siano errori di lint
3. **Tests**: Esegue i test solo se i controlli precedenti passano

### Perché Fallisce se Ci Sono Modifiche?

```bash
npm run format:check  # Fallisce se Prettier dovrebbe modificare file
npm run lint:check    # Fallisce se ESLint trova errori
```

**Questo significa che devi eseguire il linting in locale prima di pushare!**

## Workflow di Sviluppo

### 1. **Prima di Committare**
```bash
# Formatta tutto il codice
npm run format

# Controlla e corregge gli errori di lint
npm run lint

# Esegui i test
npm run test:coverage
```

### 2. **Se la CI Fallisce**

**Errore di Format:**
```
Code style issues found in the above file(s).
```
**Soluzione:**
```bash
npm run format
git add .
git commit -m "Fix formatting"
```

**Errore di Lint:**
```
/src/file.js: error: 'unused' is assigned a value but never used
```
**Soluzione:**
```bash
npm run lint  # Corregge automaticamente quello che può
# Correggi manualmente gli errori che non può correggere
```

## Esempi di Errori Comuni

### 1. **Variabili Non Usate**
```javascript
// ❌ Errore
function test() {
  const unused = 'hello'  // Non usato
  return true
}

// ✅ Corretto
function test() {
  return true
}
```

### 2. **Formatting Inconsistente**
```javascript
// ❌ Prima del formatting
const obj={name:"John",age:30};

// ✅ Dopo Prettier
const obj = { name: 'John', age: 30 }
```

### 3. **Uso di var invece di const/let**
```javascript
// ❌ Errore
var name = 'John'

// ✅ Corretto
const name = 'John'
```

## Configurazione Editor

### VS Code
Installa queste estensioni:
- **ESLint**: Mostra errori in tempo reale
- **Prettier**: Formatta automaticamente al salvataggio

### Configurazione VS Code (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Best Practices

### 1. **Commit Separati**
```bash
# Prima: Fix formatting/linting
git commit -m "Fix linting issues"

# Dopo: Actual changes
git commit -m "Add new feature"
```

### 2. **Pre-commit Hook (Opzionale)**
Puoi configurare un hook che esegue automaticamente il linting prima di ogni commit.

### 3. **Ignorare File**
- **ESLint**: Configurato per ignorare `node_modules`, `coverage`, `dist`
- **Prettier**: File `.prettierignore` per ignorare file specifici

## Troubleshooting

### Errore: "Module not found"
```bash
# Reinstalla le dipendenze
npm install
```

### Errore: "Configuration file not found"
Assicurati che `eslint.config.js` sia nella root del progetto.

### Formatting Conflicts
Se ESLint e Prettier entrano in conflitto, la configurazione `eslint-config-prettier` li risolve automaticamente.

## Risultato

Con questa configurazione:
- ✅ Codice sempre formattato in modo consistente
- ✅ Errori di lint catturati prima del merge
- ✅ Quality gate nella CI
- ✅ Team ha stile di codice uniforme
# Deploy Automatico con SFTP - Tutorial

## 🚀 Panoramica

Questo sistema di deploy automatico carica la build del progetto su un server remoto via SFTP ogni volta che fai push sul branch `main`, ma **solo se tutti i test passano**.

## 📋 Configurazione GitHub Secrets

### 1. Vai su GitHub Repository Settings
1. Clicca su **Settings** nel tuo repository
2. Clicca su **Secrets and variables** → **Actions**
3. Clicca su **New repository secret**

### 2. Aggiungi queste Secrets

| Secret Name | Descrizione | Esempio |
|-------------|-------------|---------|
| `SFTP_HOST` | Indirizzo del server SFTP | `example.com` o `192.168.1.100` |
| `SFTP_USERNAME` | Username per l'accesso SFTP | `myuser` |
| `SFTP_PASSWORD` | Password per l'accesso SFTP | `mypassword123` |
| `SFTP_PORT` | Porta SFTP (opzionale) | `22` (default) |
| `SFTP_PATH` | Percorso di destinazione sul server | `/var/www/html/myproject` |

### 3. Configurazione Esempio

```
SFTP_HOST: myserver.com
SFTP_USERNAME: webuser
SFTP_PASSWORD: SecurePass123!
SFTP_PORT: 22
SFTP_PATH: /var/www/html/frontend
```

## 🔧 Come Funziona

### 1. **Trigger del Deploy**
- Si attiva automaticamente su push a `main`
- Può essere eseguito manualmente da GitHub Actions
- **Prerequisito**: Tutti i test devono passare

### 2. **Pipeline di Deploy**
```
Test & Lint → Build → Deploy → Verifica
```

1. **Test**: Esegue format check, lint check, test coverage
2. **Build**: Esegue `./scripts/build.sh`
   - Crea directory `dist/`
   - Copia file sorgente (esclude i test)
   - Crea archivio tar.gz
3. **Deploy**: Esegue `./scripts/deploy.sh`
   - Backup del deployment precedente (opzionale)
   - Carica file via SFTP
   - Verifica il deployment

### 3. **Cosa Viene Deployato**
- Tutti i file da `src/` (esclusi i test)
- `package.json`
- `README.md`
- `build-info.json` (con timestamp, commit, branch)

## 🛠️ Test del Deploy in Locale

### 1. Testa il Build
```bash
# Esegui il build
./scripts/build.sh

# Verifica i file generati
ls -la dist/
```

### 2. Testa il Deploy (con variabili d'ambiente)
```bash
# Imposta le variabili d'ambiente
export SFTP_HOST="myserver.com"
export SFTP_USERNAME="myuser"
export SFTP_PASSWORD="mypassword"
export SFTP_PATH="/var/www/html/test"

# Esegui il deploy
./scripts/deploy.sh
```

### 3. Test di Connessione SFTP
```bash
# Test manuale della connessione
sftp -P 22 username@hostname

# Test con sshpass
sshpass -p "password" sftp -P 22 username@hostname
```

## 🔍 Monitoraggio e Debug

### 1. **Controlla i Log GitHub Actions**
1. Vai su **Actions** tab nel repository
2. Clicca sul workflow run "Deploy to Server"
3. Espandi i step per vedere i log dettagliati

### 2. **Errori Comuni**

#### ❌ "sshpass: command not found"
```
Soluzione: Il workflow installa automaticamente sshpass
```

#### ❌ "Permission denied (publickey,password)"
```
Soluzione: Controlla SFTP_USERNAME e SFTP_PASSWORD
```

#### ❌ "No such file or directory"
```
Soluzione: Verifica che SFTP_PATH esista sul server
```

#### ❌ "Build directory not found"
```
Soluzione: Controlla che ./scripts/build.sh sia eseguito correttamente
```

### 3. **Verifica del Deploy**
```bash
# Connettiti al server e verifica
ssh username@hostname
cd /var/www/html/myproject
ls -la
cat build-info.json
```

## 📊 Funzionalità Avanzate

### 1. **Backup Automatico**
- Impostato su `BACKUP_ENABLED: 'true'`
- Crea backup del deployment precedente
- Salva in directory `backups/backup_TIMESTAMP/`

### 2. **Retry Automatico**
- Ritenta il deploy fino a 3 volte in caso di errore
- Attende 5 secondi tra i tentativi

### 3. **Artifacts di Build**
- Salva la build come artifact in GitHub Actions
- Disponibile per download per 7 giorni

## 🎯 Best Practices

### 1. **Sicurezza**
- Usa sempre password complesse
- Considera l'uso di chiavi SSH invece di password
- Limita i permessi dell'utente SFTP

### 2. **Testing**
- Testa sempre il deploy in ambiente di staging
- Usa branch separati per test (`develop` → staging, `main` → production)

### 3. **Monitoring**
- Controlla regolarmente i log di deploy
- Imposta notifiche per deploy falliti

### 4. **Rollback**
- Mantieni backup dei deployment precedenti
- Documenta la procedura di rollback

## 🔧 Personalizzazione

### 1. **Modifica il Build**
Edita `scripts/build.sh` per:
- Aggiungere minificazione
- Includere file aggiuntivi
- Cambiare la struttura di build

### 2. **Modifica il Deploy**
Edita `scripts/deploy.sh` per:
- Aggiungere post-deploy scripts
- Cambiare la strategia di backup
- Aggiungere verifiche personalizzate

### 3. **Workflow Personalizzati**
Edita `.github/workflows/deploy.yml` per:
- Cambiare i trigger
- Aggiungere notifiche
- Integrare con altri servizi

## 🚨 Troubleshooting

### Deploy Fallisce
1. Controlla le secrets su GitHub
2. Verifica la connessione SFTP manualmente
3. Controlla i permessi sul server
4. Verifica che `scripts/build.sh` funzioni localmente

### Build Fallisce
1. Esegui `npm run test:coverage` localmente
2. Controlla che tutti i test passino
3. Verifica che il formato e lint siano corretti

### Server Non Raggiungibile
1. Controlla che il server sia online
2. Verifica firewall e porte
3. Testa la connessione SSH/SFTP manualmente

## 🎉 Risultato

Con questa configurazione:
- ✅ Deploy automatico ad ogni push su `main`
- ✅ Deploy solo se tutti i test passano
- ✅ Backup automatico dei deployment precedenti
- ✅ Log dettagliati per debug
- ✅ Artifacts di build scaricabili
- ✅ Retry automatico in caso di errori temporanei
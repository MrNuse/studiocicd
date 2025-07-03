#!/bin/bash

# Script di Deploy SFTP
# Carica la build sul server remoto via SFTP

set -e  # Exit on error

echo "🚀 Iniziando deploy SFTP..."

# Variabili d'ambiente richieste
REQUIRED_VARS=("SFTP_HOST" "SFTP_USERNAME" "SFTP_PASSWORD" "SFTP_PATH")

# Controlla che tutte le variabili necessarie siano impostate
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Errore: Variabile d'ambiente $var non impostata"
        echo "📋 Variabili richieste: ${REQUIRED_VARS[*]}"
        exit 1
    fi
done

# Variabili con valori di default
SFTP_PORT=${SFTP_PORT:-22}
BUILD_DIR=${BUILD_DIR:-"dist"}
MAX_RETRIES=${MAX_RETRIES:-3}
BACKUP_DIR=${BACKUP_DIR:-"backups"}

echo "📋 Configurazione deploy:"
echo "   🌐 Host: $SFTP_HOST"
echo "   👤 Username: $SFTP_USERNAME"
echo "   🔌 Porta: $SFTP_PORT"
echo "   📁 Percorso remoto: $SFTP_PATH"
echo "   📁 Directory build: $BUILD_DIR"

# Verifica che la directory di build esista
if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ Errore: Directory di build '$BUILD_DIR' non trovata"
    echo "💡 Esegui prima: npm run build"
    exit 1
fi

# Funzione per eseguire comandi SFTP con retry
sftp_with_retry() {
    local command="$1"
    local retry_count=0
    
    while [ $retry_count -lt $MAX_RETRIES ]; do
        echo "🔄 Tentativo $((retry_count + 1)) di $MAX_RETRIES..."
        
        if sshpass -p "$SFTP_PASSWORD" sftp -P "$SFTP_PORT" -o StrictHostKeyChecking=no "$SFTP_USERNAME@$SFTP_HOST" << EOF
$command
exit
EOF
        then
            echo "✅ Comando SFTP eseguito con successo"
            return 0
        else
            echo "❌ Comando SFTP fallito"
            retry_count=$((retry_count + 1))
            if [ $retry_count -lt $MAX_RETRIES ]; then
                echo "⏳ Attendendo 5 secondi prima del retry..."
                sleep 5
            fi
        fi
    done
    
    echo "❌ Errore: Comando SFTP fallito dopo $MAX_RETRIES tentativi"
    return 1
}

# Funzione per fare backup del deployment precedente
backup_previous_deployment() {
    echo "💾 Creando backup del deployment precedente..."
    
    local backup_timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_path="$BACKUP_DIR/backup_$backup_timestamp"
    
    sftp_with_retry "
mkdir -p $BACKUP_DIR
mkdir -p $backup_path
cd $SFTP_PATH
mget -r * ../$backup_path/ 2>/dev/null || true
"
    
    echo "✅ Backup creato in: $backup_path"
}

# Funzione per caricare i file
upload_files() {
    echo "📤 Caricando file sul server..."
    
    # Crea directory remota se non esistente
    sftp_with_retry "mkdir -p $SFTP_PATH"
    
    # Carica tutti i file dalla directory di build
    sshpass -p "$SFTP_PASSWORD" sftp -P "$SFTP_PORT" -o StrictHostKeyChecking=no "$SFTP_USERNAME@$SFTP_HOST" << EOF
cd $SFTP_PATH
lcd $BUILD_DIR
mput -r *
exit
EOF
    
    if [ $? -eq 0 ]; then
        echo "✅ File caricati con successo"
    else
        echo "❌ Errore durante il caricamento dei file"
        exit 1
    fi
}

# Funzione per verificare il deployment
verify_deployment() {
    echo "🔍 Verificando il deployment..."
    
    # Lista i file caricati
    sshpass -p "$SFTP_PASSWORD" sftp -P "$SFTP_PORT" -o StrictHostKeyChecking=no "$SFTP_USERNAME@$SFTP_HOST" << EOF
cd $SFTP_PATH
ls -la
exit
EOF
    
    if [ $? -eq 0 ]; then
        echo "✅ Deployment verificato con successo"
    else
        echo "❌ Errore durante la verifica del deployment"
        exit 1
    fi
}

# Controlla se sshpass è installato
if ! command -v sshpass &> /dev/null; then
    echo "❌ Errore: sshpass non installato"
    echo "💡 Installa con: sudo apt-get install sshpass (Ubuntu/Debian)"
    echo "💡 Installa con: brew install sshpass (macOS)"
    exit 1
fi

# Esegui il deployment
echo "🚀 Iniziando processo di deploy..."

# Step 1: Backup (opzionale, solo se BACKUP_ENABLED=true)
if [ "$BACKUP_ENABLED" = "true" ]; then
    backup_previous_deployment
fi

# Step 2: Caricamento file
upload_files

# Step 3: Verifica
verify_deployment

# Step 4: Cleanup locale (opzionale)
if [ "$CLEANUP_BUILD" = "true" ]; then
    echo "🧹 Pulendo file di build locali..."
    rm -rf "$BUILD_DIR"
    rm -f build-*.tar.gz
fi

echo "🎉 Deploy completato con successo!"
echo "🌐 I file sono stati caricati su: $SFTP_HOST:$SFTP_PATH"
#!/bin/bash

# Script di Build per Deploy
# Crea una build ottimizzata del progetto

set -e  # Exit on error

echo "🚀 Iniziando build del progetto..."

# Variabili
BUILD_DIR="dist"
SRC_DIR="src"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BUILD_INFO_FILE="build-info.json"

# Pulisci directory di build precedente
if [ -d "$BUILD_DIR" ]; then
    echo "📁 Pulendo directory di build precedente..."
    rm -rf "$BUILD_DIR"
fi

# Crea directory di build
echo "📁 Creando directory di build..."
mkdir -p "$BUILD_DIR"

# Copia i file sorgente
echo "📋 Copiando file sorgente..."
cp -r "$SRC_DIR"/* "$BUILD_DIR/"

# Copia file di configurazione necessari
echo "📋 Copiando file di configurazione..."
cp package.json "$BUILD_DIR/" 2>/dev/null || true
cp README.md "$BUILD_DIR/" 2>/dev/null || true

# Rimuovi i file di test dalla build
echo "🧹 Rimuovendo file di test..."
find "$BUILD_DIR" -name "*.test.js" -type f -delete
find "$BUILD_DIR" -name "*.spec.js" -type f -delete

# Crea file di info build
echo "📝 Creando file di info build..."
cat > "$BUILD_DIR/$BUILD_INFO_FILE" << EOF
{
  "timestamp": "$TIMESTAMP",
  "branch": "${GITHUB_REF##*/}",
  "commit": "${GITHUB_SHA:-$(git rev-parse HEAD 2>/dev/null || echo 'local')}",
  "version": "$(node -p "require('./package.json').version")",
  "environment": "${NODE_ENV:-production}"
}
EOF

# Crea archivio della build
echo "📦 Creando archivio della build..."
tar -czf "build-${TIMESTAMP}.tar.gz" -C "$BUILD_DIR" .

# Statistiche della build
echo "📊 Statistiche della build:"
echo "   📁 Directory: $BUILD_DIR"
echo "   📦 Archivio: build-${TIMESTAMP}.tar.gz"
echo "   📊 Dimensione archivio: $(du -h build-${TIMESTAMP}.tar.gz | cut -f1)"
echo "   📄 File nella build: $(find $BUILD_DIR -type f | wc -l)"

echo "✅ Build completata con successo!"
echo "📦 Archivio disponibile: build-${TIMESTAMP}.tar.gz"
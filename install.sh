#!/bin/bash

echo "🚀 Instalando Money STD - App de Controle Financeiro"
echo "=================================================="

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale o Node.js primeiro."
    echo "   Visite: https://nodejs.org/"
    exit 1
fi

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Por favor, instale o npm primeiro."
    exit 1
fi

echo "✅ Node.js e npm encontrados"

# Verificar se o Expo CLI está instalado
if ! command -v expo &> /dev/null; then
    echo "📦 Instalando Expo CLI..."
    npm install -g @expo/cli
else
    echo "✅ Expo CLI já está instalado"
fi

# Instalar dependências
echo "📦 Instalando dependências do projeto..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependências instaladas com sucesso!"
    echo ""
    echo "🎉 Instalação concluída!"
    echo ""
    echo "Para iniciar o projeto, execute:"
    echo "  npm start"
    echo ""
    echo "Ou:"
    echo "  expo start"
    echo ""
    echo "📱 Para testar no dispositivo:"
    echo "  1. Instale o app Expo Go no seu celular"
    echo "  2. Escaneie o QR code que aparecerá no terminal"
    echo ""
    echo "🖥️  Para testar no emulador:"
    echo "  - Android: npm run android"
    echo "  - iOS: npm run ios"
    echo "  - Web: npm run web"
else
    echo "❌ Erro ao instalar dependências"
    exit 1
fi 
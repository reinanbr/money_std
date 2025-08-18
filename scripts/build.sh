#!/bin/bash

# 🚀 Script de Build - Money STD
# Este script automatiza o processo de build para APK e AAB

echo "📱 Money STD - Script de Build"
echo "================================"

# Verificar se EAS CLI está instalado
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI não encontrado. Instalando..."
    npm install -g eas-cli
fi

# Verificar se está logado no Expo
if ! eas whoami &> /dev/null; then
    echo "❌ Não está logado no Expo. Faça login primeiro:"
    echo "   eas login"
    exit 1
fi

# Função para build de desenvolvimento
build_development() {
    echo "🔧 Gerando build de desenvolvimento (APK)..."
    eas build --platform android --profile development
}

# Função para build de preview
build_preview() {
    echo "📦 Gerando build de preview (APK)..."
    eas build --platform android --profile preview
}

# Função para build de produção
build_production() {
    echo "🚀 Gerando build de produção (AAB)..."
    eas build --platform android --profile production
}

# Função para build local
build_local() {
    echo "⚡ Gerando build local (APK)..."
    eas build --platform android --local
}

# Função para submit
submit_production() {
    echo "📤 Enviando para Play Store..."
    eas submit --platform android
}

# Função para build e submit automático
build_and_submit() {
    echo "🚀 Build e submit automático..."
    eas build --platform android --profile production --auto-submit
}

# Menu principal
echo ""
echo "Escolha uma opção:"
echo "1) Build de desenvolvimento (APK)"
echo "2) Build de preview (APK)"
echo "3) Build de produção (AAB)"
echo "4) Build local (APK)"
echo "5) Submit para Play Store"
echo "6) Build e submit automático"
echo "7) Ver builds"
echo "8) Sair"
echo ""

read -p "Digite sua opção (1-8): " choice

case $choice in
    1)
        build_development
        ;;
    2)
        build_preview
        ;;
    3)
        build_production
        ;;
    4)
        build_local
        ;;
    5)
        submit_production
        ;;
    6)
        build_and_submit
        ;;
    7)
        echo "📊 Listando builds..."
        eas build:list
        ;;
    8)
        echo "👋 Até logo!"
        exit 0
        ;;
    *)
        echo "❌ Opção inválida!"
        exit 1
        ;;
esac

echo ""
echo "✅ Processo concluído!" 
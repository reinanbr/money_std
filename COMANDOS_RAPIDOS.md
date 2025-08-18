# ⚡ Comandos Rápidos - Money STD

## 🚀 **Setup Inicial (Uma vez)**

```bash
# 1. Instalar EAS CLI
npm install -g eas-cli

# 2. Fazer login no Expo
eas login

# 3. Configurar EAS Build
eas build:configure

# 4. Primeiro build (pode falhar na primeira vez)
eas build --platform android --profile development
```

## 📦 **Builds Principais**

### **APK para Testes**
```bash
# Build de desenvolvimento
eas build --platform android --profile development

# Build de preview
eas build --platform android --profile preview

# Build local (mais rápido)
eas build --platform android --local
```

### **AAB para Play Store**
```bash
# Build de produção
eas build --platform android --profile production

# Build e submit automático
eas build --platform android --profile production --auto-submit
```

## 🎯 **Usando o Script Automatizado**

```bash
# Executar script interativo
./scripts/build.sh

# Ou usar diretamente
bash scripts/build.sh
```

## 📊 **Monitoramento**

```bash
# Listar builds
eas build:list

# Ver detalhes de um build
eas build:view [BUILD_ID]

# Ver logs em tempo real
eas build:logs [BUILD_ID]
```

## 🔐 **Gerenciamento de Credenciais**

```bash
# Configurar credenciais
eas credentials

# Resetar credenciais
eas credentials --platform android --clear

# Ver credenciais
eas credentials --platform android
```

## 📤 **Submit para Play Store**

```bash
# Submit manual
eas submit --platform android

# Submit com build automático
eas build --platform android --profile production --auto-submit
```

## 🔧 **Solução de Problemas**

```bash
# Limpar cache
npx expo start --clear

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install

# Verificar configuração
eas build:configure
```

## 📱 **Atualização de Versão**

```bash
# 1. Editar app.json
# Incrementar versionCode e version

# 2. Gerar novo build
eas build --platform android --profile production

# 3. Submit para Play Store
eas submit --platform android
```

## 🎯 **Fluxo Completo de Publicação**

```bash
# 1. Setup inicial (uma vez)
npm install -g @expo/eas-cli
eas login
eas build:configure

# 2. Testar build de desenvolvimento
eas build --platform android --profile development

# 3. Gerar build de produção
eas build --platform android --profile production

# 4. Submit para Play Store
eas submit --platform android

# 5. Monitorar status
eas build:list
```

## ⚠️ **Importante**

- ✅ Sempre teste o build de desenvolvimento antes da produção
- ✅ Verifique se todos os assets estão presentes
- ✅ Mantenha o `versionCode` sempre incrementado
- ✅ Use o script automatizado para facilitar o processo

## 🎉 **Sucesso!**

Após seguir estes comandos, seu app estará publicado na Google Play Store! 🚀 
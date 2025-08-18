# 📱 Manual de Publicação - Money STD

## 🎯 **Visão Geral**

Este manual contém instruções completas para gerar APK e AAB (Android App Bundle) do Money STD para publicação na Google Play Store.

## 📋 **Pré-requisitos**

### 1. **Conta Google Play Console**
- ✅ Conta Google Play Console ativa
- ✅ Pagamento de taxa de desenvolvedor ($25 USD)
- ✅ Acesso ao painel de desenvolvedor

### 2. **Ferramentas Necessárias**
- ✅ Node.js (versão 18 ou superior)
- ✅ Expo CLI (`npm install -g @expo/cli`)
- ✅ EAS CLI (`npm install -g @expo/eas-cli`)
- ✅ Conta Expo (gratuita)

### 3. **Assets Obrigatórios**
- ✅ Ícone do app (1024x1024 PNG)
- ✅ Screenshots do app (pelo menos 2)
- ✅ Descrição do app
- ✅ Política de privacidade

## 🚀 **Configuração Inicial**

### 1. **Instalar EAS CLI**
```bash
npm install -g eas-cli
```

### 2. **Fazer Login no Expo**
```bash
eas login
```

### 3. **Configurar EAS Build**
```bash
eas build:configure
```

### 4. **Configurar app.json**
```json
{
  "expo": {
    "name": "Money STD",
    "slug": "money-std",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.moneystd"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": "com.yourcompany.moneystd",
      "versionCode": 1,
      "permissions": [
        "WRITE_EXTERNAL_STORAGE",
        "READ_EXTERNAL_STORAGE"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

## 📦 **Gerando Builds**

### 1. **Build de Desenvolvimento (APK)**
```bash
# Gerar APK para testes
eas build --platform android --profile development

# Ou usando perfil específico
eas build --platform android --profile preview
```

### 2. **Build de Produção (AAB)**
```bash
# Gerar AAB para Play Store
eas build --platform android --profile production
```

### 3. **Build Local (APK)**
```bash
# Gerar APK localmente (mais rápido)
eas build --platform android --local
```

## ⚙️ **Configuração de Perfis**

### 1. **eas.json - Desenvolvimento**
```json
{
  "cli": {
    "version": ">= 5.9.1"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

## 🔐 **Configuração de Chaves**

### 1. **Gerar Keystore**
```bash
# Gerar keystore automaticamente
eas build:configure

# Ou manualmente
keytool -genkey -v -keystore money-std.keystore -alias money-std -keyalg RSA -keysize 2048 -validity 10000
```

### 2. **Configurar Credenciais**
```bash
# Configurar credenciais do Google Play
eas credentials

# Ou configurar manualmente no app.json
{
  "expo": {
    "android": {
      "package": "com.yourcompany.moneystd",
      "versionCode": 1,
      "googleServicesFile": "./google-services.json"
    }
  }
}
```

## 📱 **Preparação para Play Store**

### 1. **Assets Necessários**
```
assets/
├── icon.png (1024x1024)
├── adaptive-icon.png (1024x1024)
├── splash.png (1242x2436)
├── screenshots/
│   ├── phone-1.png (1080x1920)
│   ├── phone-2.png (1080x1920)
│   ├── phone-3.png (1080x1920)
│   ├── tablet-1.png (1200x1920)
│   └── tablet-2.png (1200x1920)
└── feature-graphic.png (1024x500)
```

### 2. **Metadados do App**
- **Nome**: Money STD
- **Descrição curta**: Gerenciador de finanças pessoais
- **Descrição completa**: App completo para controle de gastos e receitas...
- **Palavras-chave**: finanças, dinheiro, gastos, receitas, controle
- **Categoria**: Finanças
- **Classificação**: Livre para todos os públicos

### 3. **Política de Privacidade**
- Criar política de privacidade
- Hospedar em site público
- Incluir link no app

## 🚀 **Comandos de Publicação**

### 1. **Build e Submit Automático**
```bash
# Build e submit em um comando
eas build --platform android --profile production --auto-submit
```

### 2. **Submit Manual**
```bash
# Submit após build
eas submit --platform android
```

### 3. **Build e Download**
```bash
# Build e download local
eas build --platform android --profile production --local
```

## 📊 **Monitoramento**

### 1. **Verificar Status do Build**
```bash
# Listar builds
eas build:list

# Ver detalhes de um build
eas build:view [BUILD_ID]
```

### 2. **Logs do Build**
```bash
# Ver logs em tempo real
eas build:logs [BUILD_ID]
```

## 🔧 **Solução de Problemas**

### 1. **Erro de Keystore**
```bash
# Resetar keystore
eas credentials --platform android --clear

# Gerar novo keystore
eas build:configure
```

### 2. **Erro de Permissões**
```bash
# Verificar permissões no app.json
{
  "expo": {
    "android": {
      "permissions": [
        "WRITE_EXTERNAL_STORAGE",
        "READ_EXTERNAL_STORAGE"
      ]
    }
  }
}
```

### 3. **Erro de Versão**
```bash
# Incrementar versionCode
# Editar app.json
{
  "expo": {
    "android": {
      "versionCode": 2
    }
  }
}
```

## 📋 **Checklist de Publicação**

### ✅ **Pré-Build**
- [ ] Assets criados (ícone, splash, screenshots)
- [ ] app.json configurado
- [ ] eas.json configurado
- [ ] Conta Expo ativa
- [ ] EAS CLI instalado

### ✅ **Build**
- [ ] Build de desenvolvimento testado
- [ ] Build de produção gerado
- [ ] AAB baixado e verificado
- [ ] APK de teste gerado

### ✅ **Play Store**
- [ ] Conta Google Play Console ativa
- [ ] App criado no console
- [ ] Metadados preenchidos
- [ ] Screenshots enviadas
- [ ] Política de privacidade criada
- [ ] AAB enviado para revisão

### ✅ **Pós-Publicação**
- [ ] App aprovado pela Google
- [ ] App publicado na Play Store
- [ ] Monitoramento de downloads
- [ ] Feedback de usuários

## 🎯 **Comandos Rápidos**

### **Desenvolvimento**
```bash
# Build de desenvolvimento
eas build --platform android --profile development

# Build local rápido
eas build --platform android --local
```

### **Produção**
```bash
# Build de produção
eas build --platform android --profile production

# Build e submit automático
eas build --platform android --profile production --auto-submit
```

### **Monitoramento**
```bash
# Ver builds
eas build:list

# Ver logs
eas build:logs [BUILD_ID]
```

## 📞 **Suporte**

### **Links Úteis**
- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Google Play Console](https://play.google.com/console)
- [Android Developer Guidelines](https://developer.android.com/distribute)

### **Comunidade**
- [Expo Discord](https://discord.gg/expo)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/expo)
- [GitHub Issues](https://github.com/expo/expo/issues)

---

## 🎉 **Parabéns!**

Seu app Money STD está pronto para ser publicado na Google Play Store! 

Siga este manual passo a passo e você terá sucesso na publicação. 🚀

**Boa sorte com seu app!** 📱✨ 
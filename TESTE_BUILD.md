# 🧪 Teste Rápido de Build - Money STD

## 🚀 **Teste Local (Sem Login)**

Para testar se o build está funcionando sem precisar fazer login no Expo:

### **1. Build Local (APK)**
```bash
# Gerar APK localmente
eas build --platform android --local
```

### **2. Build de Desenvolvimento (APK)**
```bash
# Gerar APK para testes
eas build --platform android --profile development
```

## 🔧 **Setup Completo (Com Login)**

### **1. Login no Expo**
```bash
# Fazer login (criar conta em expo.dev se necessário)
eas login
```

### **2. Configurar Build**
```bash
# Configurar EAS Build
eas build:configure
```

### **3. Testar Script Automatizado**
```bash
# Executar script interativo
./scripts/build.sh
```

## 📱 **Verificar Configuração**

### **1. Verificar EAS CLI**
```bash
eas --version
```

### **2. Verificar Login**
```bash
eas whoami
```

### **3. Verificar Configuração**
```bash
# Ver arquivos de configuração
ls -la eas.json app.json
```

## 🎯 **Comandos de Teste**

### **Build Local (Mais Rápido)**
```bash
# Build local sem upload
eas build --platform android --local --profile development
```

### **Build na Nuvem (Com Login)**
```bash
# Build na nuvem do Expo
eas build --platform android --profile development
```

### **Ver Builds**
```bash
# Listar builds
eas build:list
```

## ⚠️ **Importante**

- ✅ **Build Local**: Não precisa de login, mas é mais lento
- ✅ **Build na Nuvem**: Precisa de login, mas é mais rápido
- ✅ **Primeira vez**: Sempre teste com build de desenvolvimento
- ✅ **Assets**: Certifique-se de que os assets estão presentes

## 🔍 **Solução de Problemas**

### **Erro de Login**
```bash
# Verificar se está logado
eas whoami

# Fazer login novamente
eas login
```

### **Erro de Configuração**
```bash
# Reconfigurar EAS
eas build:configure

# Verificar arquivos
cat eas.json
cat app.json
```

### **Erro de Assets**
```bash
# Verificar se assets existem
ls -la assets/

# Criar assets básicos se necessário
# (Ver assets/README_ASSETS.md)
```

## 🎉 **Sucesso!**

Se o build local funcionar, você está pronto para:
1. Fazer login no Expo
2. Configurar EAS Build
3. Gerar builds de produção
4. Publicar na Play Store

**Boa sorte!** 🚀 
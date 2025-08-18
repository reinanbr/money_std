# 🔧 Solução de Problemas - Money STD

## ❌ **Problemas Comuns e Soluções**

### **1. Erro: "buildType" must be one of [apk, app-bundle]**

**Problema**: Configuração incorreta no `eas.json`

**Solução**:
```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "app-bundle"  // ✅ Correto
        // "buildType": "aab"      // ❌ Incorreto
      }
    }
  }
}
```

### **2. Erro: "Cannot read property 'level3' of undefined"**

**Problema**: Estrutura do tema incorreta

**Solução**:
```typescript
// App.tsx - Simplificar tema
const paperTheme = {
  colors: {
    primary: colors.primary,
    accent: colors.accent,
    background: colors.background,
    surface: colors.surface,
    text: colors.text,
    placeholder: colors.placeholder,
    onSurface: colors.text,
    onPrimary: colors.text,
  },
  dark: isDarkMode
  // Remover elevation se causar problemas
};
```

### **3. Erro: "EAS project not configured"**

**Problema**: Projeto não configurado no EAS

**Solução**:
```bash
# Configurar projeto automaticamente
eas build:configure

# Ou criar manualmente
eas build --platform android --profile development
# Responder "yes" quando perguntar sobre criar projeto
```

### **4. Erro: "Build failed" no primeiro build**

**Problema**: Primeiro build pode falhar

**Solução**:
```bash
# 1. Verificar logs
eas build:list
eas build:view [BUILD_ID]

# 2. Tentar build local primeiro
eas build --platform android --local --profile development

# 3. Verificar assets
ls -la assets/
```

### **5. Erro: "Unable to resolve asset"**

**Problema**: Assets não encontrados

**Solução**:
```bash
# 1. Criar assets básicos
mkdir -p assets
touch assets/icon.png
touch assets/splash.png
touch assets/adaptive-icon.png
touch assets/favicon.png

# 2. Ou remover referências temporariamente
# Editar app.json e comentar as linhas de assets
```

### **6. Erro: "expo-dev-client not installed"**

**Problema**: Cliente de desenvolvimento não instalado

**Solução**:
```bash
# Instalar automaticamente (recomendado)
# Responder "yes" quando perguntar

# Ou instalar manualmente
npx expo install expo-dev-client
```

## 🔍 **Verificações de Diagnóstico**

### **1. Verificar Configuração**
```bash
# Verificar EAS CLI
eas --version

# Verificar login
eas whoami

# Verificar arquivos de configuração
cat eas.json
cat app.json
```

### **2. Verificar Dependências**
```bash
# Verificar se todas as dependências estão instaladas
npm list --depth=0

# Reinstalar se necessário
rm -rf node_modules package-lock.json
npm install
```

### **3. Verificar Assets**
```bash
# Verificar se assets existem
ls -la assets/

# Verificar tamanhos (se existirem)
file assets/icon.png
file assets/splash.png
```

## 🚀 **Fluxo de Recuperação**

### **Passo 1: Limpeza**
```bash
# Limpar cache
npx expo start --clear

# Limpar builds
eas build:list
# Deletar builds falhados se necessário
```

### **Passo 2: Reconfiguração**
```bash
# Reconfigurar EAS
eas build:configure

# Verificar configuração
cat eas.json
```

### **Passo 3: Build Local**
```bash
# Tentar build local primeiro
eas build --platform android --local --profile development
```

### **Passo 4: Build na Nuvem**
```bash
# Se build local funcionar, tentar na nuvem
eas build --platform android --profile development
```

## 📋 **Checklist de Verificação**

### ✅ **Antes do Build**
- [ ] EAS CLI instalado e funcionando
- [ ] Login no Expo realizado
- [ ] Projeto configurado no EAS
- [ ] Assets básicos presentes
- [ ] Dependências instaladas
- [ ] Configurações corretas

### ✅ **Durante o Build**
- [ ] Build local funciona
- [ ] Build na nuvem inicia
- [ ] Logs sem erros críticos
- [ ] Assets encontrados

### ✅ **Após o Build**
- [ ] APK/AAB gerado
- [ ] Arquivo baixado
- [ ] App instala corretamente
- [ ] Funcionalidades testadas

## 🆘 **Suporte Adicional**

### **Logs Detalhados**
```bash
# Ver logs de build
eas build:logs [BUILD_ID]

# Ver logs em tempo real
eas build:logs [BUILD_ID] --follow
```

### **Links Úteis**
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Expo Troubleshooting](https://docs.expo.dev/troubleshooting/)
- [React Native Paper Issues](https://github.com/callstack/react-native-paper/issues)

### **Comunidade**
- [Expo Discord](https://discord.gg/expo)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/expo)

---

**Se o problema persistir, verifique os logs detalhados e consulte a documentação oficial.** 🔍 
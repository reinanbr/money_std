# 🎨 Assets Necessários - Money STD

## 📱 **Assets Obrigatórios para Play Store**

### **1. Ícone do App**
- **Arquivo**: `icon.png`
- **Tamanho**: 1024x1024 pixels
- **Formato**: PNG (sem transparência)
- **Localização**: `./assets/icon.png`
- **Tamanho do arquivo**: Máximo 1MB
- **Descrição**: Ícone principal do app, quadrado, deve ser legível em tamanhos pequenos

### **2. Ícone Adaptativo (Android)**
- **Arquivo**: `adaptive-icon.png`
- **Tamanho**: 1024x1024 pixels
- **Formato**: PNG (com transparência)
- **Localização**: `./assets/adaptive-icon.png`
- **Tamanho do arquivo**: Máximo 1MB
- **Descrição**: Ícone para Android com suporte a formas adaptativas, área segura no centro

### **3. Splash Screen**
- **Arquivo**: `splash.png`
- **Tamanho**: 1242x2436 pixels (iPhone X)
- **Formato**: PNG
- **Localização**: `./assets/splash.png`
- **Tamanho do arquivo**: Máximo 2MB
- **Descrição**: Tela de carregamento inicial, deve ser responsiva

### **4. Favicon (Web)**
- **Arquivo**: `favicon.png`
- **Tamanho**: 32x32 pixels
- **Formato**: PNG
- **Localização**: `./assets/favicon.png`
- **Tamanho do arquivo**: Máximo 100KB
- **Descrição**: Ícone para versão web

## 📸 **Screenshots para Play Store**

### **Smartphone (1080x1920)**
- **phone-1.png**: Tela inicial com saldo
- **phone-2.png**: Lista de transações
- **phone-3.png**: Estatísticas e gráficos
- **phone-4.png**: Configurações e categorias
- **Tamanho**: 1080x1920 pixels
- **Formato**: PNG ou JPEG
- **Tamanho do arquivo**: Máximo 8MB cada

### **Tablet (1200x1920)**
- **tablet-1.png**: Layout adaptativo para tablet
- **tablet-2.png**: Gráficos em tela maior
- **Tamanho**: 1200x1920 pixels
- **Formato**: PNG ou JPEG
- **Tamanho do arquivo**: Máximo 8MB cada

### **Feature Graphic**
- **feature-graphic.png**: 1024x500 pixels
- **Formato**: PNG ou JPEG
- **Tamanho do arquivo**: Máximo 2MB
- **Descrição**: Banner promocional para Play Store

## 🎯 **Especificações Técnicas Detalhadas**

### **Cores Recomendadas**
- **Primária**: #007AFF (Azul)
- **Secundária**: #FF6B6B (Vermelho)
- **Fundo**: #FFFFFF (Branco)
- **Texto**: #000000 (Preto)
- **Acentos**: #4CAF50 (Verde), #FF9800 (Laranja)

### **Tipografia**
- **Fonte**: Roboto ou SF Pro
- **Tamanho mínimo**: 12px
- **Contraste**: Mínimo 4.5:1
- **Legibilidade**: Testar em diferentes tamanhos

### **Design Guidelines**
- ✅ **Simplicidade**: Design limpo e minimalista
- ✅ **Consistência**: Mesma paleta de cores
- ✅ **Legibilidade**: Texto claro e legível
- ✅ **Profissionalismo**: Aparência profissional
- ✅ **Escalabilidade**: Funcionar em diferentes tamanhos

## 🛠️ **Ferramentas para Produção**

### **Editores de Imagem Gratuitos**
- **GIMP**: https://www.gimp.org/ (Linux, Windows, Mac)
- **Canva**: https://www.canva.com/ (Online)
- **Figma**: https://www.figma.com/ (Online)
- **Inkscape**: https://inkscape.org/ (Vetorial)

### **Editores Profissionais**
- **Adobe Photoshop**: https://www.adobe.com/products/photoshop.html
- **Adobe Illustrator**: https://www.adobe.com/products/illustrator.html
- **Sketch**: https://www.sketch.com/ (Mac)

### **Geradores Online**
- **App Icon Generator**: https://appicon.co/
- **Splash Screen Generator**: https://splash-screen-generator.com/
- **Favicon Generator**: https://favicon.io/
- **Android Asset Studio**: https://romannurik.github.io/AndroidAssetStudio/

## 📋 **Tutorial de Criação**

### **1. Ícone do App (1024x1024)**
```bash
# Usando GIMP
1. Abrir GIMP
2. Arquivo > Novo (1024x1024 pixels)
3. Criar design centralizado
4. Exportar como PNG
5. Verificar tamanho do arquivo (< 1MB)
```

### **2. Ícone Adaptativo (1024x1024)**
```bash
# Área segura: 512x512 pixels no centro
# Área total: 1024x1024 pixels
1. Criar canvas 1024x1024
2. Design principal na área central 512x512
3. Fundo ou padrão na área externa
4. Exportar com transparência
```

### **3. Splash Screen (1242x2436)**
```bash
# Proporção: 9:19.5 (iPhone X)
1. Criar canvas 1242x2436
2. Logo centralizado
3. Fundo sólido ou gradiente
4. Texto opcional (nome do app)
5. Exportar como PNG
```

### **4. Screenshots (1080x1920)**
```bash
# Proporção: 9:16 (Smartphone)
1. Capturar tela do app
2. Redimensionar para 1080x1920
3. Adicionar bordas se necessário
4. Exportar como PNG
```

## 📊 **Verificação de Qualidade**

### **Checklist de Verificação**
- [ ] **Dimensões corretas**: Verificar pixels exatos
- [ ] **Formato PNG**: Sem compressão excessiva
- [ ] **Tamanho do arquivo**: Dentro dos limites
- [ ] **Legibilidade**: Testar em tamanhos pequenos
- [ ] **Contraste**: Suficiente para acessibilidade
- [ ] **Cores**: Consistentes com a marca

### **Comandos de Verificação**
```bash
# Verificar dimensões
file assets/icon.png
identify assets/icon.png

# Verificar tamanho
ls -lh assets/

# Verificar formato
file assets/*.png
```

## 🚀 **Exemplos de Assets**

### **Ícone Simples**
```
┌─────────────────┐
│                 │
│    💰 MONEY     │
│                 │
│      STD        │
│                 │
└─────────────────┘
```

### **Splash Screen**
```
┌─────────────────┐
│                 │
│                 │
│                 │
│    💰 MONEY     │
│      STD        │
│                 │
│  Gerenciador    │
│   de Finanças   │
│                 │
│                 │
└─────────────────┘
```

## 📱 **Estrutura de Pastas**

```
assets/
├── icon.png (1024x1024)
├── adaptive-icon.png (1024x1024)
├── splash.png (1242x2436)
├── favicon.png (32x32)
├── screenshots/
│   ├── phone-1.png (1080x1920)
│   ├── phone-2.png (1080x1920)
│   ├── phone-3.png (1080x1920)
│   ├── tablet-1.png (1200x1920)
│   └── tablet-2.png (1200x1920)
└── feature-graphic.png (1024x500)
```

## 🎨 **Dicas de Design**

### **Para Ícones**
- Use formas simples e reconhecíveis
- Mantenha boa legibilidade em 48x48px
- Teste em fundos claros e escuros
- Evite detalhes muito pequenos

### **Para Screenshots**
- Mostre as funcionalidades principais
- Use dados realistas
- Mantenha interface limpa
- Destaque recursos únicos

### **Para Splash Screen**
- Logo centralizado
- Cores da marca
- Carregamento rápido
- Transição suave

## 🔧 **Otimização**

### **Compressão PNG**
```bash
# Usando pngquant
pngquant --quality=65-80 assets/icon.png

# Usando ImageOptim (Mac)
# Usando FileOptimizer (Windows)
```

### **Verificação Final**
```bash
# Verificar todos os assets
ls -la assets/
file assets/*.png
du -h assets/*.png
```

## 📞 **Recursos Adicionais**

### **Links Úteis**
- [Google Play Console Guidelines](https://support.google.com/googleplay/android-developer/answer/9859152)
- [Material Design Icons](https://material.io/resources/icons/)
- [Expo Asset Guidelines](https://docs.expo.dev/guides/assets/)

### **Comunidade**
- [Designer News](https://www.designernews.co/)
- [Dribbble](https://dribbble.com/)
- [Behance](https://www.behance.net/)

---

## 🎉 **Próximos Passos**

1. **Escolher ferramenta**: GIMP, Canva, Figma, etc.
2. **Criar assets**: Seguir especificações exatas
3. **Testar qualidade**: Verificar dimensões e tamanhos
4. **Otimizar**: Comprimir se necessário
5. **Colocar na pasta**: `assets/`
6. **Testar no app**: Verificar visualização

**Boa sorte com seus assets!** 🎨✨ 
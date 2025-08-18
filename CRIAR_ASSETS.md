# 🎨 Guia Rápido - Criar Assets para Money STD

## ⚡ **Criação Rápida de Assets**

### **Opção 1: Usando Canva (Mais Fácil)**

1. **Acesse**: https://www.canva.com/
2. **Crie conta gratuita**
3. **Use templates**: "App Icon" ou "Mobile App"

#### **Ícone do App (1024x1024)**
```
1. Criar novo design
2. Tamanho: 1024x1024 pixels
3. Fundo: #007AFF (azul)
4. Adicionar: 💰 MONEY STD
5. Fonte: Roboto, branco
6. Exportar: PNG
```

#### **Splash Screen (1242x2436)**
```
1. Criar novo design
2. Tamanho: 1242x2436 pixels
3. Fundo: Gradiente azul
4. Logo centralizado
5. Texto: "Money STD"
6. Exportar: PNG
```

### **Opção 2: Usando GIMP (Gratuito)**

#### **Instalar GIMP**
```bash
# Ubuntu/Debian
sudo apt install gimp

# Windows/Mac
# Baixar de https://www.gimp.org/
```

#### **Criar Ícone**
```
1. Arquivo > Novo
2. Largura: 1024, Altura: 1024
3. Criar camada de fundo
4. Adicionar texto: MONEY STD
5. Arquivo > Exportar como > icon.png
```

### **Opção 3: Geradores Online**

#### **App Icon Generator**
1. **Acesse**: https://appicon.co/
2. **Faça upload** de uma imagem
3. **Baixe** todos os tamanhos
4. **Use** o de 1024x1024

#### **Android Asset Studio**
1. **Acesse**: https://romannurik.github.io/AndroidAssetStudio/
2. **Escolha** "Launcher Icons"
3. **Configure** cores e texto
4. **Baixe** o pacote completo

## 📱 **Assets Mínimos Necessários**

### **Para Build Funcionar**
```bash
# Criar assets básicos
mkdir -p assets
cd assets

# Ícone simples (1024x1024)
echo "💰 MONEY STD" > icon.txt
# Converter para PNG usando ferramenta online

# Splash básico (1242x2436)
echo "Money STD" > splash.txt
# Converter para PNG usando ferramenta online
```

### **Estrutura Mínima**
```
assets/
├── icon.png (1024x1024)
├── adaptive-icon.png (1024x1024)
├── splash.png (1242x2436)
└── favicon.png (32x32)
```

## 🎯 **Templates Prontos**

### **Ícone Simples**
```
┌─────────────────┐
│  ████████████   │
│  █  💰 MONEY █  │
│  █    STD    █  │
│  ████████████   │
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

## 🛠️ **Ferramentas por Sistema**

### **Linux**
- **GIMP**: `sudo apt install gimp`
- **Inkscape**: `sudo apt install inkscape`
- **Online**: Canva, Figma

### **Windows**
- **GIMP**: https://www.gimp.org/
- **Paint.NET**: https://www.getpaint.net/
- **Online**: Canva, Figma

### **Mac**
- **GIMP**: https://www.gimp.org/
- **Sketch**: https://www.sketch.com/
- **Online**: Canva, Figma

## 📊 **Verificação Rápida**

### **Comandos de Verificação**
```bash
# Verificar se assets existem
ls -la assets/

# Verificar tamanhos
du -h assets/*.png

# Verificar dimensões (se tiver ImageMagick)
identify assets/icon.png
```

### **Checklist Rápido**
- [ ] `icon.png` existe e tem tamanho > 0
- [ ] `splash.png` existe e tem tamanho > 0
- [ ] `adaptive-icon.png` existe e tem tamanho > 0
- [ ] `favicon.png` existe e tem tamanho > 0

## 🚀 **Teste Rápido**

### **1. Criar Assets Básicos**
```bash
# Usar qualquer ferramenta para criar:
# - icon.png (1024x1024)
# - splash.png (1242x2436)
# - adaptive-icon.png (1024x1024)
# - favicon.png (32x32)
```

### **2. Colocar na Pasta**
```bash
# Colocar todos os arquivos em assets/
cp *.png assets/
```

### **3. Testar Build**
```bash
# Testar build local
eas build --platform android --local --profile development
```

## 💡 **Dicas Rápidas**

### **Para Ícones**
- Use formas simples
- Teste em tamanho pequeno
- Mantenha contraste alto
- Use cores da marca

### **Para Splash**
- Logo centralizado
- Fundo sólido ou gradiente
- Carregamento rápido
- Cores consistentes

### **Para Screenshots**
- Mostre funcionalidades principais
- Use dados realistas
- Interface limpa
- Destaque recursos únicos

## 🎉 **Próximos Passos**

1. **Escolher ferramenta**: Canva (fácil) ou GIMP (gratuito)
2. **Criar assets básicos**: Ícone e splash
3. **Colocar na pasta**: `assets/`
4. **Testar build**: `eas build --local`
5. **Refinar design**: Melhorar conforme necessário

**Boa sorte!** 🎨✨ 
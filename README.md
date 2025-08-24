# 💰 Money STD - Controle Financeiro

Um aplicativo móvel completo para controle financeiro pessoal, desenvolvido em React Native com TypeScript.

## 📱 Sobre o App

Money STD é um aplicativo de controle financeiro que permite gerenciar receitas e despesas de forma simples e intuitiva, com suporte a temas claro/escuro automático e visualizações gráficas detalhadas.

### ✨ Funcionalidades

- 📊 **Dashboard Principal**: Visualização do saldo total, receitas e despesas
- 💸 **Gerenciamento de Transações**: Adicionar, editar e excluir receitas e despesas
- 📈 **Estatísticas Avançadas**: Gráficos de evolução por período (7 dias, 30 dias, 3/6/12 meses, 1 ano)
- 🏷️ **Categorias Personalizadas**: Gerencie suas próprias categorias de transações
- 🌓 **Tema Automático**: Detecção automática do tema do sistema (claro/escuro)
- 📤 **Exportar/Importar**: Backup e restauração de dados em formato JSON
- 🔄 **Pull-to-Refresh**: Atualize os dados puxando para baixo
- 💾 **Histórico de Saldo**: Evolução do saldo total baseada nas transações

## 🏗️ Estrutura do Projeto

```
money_std/
├── 📁 src/
│   ├── 📁 components/           # Componentes reutilizáveis
│   │   ├── AddTransactionModal.tsx  # Modal para adicionar/editar transações
│   │   ├── BalanceCard.tsx         # Card de exibição do saldo
│   │   └── TransactionItem.tsx     # Item individual de transação
│   ├── 📁 context/             # Context API para gerenciamento de estado
│   │   └── ThemeContext.tsx        # Contexto de tema claro/escuro
│   ├── 📁 database/            # Camada de dados SQLite
│   │   └── database.ts             # Operações CRUD e configuração do banco
│   ├── 📁 screens/             # Telas do aplicativo
│   │   ├── HomeScreen.tsx          # Tela principal com dashboard
│   │   ├── StatsScreen.tsx         # Tela de estatísticas e gráficos
│   │   ├── TransactionsScreen.tsx  # Tela de listagem e filtros
│   │   ├── SettingsScreen.tsx      # Tela de configurações
│   │   └── SplashScreen.tsx        # Tela de carregamento
│   └── 📁 types/               # Definições de tipos TypeScript
│       └── index.ts                # Interfaces e tipos globais
├── 📁 assets/                  # Recursos visuais
│   ├── icon.png                    # Ícone do app (1024x1024)
│   ├── adaptive-icon.png           # Ícone adaptativo Android
│   ├── splash.png                  # Splash screen (1284x2778)
│   ├── favicon.png                 # Favicon web
│   └── logo_app.png               # Logo base
├── 📁 scripts/                 # Scripts de automação
│   └── build.sh                    # Script de build automatizado
├── app.json                    # Configuração do Expo
├── eas.json                    # Configuração do EAS Build
├── package.json                # Dependências e scripts
├── tsconfig.json               # Configuração TypeScript
└── babel.config.js             # Configuração Babel
```

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework de desenvolvimento móvel
- **TypeScript** - Superset JavaScript com tipagem estática
- **Expo** - Plataforma de desenvolvimento React Native
- **SQLite** - Banco de dados local para persistência
- **React Navigation** - Navegação entre telas
- **React Native Paper** - Biblioteca de componentes Material Design
- **React Native Chart Kit** - Biblioteca para gráficos
- **EAS Build** - Serviço de build da Expo

## 📦 Instalação e Configuração

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo CLI
- EAS CLI (para builds)

### 1️⃣ Clone o projeto

```bash
git clone <repository-url>
cd money_std
```

### 2️⃣ Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3️⃣ Configure as ferramentas

```bash
# Instalar Expo CLI globalmente
npm install -g @expo/cli

# Instalar EAS CLI para builds
npm install -g eas-cli
```

## 🚀 Executando o Projeto

### Desenvolvimento

```bash
# Iniciar o servidor de desenvolvimento
npm start
# ou
npx expo start

# Para forçar o uso do Expo Go
npx expo start --go

# Para limpar cache
npx expo start --clear
```

### Testando no dispositivo

1. **Android**: Instale o app Expo Go na Play Store
2. **iOS**: Instale o app Expo Go na App Store
3. Escaneie o QR code exibido no terminal
4. O app será carregado automaticamente

## 🏗️ Builds de Produção

### Configurar EAS

```bash
# Fazer login na Expo
eas login

# Configurar o projeto (se necessário)
eas build:configure
```

### Gerar APK (Android)

```bash
# Build para desenvolvimento/teste
eas build --platform android --profile preview

# Build para produção (recomendado para Play Store)
eas build --platform android --profile production
```

### Gerar AAB (Android App Bundle)

```bash
# Para publicação na Play Store
eas build --platform android --profile production
```

### Perfis de Build (eas.json)

- **development**: Build de desenvolvimento com Expo Dev Client
- **preview**: Gera APK para testes externos
- **production**: Gera AAB otimizado para Play Store

## 📱 Screenshots

> **Nota**: Adicione aqui os prints de tela do seu aplicativo:

- 🏠 **Tela Principal**: Dashboard com saldo e transações recentes
<img src='/screens/inicial.jpeg' width='300'/>
- 📊 **Estatísticas**: Gráficos de evolução e distribuição
<img src='/screens/stats.jpeg' width='300'/>
- 📋 **Transações**: Lista com filtros por tipo e categoria
<img src='/screens/trans.jpeg' width='300'/>
- ⚙️ **Configurações**: Gerenciamento de categorias e exportação
<img src='/screens/conf.jpeg' width='300'/>

## 🗄️ Banco de Dados

O app utiliza SQLite local com as seguintes tabelas:

### Transações
- `id` (INTEGER PRIMARY KEY)
- `description` (TEXT)
- `amount` (REAL)
- `type` ('income' | 'expense')
- `category_id` (INTEGER)
- `date` (TEXT)
- `created_at` (TEXT)

### Categorias
- `id` (INTEGER PRIMARY KEY)
- `name` (TEXT)
- `type` ('income' | 'expense')
- `color` (TEXT)

### Histórico de Saldo
- `id` (INTEGER PRIMARY KEY)
- `total_balance` (REAL)
- `income` (REAL)
- `expense` (REAL)
- `date` (TEXT)
- `created_at` (TEXT)

## 📂 Guias Adicionais

- 📋 **[Comandos Rápidos](COMANDOS_RAPIDOS.md)** - Comandos essenciais para desenvolvimento
- 🚀 **[Guia de Publicação](README_PUBLICACAO.md)** - Tutorial completo para publicar na Play Store
- 🎨 **[Especificações de Assets](assets/README_ASSETS.md)** - Dimensões e formatos de imagens
- 🔧 **[Solução de Problemas](SOLUCAO_PROBLEMAS.md)** - Resolução de erros comuns
- ⚡ **[Guia Rápido de Assets](CRIAR_ASSETS.md)** - Tutorial para criar assets
- 📋 **[Exemplo de Uso](EXEMPLO_USO.md)** - Exemplos práticos de uso

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.


**Desenvolvido com ❤️ usando React Native + TypeScript** 
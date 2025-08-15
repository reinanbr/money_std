# Money STD - Controle Financeiro Pessoal

Um aplicativo completo para controle financeiro pessoal desenvolvido em **React Native** com **TypeScript**, usando **Expo** e **SQLite** para armazenamento local.

## 🚀 Funcionalidades

- **Gestão de Transações**: Adicione receitas e despesas com descrição e categoria
- **Categorização**: Sistema de categorias personalizáveis com cores
- **Dashboard**: Visualização do saldo total, receitas e despesas
- **Estatísticas Avançadas**: Gráficos informativos (linha, pizza, barras)
- **Filtros**: Filtre transações por tipo e categoria
- **Tema Dinâmico**: Modo claro, escuro e automático baseado no sistema
- **Pull-to-Refresh**: Atualize os dados puxando para baixo
- **Splash Screen**: Tela de carregamento animada
- **Configurações**: Gerencie categorias e preferências do app

## 🛠️ Tecnologias Utilizadas

- **React Native** (0.72.10)
- **TypeScript** (5.1.3)
- **Expo** (49.0.15)
- **SQLite** (expo-sqlite)
- **React Navigation** (Bottom Tabs)
- **React Native Paper** (UI Components)
- **React Native Chart Kit** (Gráficos)
- **AsyncStorage** (Persistência de dados)

## 📱 Telas do App

1. **Início**: Dashboard com saldo e transações recentes
2. **Transações**: Lista completa com filtros
3. **Estatísticas**: Gráficos e análises financeiras
4. **Configurações**: Gerenciamento de categorias e preferências

## 🎨 Tema e Personalização

- **Modo Claro**: Interface clara e limpa
- **Modo Escuro**: Interface escura para uso noturno
- **Modo Automático**: Segue a configuração do sistema
- **Cores Dinâmicas**: Todos os elementos se adaptam ao tema

## 📊 Gráficos e Estatísticas

- **Evolução Mensal**: Gráfico de linha dos últimos 6 meses
- **Distribuição de Despesas**: Gráfico de pizza por categoria
- **Comparação Mensal**: Gráfico de barras receitas vs despesas
- **Top Categorias**: Ranking das categorias mais utilizadas

## 🗄️ Estrutura do Banco de Dados

### Tabela: categories
```sql
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  color TEXT DEFAULT '#007AFF'
);
```

### Tabela: transactions
```sql
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT NOT NULL,
  amount REAL NOT NULL,
  type TEXT NOT NULL,
  category_id INTEGER,
  date TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories (id)
);
```

## 📦 Instalação

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo CLI
- Expo Go (para testar no dispositivo)

### Passos para Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd money_std
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute o script de instalação automática**
   ```bash
   chmod +x install.sh
   ./install.sh
   ```

4. **Inicie o projeto**
   ```bash
   npx expo start
   ```

5. **Teste no dispositivo**
   - Instale o Expo Go no seu smartphone
   - Escaneie o QR code que aparece no terminal
   - Ou pressione 'a' para abrir no Android (se tiver emulador)

## 🏗️ Estrutura do Projeto

```
money_std/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── AddTransactionModal.tsx
│   │   ├── BalanceCard.tsx
│   │   └── TransactionItem.tsx
│   ├── context/            # Contexto do tema
│   │   └── ThemeContext.tsx
│   ├── database/           # Operações do banco de dados
│   │   └── database.ts
│   ├── screens/            # Telas do aplicativo
│   │   ├── HomeScreen.tsx
│   │   ├── TransactionsScreen.tsx
│   │   ├── StatsScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── SplashScreen.tsx
│   └── types/              # Definições de tipos TypeScript
│       └── index.ts
├── App.tsx                 # Componente principal
├── package.json
├── tsconfig.json          # Configuração do TypeScript
└── README.md
```

## 🔧 Configuração do TypeScript

O projeto está configurado com TypeScript para maior segurança de tipos e melhor experiência de desenvolvimento:

- **tsconfig.json**: Configuração do compilador TypeScript
- **Tipos definidos**: Interfaces para todas as estruturas de dados
- **Verificação de tipos**: Execute `npx tsc --noEmit` para verificar tipos

## 📋 Categorias Padrão

### Despesas
- Alimentação (#FF6B6B)
- Transporte (#4ECDC4)
- Moradia (#45B7D1)
- Saúde (#96CEB4)
- Educação (#FFEAA7)
- Lazer (#DDA0DD)
- Outros (#95A5A6)

### Receitas
- Salário (#2ECC71)
- Freelance (#F39C12)
- Investimentos (#9B59B6)

## 🎯 Como Usar

### Adicionando Transações
1. Toque no botão "+" na tela inicial
2. Escolha entre "Receita" ou "Despesa"
3. Preencha descrição, valor e categoria
4. Selecione a data
5. Toque em "Salvar"

### Filtrando Transações
1. Vá para a aba "Transações"
2. Use os botões para filtrar por tipo
3. Toque nas categorias para filtrar por categoria específica

### Visualizando Estatísticas
1. Vá para a aba "Estatísticas"
2. Veja os gráficos de evolução mensal
3. Analise a distribuição de despesas
4. Compare receitas vs despesas do mês atual

### Gerenciando Categorias
1. Vá para "Configurações"
2. Toque no ícone "+" para adicionar categoria
3. Escolha nome, tipo e cor
4. Toque no ícone de lixeira para excluir

## 🚀 Build para Produção

### Android
```bash
npx expo build:android
```

### iOS
```bash
npx expo build:ios
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🐛 Problemas Conhecidos

- Funcionalidades de exportar/importar dados estão em desenvolvimento
- Algumas funcionalidades avançadas podem não funcionar em dispositivos mais antigos

## 📞 Suporte

Para suporte, entre em contato: suporte@moneystd.com

## 🔄 Histórico de Versões

### v1.0.0
- ✅ Conversão completa para TypeScript
- ✅ Sistema de temas dinâmico
- ✅ Gráficos informativos
- ✅ Gestão de categorias
- ✅ Splash screen animada
- ✅ Pull-to-refresh
- ✅ Interface responsiva

---

**Desenvolvido com ❤️ usando React Native, TypeScript e Expo** 
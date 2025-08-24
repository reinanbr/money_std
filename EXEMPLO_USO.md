# Exemplo de Uso - Money STD

## 📱 Funcionalidades Principais

### 1. Adicionar Transações

- **Receitas**: Salários, vendas, investimentos
- **Despesas**: Contas, compras, lazer
- **Categorização**: Automática por tipo
- **Descrição**: Detalhes da transação

### 2. Visualizar Saldo

- **Saldo Total**: Receitas - Despesas
- **Receitas Totais**: Soma de todas as entradas
- **Despesas Totais**: Soma de todos os gastos
- **Atualização em tempo real**

### 3. Filtrar Transações

- **Por tipo**: Todas, Receitas, Despesas
- **Por categoria**: Filtro específico
- **Busca rápida**: Encontre transações facilmente

### 4. Analisar Estatísticas

- **Gráficos informativos**: Linha, pizza, barras
- **Períodos personalizáveis**: 3, 6, 12 meses ou 1 ano
- **Análise por categoria**: Top categorias
- **Tendências**: Evolução financeira

### 5. Gerenciar Categorias

- **Adicionar categorias**: Personalizadas
- **Cores**: Identificação visual
- **Editar/Excluir**: Gerenciamento completo

### 6. Exportar/Importar Dados

- **Formato JSON**: Estrutura completa
- **Salvar JSON**: Salva na pasta Downloads
- **Importar JSON**: Restaura dados de backup
- **Backup completo**: Categorias e transações
- **Compartilhamento**: Via apps nativos

## 📊 Estrutura do JSON Exportado

```json
{
  "version": "1.0.0",
  "exportDate": "2024-01-15T10:30:00.000Z",
  "categories": [
    {
      "id": 1,
      "name": "Alimentação",
      "type": "expense",
      "color": "#FF6B6B"
    },
    {
      "id": 2,
      "name": "Salário",
      "type": "income",
      "color": "#4ECDC4"
    }
  ],
  "transactions": [
    {
      "id": 1,
      "amount": 150.00,
      "description": "Supermercado",
      "category_id": 1,
      "type": "expense",
      "date": "2024-01-15"
    },
    {
      "id": 2,
      "amount": 3000.00,
      "description": "Salário Janeiro",
      "category_id": 2,
      "type": "income",
      "date": "2024-01-05"
    }
  ]
}
```

## 🔄 Como Usar a Exportação/Importação

### Exportar Dados

1. **Acesse Configurações** → Seção "Dados"
2. **Toque em "Exportar Dados"**
3. **Escolha a opção**:
   - **Salvar JSON**: Salva arquivo .json na pasta Downloads
   - **Compartilhar**: Abre menu de compartilhamento
4. **Após o download**:
   - **Compartilhar Arquivo**: Envia o arquivo .json via apps
   - **Abrir Gerenciador**: Mostra localização e tenta abrir diretório
5. **Salve o arquivo** em local seguro

### Importar Dados

1. **Acesse Configurações** → Seção "Dados"
2. **Toque em "Importar Dados"**
3. **Escolha a opção**:
   - **Selecionar Arquivo**: Escolhe arquivo .json do dispositivo
   - **Colar JSON**: Cole o JSON no campo de texto
4. **Confirme a importação** (substituirá dados atuais)
5. **Aguarde a conclusão** da importação

### ⚠️ Importante

- **Backup antes de importar**: Faça backup dos dados atuais
- **Formato JSON válido**: Use apenas arquivos exportados pelo app
- **Substituição total**: Importação substitui todos os dados existentes
- **Tipos suportados**: Arquivos .json ou texto JSON válido
- **Origem segura**: Use apenas arquivos de fontes confiáveis

## 💡 Dicas de Uso

### Organização Financeira

- **Categorize tudo**: Facilita análise
- **Descreva detalhadamente**: Ajuda no controle
- **Revise mensalmente**: Mantenha dados atualizados

### Análise de Gastos

- **Use os gráficos**: Identifique padrões
- **Compare períodos**: Veja evolução
- **Ajuste categorias**: Personalize conforme necessário

### Backup Regular

- **Exporte semanalmente**: Mantenha backup atualizado
- **Guarde em local seguro**: Cloud ou dispositivo
- **Teste restauração**: Verifique se funciona

## 🎯 Fluxo Típico de Uso

1. **Configuração Inicial**

   - Adicione categorias personalizadas
   - Configure cores preferidas
2. **Uso Diário**

   - Adicione receitas e despesas
   - Categorize adequadamente
   - Revise saldo atual
3. **Análise Semanal**

   - Verifique estatísticas
   - Analise gráficos
   - Ajuste orçamento
4. **Backup Mensal**

   - Exporte dados
   - Salve backup
   - Revise categorias

## 🎯 Metas Financeiras

### Controle de Gastos

- **Limite por categoria**: Defina tetos
- **Alertas**: Configure limites
- **Revisão**: Ajuste conforme necessário

### Economia

- **Meta mensal**: Defina valor
- **Acompanhe**: Use gráficos
- **Celebre**: Atingiu a meta!

### Investimentos

- **Categorize investimentos**: Separe por tipo
- **Acompanhe retornos**: Use descrições
- **Planeje**: Use estatísticas

## 🔧 Solução de Problemas

### App não inicia

- Verifique conexão com internet
- Reinicie o app
- Limpe cache se necessário

### Dados não salvam

- Verifique permissões
- Reinicie o app
- Exporte backup antes de limpar

### Gráficos não aparecem

- Adicione mais transações
- Verifique período selecionado
- Reinicie o app

### Exportação falha

- Verifique espaço em disco
- Tente compartilhar ao invés de copiar
- Reinicie o app

**Money STD** - Controle financeiro simples e eficiente! 💰

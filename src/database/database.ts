import * as SQLite from 'expo-sqlite';
import { Transaction, Category, Balance } from '../types';

// Atualizada para nova API do expo-sqlite
const db = SQLite.openDatabaseSync('money_std.db');

export const initDatabase = async (): Promise<void> => {
  try {
    // Tabela para categorias
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        color TEXT DEFAULT '#007AFF'
      );
    `);

    // Inserir categorias padrão
    await db.execAsync(`
      INSERT OR IGNORE INTO categories (name, type, color) VALUES 
      ('Alimentação', 'expense', '#FF6B6B'),
      ('Transporte', 'expense', '#4ECDC4'),
      ('Moradia', 'expense', '#45B7D1'),
      ('Saúde', 'expense', '#96CEB4'),
      ('Educação', 'expense', '#FFEAA7'),
      ('Lazer', 'expense', '#DDA0DD'),
      ('Salário', 'income', '#2ECC71'),
      ('Freelance', 'income', '#F39C12'),
      ('Investimentos', 'income', '#9B59B6'),
      ('Outros', 'expense', '#95A5A6');
    `);

    // Limpar categorias duplicadas existentes
    await db.execAsync(`
      DELETE FROM categories WHERE id NOT IN (
        SELECT MIN(id) FROM categories 
        GROUP BY name, type
      );
    `);

    // Tabela para transações
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        category_id INTEGER,
        date TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories (id)
      );
    `);

    // Tabela para histórico de saldo
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS balance_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        total_balance REAL NOT NULL,
        income REAL NOT NULL,
        expense REAL NOT NULL,
        date TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    throw error;
  }
};

export const getCategories = async (type?: 'income' | 'expense' | null): Promise<Category[]> => {
  try {
    const query = type 
      ? 'SELECT DISTINCT * FROM categories WHERE type = ? ORDER BY name'
      : 'SELECT DISTINCT * FROM categories ORDER BY type, name';
    
    const result = type 
      ? await db.getAllAsync(query, [type])
      : await db.getAllAsync(query);
    
    // Remove duplicatas adicionais baseado no nome e tipo
    const uniqueCategories = result.filter((category: any, index: number, self: any[]) => 
      index === self.findIndex((c: any) => c.name === category.name && c.type === category.type)
    );
    
    return uniqueCategories as Category[];
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    throw error;
  }
};

export const addTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<number> => {
  try {
    const result = await db.runAsync(
      'INSERT INTO transactions (description, amount, type, category_id, date) VALUES (?, ?, ?, ?, ?)',
      [transaction.description, transaction.amount, transaction.type, transaction.category_id, transaction.date]
    );
    
    // Salvar histórico de saldo após adicionar transação
    const balance = await getBalance();
    await saveBalanceHistory(balance);
    
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Erro ao adicionar transação:', error);
    throw error;
  }
};

interface TransactionFilters {
  type?: 'income' | 'expense';
  category_id?: number;
  start_date?: string;
  end_date?: string;
}

export const getTransactions = async (filters: TransactionFilters = {}): Promise<Transaction[]> => {
  try {
    let query = `
      SELECT t.*, c.name as category_name, c.color as category_color 
      FROM transactions t 
      LEFT JOIN categories c ON t.category_id = c.id
    `;
    const params: (string | number)[] = [];
    const conditions: string[] = [];

    if (filters.type) {
      conditions.push('t.type = ?');
      params.push(filters.type);
    }

    if (filters.category_id) {
      conditions.push('t.category_id = ?');
      params.push(filters.category_id);
    }

    if (filters.start_date && filters.end_date) {
      conditions.push('t.date BETWEEN ? AND ?');
      params.push(filters.start_date, filters.end_date);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY t.date DESC, t.created_at DESC';

    const result = await db.getAllAsync(query, params);
    return result as Transaction[];
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    throw error;
  }
};

export const updateTransaction = async (id: number, transaction: Omit<Transaction, 'id'>): Promise<number> => {
  try {
    const result = await db.runAsync(
      'UPDATE transactions SET description = ?, amount = ?, type = ?, category_id = ?, date = ? WHERE id = ?',
      [transaction.description, transaction.amount, transaction.type, transaction.category_id, transaction.date, id]
    );
    
    // Salvar histórico de saldo após atualizar transação
    const balance = await getBalance();
    await saveBalanceHistory(balance);
    
    return result.changes;
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    throw error;
  }
};

export const deleteTransaction = async (id: number): Promise<number> => {
  try {
    const result = await db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
    return result.changes;
  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    throw error;
  }
};

export const getBalance = async (): Promise<Balance> => {
  try {
    const result = await db.getFirstAsync(`
      SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense
      FROM transactions
    `);
    
    const data = result as any;
    const total = (data?.total_income || 0) - (data?.total_expense || 0);
    
    return {
      total,
      income: data?.total_income || 0,
      expense: data?.total_expense || 0
    };
  } catch (error) {
    console.error('Erro ao calcular saldo:', error);
    throw error;
  }
};

export const addCategory = async (category: Omit<Category, 'id'>): Promise<number> => {
  try {
    const result = await db.runAsync(
      'INSERT INTO categories (name, type, color) VALUES (?, ?, ?)',
      [category.name, category.type, category.color]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Erro ao adicionar categoria:', error);
    throw error;
  }
};

export const deleteCategory = async (id: number): Promise<number> => {
  try {
    // Primeiro, atualiza transações que usam esta categoria para "Sem categoria"
    await db.runAsync('UPDATE transactions SET category_id = NULL WHERE category_id = ?', [id]);
    
    // Depois, deleta a categoria
    const result = await db.runAsync('DELETE FROM categories WHERE id = ?', [id]);
    return result.changes;
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    throw error;
  }
};

export const exportDataAsJSON = async (): Promise<string> => {
  try {
    // Buscar todas as categorias
    const categories = await db.getAllAsync('SELECT * FROM categories ORDER BY id');
    
    // Buscar todas as transações
    const transactions = await db.getAllAsync('SELECT * FROM transactions ORDER BY id');
    
    const exportData = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      categories,
      transactions
    };
    
    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    throw error;
  }
};

export const importDataFromJSON = async (jsonData: string): Promise<boolean> => {
  try {
    const data = JSON.parse(jsonData);
    
    // Validar estrutura do JSON
    if (!data.categories || !data.transactions) {
      throw new Error('Formato JSON inválido');
    }
    
    // Limpar dados existentes
    await db.execAsync('DELETE FROM transactions');
    await db.execAsync('DELETE FROM categories');
    
    // Importar categorias
    for (const category of data.categories) {
      await db.runAsync(
        'INSERT INTO categories (id, name, type, color) VALUES (?, ?, ?, ?)',
        [category.id, category.name, category.type, category.color]
      );
    }
    
    // Importar transações
    for (const transaction of data.transactions) {
      await db.runAsync(
        'INSERT INTO transactions (id, amount, description, category_id, type, date) VALUES (?, ?, ?, ?, ?, ?)',
        [transaction.id, transaction.amount, transaction.description, transaction.category_id, transaction.type, transaction.date]
      );
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao importar dados:', error);
    throw error;
  }
};

// Função para salvar o histórico de saldo
export const saveBalanceHistory = async (balance: Balance): Promise<void> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Verificar se já existe um registro para hoje
    const existing = await db.getFirstAsync(
      'SELECT id FROM balance_history WHERE date = ?',
      [today]
    );
    
    if (existing) {
      // Atualizar registro existente
      await db.runAsync(
        'UPDATE balance_history SET total_balance = ?, income = ?, expense = ? WHERE date = ?',
        [balance.total, balance.income, balance.expense, today]
      );
    } else {
      // Inserir novo registro
      await db.runAsync(
        'INSERT INTO balance_history (total_balance, income, expense, date) VALUES (?, ?, ?, ?)',
        [balance.total, balance.income, balance.expense, today]
      );
    }
  } catch (error) {
    console.error('Erro ao salvar histórico de saldo:', error);
    throw error;
  }
};

// Função para obter o histórico de saldo por período
export const getBalanceHistory = async (days: number): Promise<{ date: string; total: number; income: number; expense: number }[]> => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const result = await db.getAllAsync(
      `SELECT date, total_balance as total, income, expense 
       FROM balance_history 
       WHERE date BETWEEN ? AND ? 
       ORDER BY date ASC`,
      [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]
    );
    
    return result as { date: string; total: number; income: number; expense: number }[];
  } catch (error) {
    console.error('Erro ao buscar histórico de saldo:', error);
    throw error;
  }
};

export default db; 
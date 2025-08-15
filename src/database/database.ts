import * as SQLite from 'expo-sqlite';
import { Transaction, Category, Balance } from '../types';

const db = SQLite.openDatabase('money_std.db');

export const initDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Tabela para categorias
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          color TEXT DEFAULT '#007AFF'
        );`,
        [],
        () => {
          // Inserir categorias padrão
          tx.executeSql(
            `INSERT OR IGNORE INTO categories (name, type, color) VALUES 
            ('Alimentação', 'expense', '#FF6B6B'),
            ('Transporte', 'expense', '#4ECDC4'),
            ('Moradia', 'expense', '#45B7D1'),
            ('Saúde', 'expense', '#96CEB4'),
            ('Educação', 'expense', '#FFEAA7'),
            ('Lazer', 'expense', '#DDA0DD'),
            ('Salário', 'income', '#2ECC71'),
            ('Freelance', 'income', '#F39C12'),
            ('Investimentos', 'income', '#9B59B6'),
            ('Outros', 'expense', '#95A5A6');`
          );
          
          // Limpar categorias duplicadas existentes
          tx.executeSql(
            `DELETE FROM categories WHERE id NOT IN (
              SELECT MIN(id) FROM categories 
              GROUP BY name, type
            );`
          );
        }
      );

      // Tabela para transações
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          description TEXT NOT NULL,
          amount REAL NOT NULL,
          type TEXT NOT NULL,
          category_id INTEGER,
          date TEXT NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES categories (id)
        );`
      );
    }, reject, resolve);
  });
};

export const getCategories = (type?: 'income' | 'expense' | null): Promise<Category[]> => {
  return new Promise((resolve, reject) => {
    const query = type 
      ? 'SELECT DISTINCT * FROM categories WHERE type = ? ORDER BY name'
      : 'SELECT DISTINCT * FROM categories ORDER BY type, name';
    const params = type ? [type] : [];
    
    db.transaction(tx => {
      tx.executeSql(query, params, (_, { rows }) => {
        // Remove duplicatas adicionais baseado no nome e tipo
        const uniqueCategories = rows._array.filter((category, index, self) => 
          index === self.findIndex(c => c.name === category.name && c.type === category.type)
        );
        resolve(uniqueCategories);
      }, (_, error) => {
        reject(error);
        return false;
      });
    });
  });
};

export const addTransaction = (transaction: Omit<Transaction, 'id'>): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO transactions (description, amount, type, category_id, date) VALUES (?, ?, ?, ?, ?)',
        [transaction.description, transaction.amount, transaction.type, transaction.category_id, transaction.date],
        (_, { insertId }) => {
          resolve(insertId || 0);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

interface TransactionFilters {
  type?: 'income' | 'expense';
  category_id?: number;
  start_date?: string;
  end_date?: string;
}

export const getTransactions = (filters: TransactionFilters = {}): Promise<Transaction[]> => {
  return new Promise((resolve, reject) => {
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

    db.transaction(tx => {
      tx.executeSql(query, params, (_, { rows }) => {
        resolve(rows._array);
      }, (_, error) => {
        reject(error);
        return false;
      });
    });
  });
};

export const deleteTransaction = (id: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM transactions WHERE id = ?',
        [id],
        (_, { rowsAffected }) => {
          resolve(rowsAffected);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const getBalance = (): Promise<Balance> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT 
          SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
          SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense
        FROM transactions`,
        [],
        (_, { rows }) => {
          const result = rows._array[0];
          const total = (result.total_income || 0) - (result.total_expense || 0);
          resolve({
            total,
            income: result.total_income || 0,
            expense: result.total_expense || 0
          });
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const addCategory = (category: Omit<Category, 'id'>): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO categories (name, type, color) VALUES (?, ?, ?)',
        [category.name, category.type, category.color],
        (_, { insertId }) => {
          resolve(insertId || 0);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const deleteCategory = (id: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Primeiro, atualiza transações que usam esta categoria para "Sem categoria"
      tx.executeSql(
        'UPDATE transactions SET category_id = NULL WHERE category_id = ?',
        [id],
        (_, { rowsAffected }) => {
          // Depois, deleta a categoria
          tx.executeSql(
            'DELETE FROM categories WHERE id = ?',
            [id],
            (_, { rowsAffected: deleteRows }) => {
              resolve(deleteRows);
            },
            (_, error) => {
              reject(error);
              return false;
            }
          );
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const exportDataAsJSON = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Buscar todas as categorias
      tx.executeSql(
        'SELECT * FROM categories ORDER BY id',
        [],
        (_, categoriesResult) => {
          // Buscar todas as transações
          tx.executeSql(
            'SELECT * FROM transactions ORDER BY id',
            [],
            (_, transactionsResult) => {
              const exportData = {
                version: '1.0.0',
                exportDate: new Date().toISOString(),
                categories: categoriesResult.rows._array,
                transactions: transactionsResult.rows._array
              };
              
              resolve(JSON.stringify(exportData, null, 2));
            },
            (_, error) => {
              reject(error);
              return false;
            }
          );
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const importDataFromJSON = async (jsonData: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      const data = JSON.parse(jsonData);
      
      // Validar estrutura do JSON
      if (!data.categories || !data.transactions) {
        reject(new Error('Formato JSON inválido'));
        return;
      }
      
      db.transaction(tx => {
        // Limpar dados existentes
        tx.executeSql('DELETE FROM transactions', [], () => {
          tx.executeSql('DELETE FROM categories', [], () => {
            // Importar categorias
            let categoriesImported = 0;
            const totalCategories = data.categories.length;
            
            data.categories.forEach((category: any) => {
              tx.executeSql(
                'INSERT INTO categories (id, name, type, color) VALUES (?, ?, ?, ?)',
                [category.id, category.name, category.type, category.color],
                () => {
                  categoriesImported++;
                  if (categoriesImported === totalCategories) {
                    // Importar transações
                    let transactionsImported = 0;
                    const totalTransactions = data.transactions.length;
                    
                    if (totalTransactions === 0) {
                      resolve(true);
                      return;
                    }
                    
                    data.transactions.forEach((transaction: any) => {
                      tx.executeSql(
                        'INSERT INTO transactions (id, amount, description, category_id, type, date) VALUES (?, ?, ?, ?, ?, ?)',
                        [transaction.id, transaction.amount, transaction.description, transaction.category_id, transaction.type, transaction.date],
                        () => {
                          transactionsImported++;
                          if (transactionsImported === totalTransactions) {
                            resolve(true);
                          }
                        },
                        (_, error) => {
                          reject(error);
                          return false;
                        }
                      );
                    });
                  }
                },
                (_, error) => {
                  reject(error);
                  return false;
                }
              );
            });
          }, (_, error) => {
            reject(error);
            return false;
          });
        }, (_, error) => {
          reject(error);
          return false;
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};

export default db; 
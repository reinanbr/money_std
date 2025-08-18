import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Chip, SegmentedButtons, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { Transaction, Category } from '../types';

import TransactionItem from '../components/TransactionItem';
import AddTransactionModal from '../components/AddTransactionModal';
import { getTransactions, updateTransaction, deleteTransaction, getCategories } from '../database/database';

const TransactionsScreen: React.FC = () => {
  const { colors, dark: isDarkMode } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, selectedType, selectedCategory]);

  const loadData = async (): Promise<void> => {
    try {
      const [transactionsData, categoriesData] = await Promise.all([
        getTransactions(),
        getCategories()
      ]);
      
      setTransactions(transactionsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filterTransactions = (): void => {
    let filtered = [...transactions];

    if (selectedType !== 'all') {
      filtered = filtered.filter(t => t.type === selectedType);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category_id === parseInt(selectedCategory));
    }

    setFilteredTransactions(filtered);
  };

  const handleUpdateTransaction = async (id: number, transaction: Omit<Transaction, 'id'>): Promise<void> => {
    try {
      await updateTransaction(id, transaction);
      await loadData();
      setModalVisible(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
    }
  };

  const handleDeleteTransaction = async (id: number): Promise<void> => {
    try {
      await deleteTransaction(id);
      await loadData();
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
    }
  };

  const openEditModal = (transaction: Transaction): void => {
    setEditingTransaction(transaction);
    setModalVisible(true);
  };

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Sem categoria';
  };

  const getTotalAmount = (): number => {
    return filteredTransactions.reduce((total, transaction) => {
      return total + (transaction.type === 'income' ? transaction.amount : -transaction.amount);
    }, 0);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Carregando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]}>Transações</Text>
        </View>
        
        <SegmentedButtons
          value={selectedType}
          onValueChange={setSelectedType}
          buttons={[
            { 
              value: 'all', 
              label: 'Todas',
              style: { 
                backgroundColor: selectedType === 'all' ? '#FF9800' : 'transparent'
              }
            },
            { 
              value: 'income', 
              label: 'Receitas',
              style: { 
                backgroundColor: selectedType === 'income' ? '#FF9800' : 'transparent'
              }
            },
            { 
              value: 'expense', 
              label: 'Despesas',
              style: { 
                backgroundColor: selectedType === 'expense' ? '#FF9800' : 'transparent'
              }
            }
          ]}
          style={styles.segmentedButtons}
          theme={{
            colors: {
              primary: '#FF9800',
              onSurface: isDarkMode ? '#FFFFFF' : '#000000',
              onSurfaceVariant: isDarkMode ? '#FFFFFF' : '#666666',
              onPrimary: '#FF9800',
              surface: colors.surface,
              surfaceVariant: colors.surface,
              outline: colors.border,
            }
          }}
        />

        <View style={styles.categoriesContainer}>
          <Chip
            selected={selectedCategory === 'all'}
            onPress={() => setSelectedCategory('all')}
            style={[
              styles.categoryChip, 
              { 
                backgroundColor: selectedCategory === 'all' ? '#FF9800' : colors.surface,
                borderColor: selectedCategory === 'all' ? '#FF9800' : colors.border
              }
            ]}
            textStyle={{ 
              color: selectedCategory === 'all' ? '#FFFFFF' : colors.text 
            }}
          >
            Todas as categorias
          </Chip>
          {categories
            .filter(cat => selectedType === 'all' || cat.type === selectedType)
            .filter((category, index, self) => 
              // Remove duplicatas baseado no nome e tipo
              index === self.findIndex(c => c.name === category.name && c.type === category.type)
            )
            .map((category) => (
              <Chip
                key={`${category.id}-${category.type}`}
                selected={selectedCategory === category.id.toString()}
                onPress={() => setSelectedCategory(category.id.toString())}
                style={[
                  styles.categoryChip,
                  { 
                    backgroundColor: selectedCategory === category.id.toString() ? '#FF9800' : colors.surface,
                    borderColor: selectedCategory === category.id.toString() ? '#FF9800' : category.color
                  }
                ]}
                textStyle={{ 
                  color: selectedCategory === category.id.toString() ? '#FFFFFF' : colors.text 
                }}
              >
                {category.name}
              </Chip>
            ))}
        </View>

        {filteredTransactions.length > 0 && (
          <View style={styles.summary}>
            <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
              Total: {filteredTransactions.length} transação{filteredTransactions.length !== 1 ? 'ões' : ''}
            </Text>
            <Text style={[
              styles.summaryAmount,
              { color: getTotalAmount() >= 0 ? '#2ECC71' : '#E74C3C' }
            ]}>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(Math.abs(getTotalAmount()))}
            </Text>
          </View>
        )}
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TransactionItem
            transaction={item}
            onDelete={handleDeleteTransaction}
            onEdit={openEditModal}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Nenhuma transação encontrada
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.placeholder }]}>
              {selectedType !== 'all' || selectedCategory !== 'all' 
                ? 'Tente ajustar os filtros'
                : 'Adicione sua primeira transação na tela inicial'
              }
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />

      <AddTransactionModal
        visible={modalVisible}
        onDismiss={() => {
          setModalVisible(false);
          setEditingTransaction(null);
        }}
        onSave={() => {}} // Não usado nesta tela
        onUpdate={handleUpdateTransaction}
        type={editingTransaction?.type || 'expense'}
        editingTransaction={editingTransaction}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryChip: {
    margin: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default TransactionsScreen; 
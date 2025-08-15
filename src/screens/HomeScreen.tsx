import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { FAB, Text, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { Transaction, Balance } from '../types';

import BalanceCard from '../components/BalanceCard';
import TransactionItem from '../components/TransactionItem';
import AddTransactionModal from '../components/AddTransactionModal';
import { initDatabase, getBalance, getTransactions, addTransaction, deleteTransaction } from '../database/database';

const HomeScreen: React.FC = () => {
  const { colors } = useTheme();
  const [balance, setBalance] = useState<Balance>({ total: 0, income: 0, expense: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'income' | 'expense'>('expense');

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async (): Promise<void> => {
    try {
      await initDatabase();
      await loadData();
    } catch (error) {
      console.error('Erro ao inicializar app:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadData = async (): Promise<void> => {
    try {
      const [balanceData, transactionsData] = await Promise.all([
        getBalance(),
        getTransactions()
      ]);
      
      setBalance(balanceData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAddTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<void> => {
    try {
      await addTransaction(transaction);
      await loadData();
      setModalVisible(false);
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
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

  const openModal = (type: 'income' | 'expense'): void => {
    setModalType(type);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TransactionItem
            transaction={item}
            onDelete={handleDeleteTransaction}
          />
        )}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Text style={[styles.pageTitle, { color: colors.text }]}>Início</Text>
            </View>
            <BalanceCard balance={balance} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Transações Recentes</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Nenhuma transação encontrada
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.placeholder }]}>
              Adicione sua primeira transação tocando no botão +
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.fabContainer}>
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => openModal('expense')}
          label="Despesa"
        />
        <FAB
          icon="plus"
          style={[styles.fab, styles.fabIncome]}
          onPress={() => openModal('income')}
          label="Receita"
        />
      </View>

      <AddTransactionModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        onSave={handleAddTransaction}
        type={modalType}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginVertical: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    gap: 12,
  },
  fab: {
    backgroundColor: '#E74C3C',
  },
  fabIncome: {
    backgroundColor: '#2ECC71',
  },
});

export default HomeScreen; 
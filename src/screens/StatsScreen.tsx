import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, Card, Title, Paragraph, ActivityIndicator, IconButton, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';

import { useTheme } from '../context/ThemeContext';
import { getBalance, getTransactions } from '../database/database';
import { Transaction, Balance, CategoryStats, MonthlyData, PieChartData } from '../types';

const { width } = Dimensions.get('window');

interface CategoryStat {
  name: string;
  color: string;
  total: number;
  count: number;
  type: 'income' | 'expense';
}

interface MonthlyStat {
  income: number;
  expense: number;
  balance: number;
  count: number;
}

type PeriodType = '3months' | '6months' | '12months' | '1year';

const StatsScreen: React.FC = () => {
  const { colors, dark: isDarkMode } = useTheme();
  const [balance, setBalance] = useState<Balance>({ total: 0, income: 0, expense: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [pieChartData, setPieChartData] = useState<PieChartData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('6months');
  const [showPeriodOptions, setShowPeriodOptions] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      generateMonthlyData();
    }
  }, [transactions, selectedPeriod]);

  const loadData = async (): Promise<void> => {
    try {
      const [balanceData, transactionsData] = await Promise.all([
        getBalance(),
        getTransactions()
      ]);
      
      setBalance(balanceData);
      setTransactions(transactionsData);
      calculateCategoryStats(transactionsData);
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

  const calculateCategoryStats = (transactions: Transaction[]): void => {
    const stats: { [key: string]: CategoryStat } = {};
    
    transactions.forEach(transaction => {
      const categoryName = transaction.category_name || 'Sem categoria';
      const categoryColor = transaction.category_color || '#95A5A6';
      
      if (!stats[categoryName]) {
        stats[categoryName] = {
          name: categoryName,
          color: categoryColor,
          total: 0,
          count: 0,
          type: transaction.type
        };
      }
      
      stats[categoryName].total += transaction.amount;
      stats[categoryName].count += 1;
    });

    const statsArray = Object.values(stats)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5); // Top 5 categorias

    setCategoryStats(statsArray);
    
    // Gerar dados para o gráfico de pizza (apenas despesas)
    const expenseStats = Object.values(stats).filter(stat => stat.type === 'expense');
    const pieData: PieChartData[] = expenseStats.slice(0, 6).map(stat => ({
      name: stat.name,
      amount: stat.total,
      color: stat.color,
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    }));
    setPieChartData(pieData);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getPercentage = (amount: number, total: number): string => {
    if (total === 0) return '0';
    return ((amount / total) * 100).toFixed(1);
  };

  const getMonthlyStats = (): MonthlyStat => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpense = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income: monthlyIncome,
      expense: monthlyExpense,
      balance: monthlyIncome - monthlyExpense,
      count: monthlyTransactions.length
    };
  };

  const getPeriodLabel = (): string => {
    switch (selectedPeriod) {
      case '3months': return 'Últimos 3 Meses';
      case '6months': return 'Últimos 6 Meses';
      case '12months': return 'Últimos 12 Meses';
      case '1year': return 'Último Ano';
      default: return 'Últimos 6 Meses';
    }
  };

  const getPeriodMonths = (): number => {
    switch (selectedPeriod) {
      case '3months': return 3;
      case '6months': return 6;
      case '12months': return 12;
      case '1year': return 12;
      default: return 6;
    }
  };

  const generateMonthlyData = (): void => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const periodMonths = getPeriodMonths();
    
    const monthlyData: MonthlyData[] = [];
    
    // Gerar dados do período selecionado
    for (let i = periodMonths - 1; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
      
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === monthIndex && 
               transactionDate.getFullYear() === year;
      });

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      monthlyData.push({
        month: months[monthIndex],
        income: income,
        expense: expense
      });
    }
    
    setMonthlyData(monthlyData);
  };

  const monthlyStats = getMonthlyStats();

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
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]}>Estatísticas</Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowPeriodOptions(!showPeriodOptions)}
          style={[styles.periodButton, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Text style={[styles.periodButtonText, { color: colors.text }]}>
            {getPeriodLabel()}
          </Text>
          <IconButton
            icon={showPeriodOptions ? "chevron-up" : "chevron-down"}
            size={20}
            iconColor={colors.text}
          />
        </TouchableOpacity>
      </View>

      {showPeriodOptions && (
        <View style={[styles.periodOptions, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity
            style={[
              styles.periodOption, 
              { borderBottomColor: colors.border },
              selectedPeriod === '3months' && { backgroundColor: colors.primary + '20' }
            ]}
            onPress={() => {
              setSelectedPeriod('3months');
              setShowPeriodOptions(false);
            }}
          >
            <Text style={[styles.periodOptionText, { color: colors.text }]}>Últimos 3 Meses</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodOption, 
              { borderBottomColor: colors.border },
              selectedPeriod === '6months' && { backgroundColor: colors.primary + '20' }
            ]}
            onPress={() => {
              setSelectedPeriod('6months');
              setShowPeriodOptions(false);
            }}
          >
            <Text style={[styles.periodOptionText, { color: colors.text }]}>Últimos 6 Meses</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodOption, 
              { borderBottomColor: colors.border },
              selectedPeriod === '12months' && { backgroundColor: colors.primary + '20' }
            ]}
            onPress={() => {
              setSelectedPeriod('12months');
              setShowPeriodOptions(false);
            }}
          >
            <Text style={[styles.periodOptionText, { color: colors.text }]}>Últimos 12 Meses</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodOption, 
              { borderBottomColor: colors.border },
              selectedPeriod === '1year' && { backgroundColor: colors.primary + '20' }
            ]}
            onPress={() => {
              setSelectedPeriod('1year');
              setShowPeriodOptions(false);
            }}
          >
            <Text style={[styles.periodOptionText, { color: colors.text }]}>Último Ano</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        {/* Resumo Geral */}
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <Card.Content>
            <Title style={{ color: colors.text }}>Resumo Geral</Title>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Receitas Totais</Text>
                <Text style={[styles.statValue, { color: '#2ECC71' }]}>
                  {formatCurrency(balance.income)}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Despesas Totais</Text>
                <Text style={[styles.statValue, { color: '#E74C3C' }]}>
                  {formatCurrency(balance.expense)}
                </Text>
              </View>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Saldo Total</Text>
              <Text style={[
                styles.statValue,
                { color: balance.total >= 0 ? '#2ECC71' : '#E74C3C' }
              ]}>
                {formatCurrency(balance.total)}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Gráfico de Linha - Evolução do Período Selecionado */}
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <Card.Content>
            <Title style={{ color: colors.text }}>Evolução - {getPeriodLabel()}</Title>
            {monthlyData.length > 0 ? (
              <LineChart
                data={{
                  labels: monthlyData.map(item => item.month),
                  datasets: [
                    {
                      data: monthlyData.map(item => item.income),
                      color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
                      strokeWidth: 2
                    },
                    {
                      data: monthlyData.map(item => item.expense),
                      color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
                      strokeWidth: 2
                    }
                  ]
                }}
                width={width - 64}
                height={220}
                chartConfig={{
                  backgroundColor: colors.card,
                  backgroundGradientFrom: colors.card,
                  backgroundGradientTo: colors.card,
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(${isDarkMode ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(${isDarkMode ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
                  style: {
                    borderRadius: 16
                  },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: '#ffa726'
                  }
                }}
                bezier
                style={styles.chart}
              />
            ) : (
              <Text style={styles.emptyText}>Dados insuficientes para gerar gráfico</Text>
            )}
          </Card.Content>
        </Card>

        {/* Gráfico de Pizza - Distribuição de Despesas */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Distribuição de Despesas por Categoria</Title>
            {pieChartData.length > 0 ? (
              <PieChart
                data={pieChartData.map(item => ({
                  ...item,
                  population: item.amount // react-native-chart-kit usa 'population' para o valor
                }))}
                width={width - 64}
                height={220}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
                style={styles.chart}
              />
            ) : (
              <Text style={styles.emptyText}>Nenhuma despesa registrada</Text>
            )}
          </Card.Content>
        </Card>

        {/* Gráfico de Barras - Comparação Receitas vs Despesas */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Receitas vs Despesas - Este Mês</Title>
            <BarChart
              data={{
                labels: ['Receitas', 'Despesas'],
                datasets: [
                  {
                    data: [monthlyStats.income, monthlyStats.expense]
                  }
                ]
              }}
              width={width - 64}
              height={220}
              yAxisLabel="R$ "
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                barPercentage: 0.7,
              }}
              style={styles.chart}
              fromZero
            />
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#2ECC71' }]} />
                <Text style={styles.legendText}>Receitas: {formatCurrency(monthlyStats.income)}</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#E74C3C' }]} />
                <Text style={styles.legendText}>Despesas: {formatCurrency(monthlyStats.expense)}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Estatísticas do Mês */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Resumo do Mês Atual</Title>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Receitas</Text>
                <Text style={[styles.statValue, { color: '#2ECC71' }]}>
                  {formatCurrency(monthlyStats.income)}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Despesas</Text>
                <Text style={[styles.statValue, { color: '#E74C3C' }]}>
                  {formatCurrency(monthlyStats.expense)}
                </Text>
              </View>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Saldo do Mês</Text>
              <Text style={[
                styles.statValue,
                { color: monthlyStats.balance >= 0 ? '#2ECC71' : '#E74C3C' }
              ]}>
                {formatCurrency(monthlyStats.balance)}
              </Text>
            </View>
            <Text style={styles.transactionCount}>
              {monthlyStats.count} transação{monthlyStats.count !== 1 ? 'ões' : ''} este mês
            </Text>
          </Card.Content>
        </Card>

        {/* Top Categorias */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Top Categorias</Title>
            {categoryStats.length > 0 ? (
              categoryStats.map((category, index) => (
                <View key={category.name} style={styles.categoryRow}>
                  <View style={styles.categoryInfo}>
                    <View style={[
                      styles.categoryColor,
                      { backgroundColor: category.color }
                    ]} />
                    <View style={styles.categoryDetails}>
                      <Text style={styles.categoryName}>{category.name}</Text>
                      <Text style={styles.categoryCount}>
                        {category.count} transação{category.count !== 1 ? 'ões' : ''}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.categoryAmount}>
                    <Text style={[
                      styles.categoryValue,
                      { color: category.type === 'income' ? '#2ECC71' : '#E74C3C' }
                    ]}>
                      {formatCurrency(category.total)}
                    </Text>
                    <Text style={styles.categoryPercentage}>
                      {getPercentage(category.total, 
                        category.type === 'income' ? balance.income : balance.expense
                      )}%
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Nenhuma transação encontrada</Text>
            )}
          </Card.Content>
        </Card>

        {/* Informações Gerais */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Informações</Title>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Total de Transações:</Text>
              <Text style={styles.infoValue}>{transactions.length}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Média por Transação:</Text>
              <Text style={styles.infoValue}>
                {transactions.length > 0 
                  ? formatCurrency(balance.expense / transactions.filter(t => t.type === 'expense').length)
                  : formatCurrency(0)
                }
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Maior Transação:</Text>
              <Text style={styles.infoValue}>
                {transactions.length > 0 
                  ? formatCurrency(Math.max(...transactions.map(t => t.amount)))
                  : formatCurrency(0)
                }
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  periodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 150,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  periodOptions: {
    position: 'absolute',
    top: 80,
    left: 16,
    right: 16,
    borderRadius: 8,
    borderWidth: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1000,
  },
  periodOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  periodOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  card: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
    borderRadius: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  transactionCount: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryDetails: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  categoryCount: {
    fontSize: 12,
    color: '#666',
  },
  categoryAmount: {
    alignItems: 'flex-end',
  },
  categoryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
});

export default StatsScreen; 
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import { Balance } from '../types';

interface BalanceCardProps {
  balance: Balance;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance }) => {
  const { colors } = useTheme();
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card style={[styles.card, { backgroundColor: colors.card }]}>
      <Card.Content style={styles.cardContent}>
        <Title style={[styles.title, { color: colors.text }]}>Saldo Total</Title>
        <Paragraph style={[
          styles.balance,
          { color: balance.total >= 0 ? colors.success : colors.error }
        ]}>
          {formatCurrency(balance.total)}
        </Paragraph>
        
        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Paragraph style={[styles.summaryLabel, { color: colors.textSecondary }]}>Receitas</Paragraph>
            <Paragraph style={[styles.summaryValue, { color: colors.success }]}>
              {formatCurrency(balance.income)}
            </Paragraph>
          </View>
          
          <View style={styles.summaryItem}>
            <Paragraph style={[styles.summaryLabel, { color: colors.textSecondary }]}>Despesas</Paragraph>
            <Paragraph style={[styles.summaryValue, { color: colors.error }]}>
              {formatCurrency(balance.expense)}
            </Paragraph>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 4,
    borderRadius: 12,
    paddingHorizontal: 4,
  },
  cardContent: {
    paddingHorizontal: 8,
    paddingVertical: 24,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 2,
  },
  balance: {
    textAlign: 'center',
    fontSize: 30,
    marginTop: 0,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 8,
    paddingVertical: 18,
    flexWrap: 'wrap',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BalanceCard; 
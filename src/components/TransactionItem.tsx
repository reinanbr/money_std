import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, IconButton } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import { Transaction } from '../types';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete?: (id: number) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onDelete }) => {
  const { colors } = useTheme();
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const isIncome = transaction.type === 'income';

  return (
    <Card style={[styles.card, { backgroundColor: colors.card }]}>
      <Card.Content style={styles.content}>
        <View style={styles.leftContent}>
          <View style={[
            styles.categoryIndicator,
            { backgroundColor: transaction.category_color || '#95A5A6' }
          ]} />
          
          <View style={styles.transactionInfo}>
            <Title style={[styles.description, { color: colors.text }]} numberOfLines={1}>
              {transaction.description}
            </Title>
            <Paragraph style={[styles.category, { color: colors.textSecondary }]}>
              {transaction.category_name || 'Sem categoria'}
            </Paragraph>
            <Paragraph style={[styles.date, { color: colors.placeholder }]}>
              {formatDate(transaction.date)}
            </Paragraph>
          </View>
        </View>

        <View style={styles.rightContent}>
          <Paragraph style={[
            styles.amount,
            { color: isIncome ? colors.success : colors.error }
          ]}>
            {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
          </Paragraph>
          
          {onDelete && (
            <IconButton
              icon="delete"
              size={20}
              onPress={() => onDelete(transaction.id)}
              style={styles.deleteButton}
              iconColor={colors.error}
            />
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 4,
    elevation: 2,
    borderRadius: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  leftContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  deleteButton: {
    margin: 0,
  },
});

export default TransactionItem; 
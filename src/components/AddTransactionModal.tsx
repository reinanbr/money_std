import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  Modal, 
  Portal, 
  TextInput, 
  Button, 
  Title, 
  SegmentedButtons,
  Chip,
  Text
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Category, Transaction } from '../types';
import { useTheme } from '../context/ThemeContext';

interface AddTransactionModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (transaction: Omit<import('../types').Transaction, 'id'>) => void;
  onUpdate?: (id: number, transaction: Omit<import('../types').Transaction, 'id'>) => void;
  type?: 'income' | 'expense';
  editingTransaction?: Transaction | null;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ 
  visible, 
  onDismiss, 
  onSave, 
  onUpdate,
  type = 'expense',
  editingTransaction = null
}) => {
  const { colors, dark: isDarkMode } = useTheme();
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'income' | 'expense'>(type);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  useEffect(() => {
    if (selectedType) {
      loadCategories();
    }
  }, [selectedType]);

  // Carregar categorias quando o modal abrir
  useEffect(() => {
    if (visible && selectedType) {
      loadCategories();
    }
  }, [visible, selectedType]);

  // Atualizar selectedType quando o prop type mudar
  useEffect(() => {
    setSelectedType(type);
    // Reset do formulário quando mudar o tipo
    setDescription('');
    setAmount('');
    setSelectedCategory(null);
    setDate(new Date());
  }, [type]);

  // Carregar dados da transação quando estiver editando
  useEffect(() => {
    if (editingTransaction) {
      setDescription(editingTransaction.description);
      setAmount(editingTransaction.amount.toString());
      setSelectedType(editingTransaction.type);
      setSelectedCategory(editingTransaction.category_id);
      setDate(new Date(editingTransaction.date));
    }
  }, [editingTransaction]);

  const loadCategories = async (): Promise<void> => {
    try {
      const { getCategories } = require('../database/database');
      const cats = await getCategories(selectedType);
      setCategories(cats);
      setSelectedCategory(cats.length > 0 ? cats[0].id : null);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const handleSave = (): void => {
    if (!description.trim() || !amount.trim() || !selectedCategory) {
      return;
    }

    const transaction = {
      description: description.trim(),
      amount: parseFloat(amount.replace(',', '.')),
      type: selectedType,
      category_id: selectedCategory,
      date: date.toISOString().split('T')[0]
    };

    if (editingTransaction && onUpdate) {
      onUpdate(editingTransaction.id, transaction);
    } else {
      onSave(transaction);
    }
    
    // Reset form
    setDescription('');
    setAmount('');
    setDate(new Date());
  };

  const handleDismiss = (): void => {
    // Reset form ao fechar
    setDescription('');
    setAmount('');
    setDate(new Date());
    onDismiss();
  };

  const formatCurrency = (value: string): string => {
    return value.replace(/[^\d,]/g, '').replace(',', '.');
  };

  const onDateChange = (event: any, selectedDate?: Date): void => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleDismiss}
        contentContainerStyle={[styles.modal, { backgroundColor: colors.surface }]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Title style={[styles.title, { color: colors.text }]}>
            {editingTransaction 
              ? (selectedType === 'income' ? 'Editar Receita' : 'Editar Despesa')
              : (selectedType === 'income' ? 'Nova Receita' : 'Nova Despesa')
            }
          </Title>

          <SegmentedButtons
            value={selectedType}
            onValueChange={(value) => {
              setSelectedType(value as 'income' | 'expense');
            }}
            buttons={[
              { 
                value: 'expense', 
                label: 'Despesa',
                style: { 
                  backgroundColor: selectedType === 'expense' ? '#FF9800' : 'transparent'
                }
              },
              { 
                value: 'income', 
                label: 'Receita',
                style: { 
                  backgroundColor: selectedType === 'income' ? '#FF9800' : 'transparent'
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
                onSecondary: '#FF9800',
                secondary: '#FF9800',
                onTertiary: '#FF9800',
                tertiary: '#FF9800',
              }
            }}
          />

          <TextInput
            label="Descrição"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            style={styles.input}
            maxLength={100}
            textColor={colors.text}
            theme={{
              colors: {
                primary: colors.primary,
                onSurface: colors.text,
                onSurfaceVariant: colors.textSecondary,
                outline: colors.border,
              }
            }}
          />

          <TextInput
            label="Valor"
            value={amount}
            onChangeText={(text) => setAmount(formatCurrency(text))}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
            left={
              <TextInput.Affix text="R$" textStyle={{
                color: isDarkMode ? '#9E9E9E' : '#000000',
                fontSize: 16,
                fontWeight: '500'
              }} />
            }
            textColor={colors.text}
            theme={{
              colors: {
                primary: colors.primary,
                onSurface: colors.text,
                onSurfaceVariant: colors.textSecondary,
                outline: colors.border,
                onSurfaceDisabled: colors.textSecondary,
              }
            }}
          />

          <Text style={[styles.label, { color: colors.text }]}>Data</Text>
          <Button
            mode="outlined"
            onPress={() => setShowDatePicker(true)}
            style={[styles.dateButton, { borderColor: colors.border }]}
            textColor={colors.text}
          >
            {date.toLocaleDateString('pt-BR')}
          </Button>

          <Text style={[styles.label, { color: colors.text }]}>Categoria</Text>
          <View style={styles.categoriesContainer}>
            {categories.map((category) => (
              <Chip
                key={category.id}
                selected={selectedCategory === category.id}
                onPress={() => setSelectedCategory(category.id)}
                style={[
                  styles.categoryChip,
                  { borderColor: colors.border },
                  selectedCategory === category.id && {
                    backgroundColor: category.color + '20',
                    borderColor: category.color
                  }
                ]}
                textStyle={{
                  color: selectedCategory === category.id ? category.color : colors.textSecondary
                }}
              >
                {category.name}
              </Chip>
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={handleDismiss}
              style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}
              textColor={colors.text}
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              style={[styles.button, styles.saveButton]}
              disabled={!description.trim() || !amount.trim() || !selectedCategory}
            >
              {editingTransaction ? 'Atualizar' : 'Salvar'}
            </Button>
          </View>
        </ScrollView>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
            maximumDate={new Date()}
          />
        )}
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 20,
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  segmentedButtons: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  dateButton: {
    marginBottom: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  categoryChip: {
    margin: 4,
    borderWidth: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
  },
  cancelButton: {
    // borderColor será aplicado dinamicamente
  },
  saveButton: {
    // backgroundColor será aplicado pelo tema do Paper
  },
});

export default AddTransactionModal; 
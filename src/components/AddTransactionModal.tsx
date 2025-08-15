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
import { Category } from '../types';

interface AddTransactionModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (transaction: Omit<import('../types').Transaction, 'id'>) => void;
  type?: 'income' | 'expense';
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ 
  visible, 
  onDismiss, 
  onSave, 
  type = 'expense' 
}) => {
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'income' | 'expense'>(type);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  useEffect(() => {
    loadCategories();
  }, [selectedType]);

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

    onSave(transaction);
    
    // Reset form
    setDescription('');
    setAmount('');
    setDate(new Date());
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
        onDismiss={onDismiss}
        contentContainerStyle={styles.modal}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Title style={styles.title}>
            {selectedType === 'income' ? 'Nova Receita' : 'Nova Despesa'}
          </Title>

          <SegmentedButtons
            value={selectedType}
            onValueChange={setSelectedType}
            buttons={[
              { value: 'expense', label: 'Despesa' },
              { value: 'income', label: 'Receita' }
            ]}
            style={styles.segmentedButtons}
          />

          <TextInput
            label="Descrição"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            style={styles.input}
            maxLength={100}
          />

          <TextInput
            label="Valor"
            value={amount}
            onChangeText={(text) => setAmount(formatCurrency(text))}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
            left={<TextInput.Affix text="R$ " />}
          />

          <Text style={styles.label}>Data</Text>
          <Button
            mode="outlined"
            onPress={() => setShowDatePicker(true)}
            style={styles.dateButton}
          >
            {date.toLocaleDateString('pt-BR')}
          </Button>

          <Text style={styles.label}>Categoria</Text>
          <View style={styles.categoriesContainer}>
            {categories.map((category) => (
              <Chip
                key={category.id}
                selected={selectedCategory === category.id}
                onPress={() => setSelectedCategory(category.id)}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && {
                    backgroundColor: category.color + '20',
                    borderColor: category.color
                  }
                ]}
                textStyle={{
                  color: selectedCategory === category.id ? category.color : '#666'
                }}
              >
                {category.name}
              </Chip>
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={onDismiss}
              style={[styles.button, styles.cancelButton]}
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              style={[styles.button, styles.saveButton]}
              disabled={!description.trim() || !amount.trim() || !selectedCategory}
            >
              Salvar
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
    backgroundColor: 'white',
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
    color: '#333',
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
    borderColor: '#ddd',
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
    borderColor: '#666',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
});

export default AddTransactionModal; 
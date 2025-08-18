import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Share, Clipboard, Platform, Linking } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { 
  List, 
  Text, 
  Divider, 
  IconButton, 
  Dialog, 
  Portal, 
  TextInput, 
  Button,
  Chip,
  Card
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';
import { getCategories, addCategory, deleteCategory, exportDataAsJSON, importDataFromJSON } from '../database/database';
import { Category } from '../types';

interface NewCategory {
  name: string;
  type: 'income' | 'expense';
  color: string;
}

const SettingsScreen: React.FC = () => {
  const { colors } = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddCategory, setShowAddCategory] = useState<boolean>(false);
  const [showAbout, setShowAbout] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<NewCategory>({ 
    name: '', 
    type: 'expense', 
    color: '#007AFF' 
  });
  const [showImportDialog, setShowImportDialog] = useState<boolean>(false);
  const [importJsonData, setImportJsonData] = useState<string>('');

  const categoryColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
    '#DDA0DD', '#2ECC71', '#F39C12', '#9B59B6', '#95A5A6',
    '#E74C3C', '#3498DB', '#F1C40F', '#8E44AD', '#16A085'
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async (): Promise<void> => {
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const handleAddCategory = async (): Promise<void> => {
    if (!newCategory.name.trim()) {
      Alert.alert('Erro', 'Por favor, insira um nome para a categoria');
      return;
    }

    try {
      await addCategory(newCategory);
      setNewCategory({ name: '', type: 'expense', color: '#007AFF' });
      setShowAddCategory(false);
      loadCategories();
      Alert.alert('Sucesso', 'Categoria adicionada com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao adicionar categoria');
    }
  };

  const handleDeleteCategory = async (categoryId: number, categoryName: string): Promise<void> => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir a categoria "${categoryName}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCategory(categoryId);
              loadCategories();
              Alert.alert('Sucesso', 'Categoria excluída com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Erro ao excluir categoria');
            }
          },
        },
      ]
    );
  };

  const exportData = async (): Promise<void> => {
    try {
      const jsonData = await exportDataAsJSON();
      
      // Criar nome do arquivo com data atual
      const now = new Date();
      const fileName = `money_std_backup_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.json`;
      
      Alert.alert(
        'Exportar Dados',
        'Escolha como deseja exportar os dados:',
        [
          {
            text: 'Salvar JSON',
            onPress: async () => {
              try {
                // Tentar usar a pasta Downloads do dispositivo
                let downloadsPath;
                
                if (Platform.OS === 'android') {
                  // No Android, tentar usar a pasta Downloads pública
                  const androidDownloadsPath = `${FileSystem.documentDirectory}../Downloads/${fileName}`;
                  const appDocumentsPath = `${FileSystem.documentDirectory}${fileName}`;
                  
                  try {
                    // Tentar salvar na pasta Downloads primeiro
                    await FileSystem.writeAsStringAsync(androidDownloadsPath, jsonData, {
                      encoding: FileSystem.EncodingType.UTF8,
                    });
                    downloadsPath = androidDownloadsPath;
                  } catch (error) {
                    // Se falhar, salvar na pasta Documents do app
                    await FileSystem.writeAsStringAsync(appDocumentsPath, jsonData, {
                      encoding: FileSystem.EncodingType.UTF8,
                    });
                    downloadsPath = appDocumentsPath;
                  }
                } else {
                  // No iOS, usar a pasta Documents
                  downloadsPath = `${FileSystem.documentDirectory}${fileName}`;
                  await FileSystem.writeAsStringAsync(downloadsPath, jsonData, {
                    encoding: FileSystem.EncodingType.UTF8,
                  });
                }
                
                showFileSavedInfo(fileName, downloadsPath, jsonData);
              } catch (error) {
                console.error('Erro ao salvar arquivo:', error);
                Alert.alert('❌ Erro', 'Erro ao salvar arquivo. Tente novamente.');
              }
            }
          },
          {
            text: 'Compartilhar',
            onPress: async () => {
              try {
                const shareResult = await Share.share({
                  title: 'Money STD - Backup de Dados',
                  message: `Backup dos dados do Money STD gerado em ${now.toLocaleDateString('pt-BR')}\n\n${jsonData}`,
                });
                
                if (shareResult.action === Share.sharedAction) {
                  Alert.alert('Sucesso', 'Dados compartilhados com sucesso!');
                }
              } catch (error) {
                Alert.alert('Erro', 'Erro ao compartilhar dados.');
              }
            }
          },
          {
            text: 'Cancelar',
            style: 'cancel'
          }
        ]
      );
      
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      Alert.alert('Erro', 'Erro ao exportar dados. Tente novamente.');
    }
  };

  const importData = async (): Promise<void> => {
    Alert.alert(
      'Importar Dados',
      'Escolha como deseja importar os dados:',
      [
        {
          text: '📁 Selecionar Arquivo',
          onPress: async () => {
            try {
              const result = await DocumentPicker.getDocumentAsync({
                type: 'application/json',
                copyToCacheDirectory: true,
              });

              if (result.canceled) {
                return;
              }

              const file = result.assets[0];
              if (!file) {
                Alert.alert('❌ Erro', 'Nenhum arquivo selecionado.');
                return;
              }

              // Ler o conteúdo do arquivo
              const fileContent = await FileSystem.readAsStringAsync(file.uri);
              
              // Processar a importação
              await processImportData(fileContent, file.name);
            } catch (error) {
              console.error('Erro ao selecionar arquivo:', error);
              Alert.alert('❌ Erro', 'Erro ao selecionar arquivo. Tente novamente.');
            }
          }
        },
        {
          text: '📝 Colar JSON',
          onPress: () => setShowImportDialog(true)
        },
        {
          text: 'Cancelar',
          style: 'cancel'
        }
      ]
    );
  };

  const processImportData = async (jsonData: string, fileName: string): Promise<void> => {
    if (!jsonData.trim()) {
      Alert.alert('Erro', 'Por favor, insira os dados JSON.');
      return;
    }
    try {
      Alert.alert(
        'Confirmar Importação',
        `Esta ação irá substituir todos os dados atuais.\n\nArquivo: ${fileName}\n\nTem certeza?`,
        [
          {
            text: 'Cancelar',
            style: 'cancel'
          },
          {
            text: 'Importar',
            style: 'destructive',
            onPress: async () => {
              try {
                await importDataFromJSON(jsonData);
                setImportJsonData('');
                setShowImportDialog(false);
                loadCategories(); // Recarregar categorias
                Alert.alert('✅ Sucesso', 'Dados importados com sucesso!');
              } catch (error) {
                console.error('Erro ao importar dados:', error);
                Alert.alert('❌ Erro', 'Erro ao importar dados. Verifique se o JSON é válido.');
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('❌ Erro', 'JSON inválido. Verifique o formato dos dados.');
    }
  };

  const clearData = (): void => {
    Alert.alert(
      'Limpar Dados',
      'Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Limpar Dados', 'Funcionalidade em desenvolvimento');
          },
        },
      ]
    );
  };

  const showFileSavedInfo = (fileName: string, filePath: string, jsonData: string): void => {
    Alert.alert(
      '✅ Arquivo Salvo com Sucesso!', 
      `📁 Nome: ${fileName}\n📂 Local: ${filePath}\n📊 Tamanho: ${(jsonData.length / 1024).toFixed(2)} KB`,
      [
        {
          text: '📤 Compartilhar Arquivo',
          onPress: async () => {
            try {
              await shareFile(filePath, fileName);
            } catch (error) {
              Alert.alert('❌ Erro', 'Erro ao compartilhar arquivo.');
            }
          }
        },
        {
          text: '📱 Abrir Gerenciador',
          onPress: async () => {
            await openFileManager(filePath, fileName);
          }
        },
        {
          text: '✅ OK',
          style: 'default'
        }
      ]
    );
  };

  const shareFile = async (filePath: string, fileName: string): Promise<void> => {
    try {
      // Verificar se o arquivo existe
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      
      if (!fileInfo.exists) {
        Alert.alert('❌ Erro', 'Arquivo não encontrado.');
        return;
      }

      // Verificar se o compartilhamento está disponível
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (!isAvailable) {
        Alert.alert('❌ Erro', 'Compartilhamento não está disponível neste dispositivo.');
        return;
      }

      // Compartilhar o arquivo usando expo-sharing
      await Sharing.shareAsync(filePath, {
        mimeType: 'application/json',
        dialogTitle: 'Compartilhar Backup Money STD',
        UTI: 'public.json'
      });

      Alert.alert('✅ Sucesso', 'Arquivo compartilhado com sucesso!');
    } catch (error) {
      console.error('Erro ao compartilhar arquivo:', error);
      Alert.alert('❌ Erro', 'Erro ao compartilhar arquivo. Tente novamente.');
    }
  };

  const openFileManager = async (filePath: string, fileName: string): Promise<void> => {
    try {
      if (Platform.OS === 'android') {
        // No Android, mostrar instruções para encontrar o arquivo
        const directoryPath = filePath.substring(0, filePath.lastIndexOf('/'));
        
        Alert.alert(
          '📁 Local do Arquivo',
          `Arquivo salvo com sucesso!\n\n📂 Diretório: ${directoryPath}\n📄 Arquivo: ${fileName}\n\nPara acessar:\n1. Abra o app "Arquivos"\n2. Navegue até o diretório acima\n3. Procure pelo arquivo ${fileName}`,
          [
            {
              text: '📤 Compartilhar Localização',
              onPress: async () => {
                await Share.share({
                  title: 'Local do Arquivo Money STD',
                  message: `Arquivo salvo em: ${filePath}`,
                });
              }
            },
            {
              text: '📁 Tentar Abrir',
              onPress: async () => {
                try {
                  // Tentar abrir o diretório pai
                  const parentDir = directoryPath.substring(0, directoryPath.lastIndexOf('/'));
                  await Linking.openURL(`file://${parentDir}`);
                } catch (error) {
                  Alert.alert('❌ Erro', 'Não foi possível abrir o gerenciador automaticamente. Use as instruções acima.');
                }
              }
            },
            {
              text: '✅ OK',
              style: 'default'
            }
          ]
        );
      } else {
        // No iOS, tentar abrir o arquivo diretamente
        try {
          await Linking.openURL(`file://${filePath}`);
        } catch (error) {
          Alert.alert('❌ Erro', 'Não foi possível abrir o arquivo automaticamente.');
        }
      }
    } catch (error) {
      console.error('Erro ao abrir gerenciador:', error);
      Alert.alert('❌ Erro', 'Não foi possível abrir o gerenciador de arquivos.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Configurações</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categorias */}
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Categorias</Text>
              <IconButton
                icon="plus"
                size={20}
                onPress={() => setShowAddCategory(true)}
                iconColor={colors.primary}
              />
            </View>
            <View style={styles.categoriesContainer}>
              {categories.map((category) => (
                <View key={category.id} style={styles.categoryItem}>
                  <Chip
                    style={[
                      styles.categoryChip,
                      { 
                        borderColor: category.color,
                        backgroundColor: colors.surface
                      }
                    ]}
                    textStyle={{ color: colors.text }}
                  >
                    {category.name}
                  </Chip>
                  <IconButton
                    icon="delete"
                    size={16}
                    onPress={() => handleDeleteCategory(category.id, category.name)}
                    iconColor={colors.error}
                  />
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Dados */}
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Dados</Text>
            <List.Item
              title="Exportar Dados"
              description="Salvar backup dos dados"
              left={(props) => <List.Icon {...props} icon="export" />}
              onPress={exportData}
              titleStyle={{ color: colors.text }}
              descriptionStyle={{ color: colors.textSecondary }}
            />
            <Divider />
            <List.Item
              title="Importar Dados"
              description="Restaurar backup"
              left={(props) => <List.Icon {...props} icon="import" />}
              onPress={importData}
              titleStyle={{ color: colors.text }}
              descriptionStyle={{ color: colors.textSecondary }}
            />
            <Divider />
            <List.Item
              title="Limpar Dados"
              description="Excluir todas as transações"
              left={(props) => <List.Icon {...props} icon="delete" />}
              onPress={clearData}
              titleStyle={{ color: colors.error }}
              descriptionStyle={{ color: colors.textSecondary }}
            />
          </Card.Content>
        </Card>

        {/* Sobre */}
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Sobre</Text>
            <List.Item
              title="Sobre o App"
              description="Informações e versão"
              left={(props) => <List.Icon {...props} icon="information" />}
              onPress={() => setShowAbout(true)}
              titleStyle={{ color: colors.text }}
              descriptionStyle={{ color: colors.textSecondary }}
            />
            <Divider />
            <List.Item
              title="Suporte"
              description="Ajuda e contato"
              left={(props) => <List.Icon {...props} icon="help-circle" />}
              onPress={() => Alert.alert('Suporte', 'Entre em contato: suporte@moneystd.com')}
              titleStyle={{ color: colors.text }}
              descriptionStyle={{ color: colors.textSecondary }}
            />
            <Divider />
            <List.Item
              title="Avaliar App"
              description="Deixe sua avaliação"
              left={(props) => <List.Icon {...props} icon="star" />}
              onPress={() => Alert.alert('Avaliar', 'Funcionalidade em desenvolvimento')}
              titleStyle={{ color: colors.text }}
              descriptionStyle={{ color: colors.textSecondary }}
            />
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Dialog para adicionar categoria */}
      <Portal>
        <Dialog 
          visible={showAddCategory} 
          onDismiss={() => setShowAddCategory(false)}
          style={{ backgroundColor: colors.card }}
          theme={{
            colors: {
              surface: colors.card,
              onSurface: colors.text,
              primary: colors.primary,
              onPrimary: colors.text,
              elevation: {
                level0: colors.elevation.level0,
                level1: colors.elevation.level1,
                level2: colors.elevation.level2,
                level3: colors.elevation.level3,
                level4: colors.elevation.level4,
                level5: colors.elevation.level5,
              }
            }
          }}
        >
          <Dialog.Title style={{ color: colors.text }}>Adicionar Categoria</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Nome da Categoria"
              value={newCategory.name}
              onChangeText={(text) => setNewCategory({ ...newCategory, name: text })}
              mode="outlined"
              style={styles.input}
              theme={{ colors: { primary: colors.primary, placeholder: colors.placeholder } }}
            />
            
            <Text style={[styles.colorLabel, { color: colors.text }]}>Cor:</Text>
            <View style={styles.colorContainer}>
              {categoryColors.map((color) => (
                <View
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    newCategory.color === color && styles.selectedColor
                  ]}
                  onTouchEnd={() => setNewCategory({ ...newCategory, color })}
                />
              ))}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAddCategory(false)} textColor={colors.textSecondary}>Cancelar</Button>
            <Button onPress={handleAddCategory} textColor={colors.primary}>Adicionar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Dialog sobre o app */}
      <Portal>
        <Dialog 
          visible={showAbout} 
          onDismiss={() => setShowAbout(false)}
          style={{ backgroundColor: colors.card }}
          theme={{
            colors: {
              surface: colors.card,
              onSurface: colors.text,
              primary: colors.primary,
              onPrimary: colors.text,
              elevation: {
                level0: colors.elevation.level0,
                level1: colors.elevation.level1,
                level2: colors.elevation.level2,
                level3: colors.elevation.level3,
                level4: colors.elevation.level4,
                level5: colors.elevation.level5,
              }
            }
          }}
        >
          <Dialog.Title style={{ color: colors.text }}>Sobre o Money STD</Dialog.Title>
          <Dialog.Content>
            <Text style={[styles.aboutText, { color: colors.text }]}>
              <Text style={[styles.aboutTitle, { color: colors.text }]}>Money STD v1.0.0</Text>{'\n\n'}
              Um aplicativo completo para controle financeiro pessoal.{'\n\n'}
              <Text style={[styles.aboutSubtitle, { color: colors.text }]}>Funcionalidades:</Text>{'\n'}
              • Adicionar receitas e despesas{'\n'}
              • Categorização automática{'\n'}
              • Gráficos e estatísticas{'\n'}
              • Modo dark/light automático{'\n'}
              • Armazenamento local{'\n\n'}
              <Text style={[styles.aboutSubtitle, { color: colors.text }]}>Desenvolvido com:</Text>{'\n'}
              React Native, TypeScript, Expo, SQLite{'\n\n'}
              © 2024 Money STD
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAbout(false)} textColor={colors.primary}>Fechar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Dialog para importar dados */}
      <Portal>
        <Dialog
          visible={showImportDialog}
          onDismiss={() => setShowImportDialog(false)}
          style={{ backgroundColor: colors.card }}
          theme={{
            colors: {
              surface: colors.card,
              onSurface: colors.text,
              primary: colors.primary,
              onPrimary: colors.text,
              elevation: {
                level0: colors.elevation.level0,
                level1: colors.elevation.level1,
                level2: colors.elevation.level2,
                level3: colors.elevation.level3,
                level4: colors.elevation.level4,
                level5: colors.elevation.level5,
              }
            }
          }}
        >
          <Dialog.Title style={{ color: colors.text }}>Importar Dados</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Dados JSON para Importar"
              value={importJsonData}
              onChangeText={(text) => setImportJsonData(text)}
              mode="outlined"
              multiline
              numberOfLines={10}
              style={styles.input}
              theme={{ colors: { primary: colors.primary, placeholder: colors.placeholder } }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowImportDialog(false)} textColor={colors.textSecondary}>Cancelar</Button>
            <Button onPress={() => processImportData(importJsonData, 'dados.json')} textColor={colors.primary}>Importar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  card: {
    margin: 16,
    marginTop: 8,
    elevation: 2,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryChip: {
    borderWidth: 1,
  },
  input: {
    marginBottom: 16,
  },
  colorLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#FF9800',
    borderWidth: 3,
  },
  aboutText: {
    lineHeight: 20,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  aboutSubtitle: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsScreen; 
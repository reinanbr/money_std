import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const { colors } = useTheme();

  useEffect(() => {
    // Simples timeout sem animações
    const timer = setTimeout(() => {
      onFinish();
    }, 2000); // 2 segundos simples

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Ícone do App */}
        <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
          <MaterialCommunityIcons
            name="wallet"
            size={80}
            color="#FFFFFF"
          />
          <View style={[styles.iconOverlay, { backgroundColor: colors.primary }]}>
            <MaterialCommunityIcons
              name="plus"
              size={24}
              color="#FFFFFF"
            />
          </View>
        </View>

        {/* Título do App */}
        <Text style={[styles.title, { color: colors.text }]}>
          Money STD
        </Text>

        {/* Subtítulo */}
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Controle Financeiro Pessoal
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    position: 'relative',
  },
  iconOverlay: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
});

export default SplashScreen;
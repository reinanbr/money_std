import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Appearance, Platform } from 'react-native';
import { Theme } from '../types';

interface ThemeContextType extends Theme {
  // Removendo toggleTheme pois não será mais necessário
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Função para detectar o modo escuro
  const detectDarkMode = () => {
    const colorScheme = Appearance.getColorScheme();
    setIsDarkMode(colorScheme === 'dark');
  };

  useEffect(() => {
    // Detectar o modo inicial
    detectDarkMode();
    
    // Configurar listener para mudanças
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkMode(colorScheme === 'dark');
    });

    return () => {
      if (subscription?.remove) {
        subscription.remove();
      }
    };
  }, []);

  const theme: ThemeContextType = {
    dark: isDarkMode,
    themeMode: 'system', // Sempre 'system'
    colors: isDarkMode ? {
      primary: '#007AFF',
      accent: '#FF6B6B',
      background: '#121212',
      surface: '#1E1E1E',
      card: '#2D2D2D',
      text: '#FFFFFF',
      textSecondary: '#B0B0B0',
      placeholder: '#666666',
      border: '#404040',
      success: '#4CAF50',
      error: '#F44336',
      warning: '#FF9800',
      info: '#2196F3',
      elevation: {
        level0: 'none',
        level1: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
        level2: '0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
        level3: '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.30)',
        level4: '0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 4px 0px rgba(0, 0, 0, 0.30)',
        level5: '0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 5px 0px rgba(0, 0, 0, 0.30)',
      }
    } : {
      primary: '#007AFF',
      accent: '#FF6B6B',
      background: '#f5f5f5',
      surface: '#ffffff',
      card: '#ffffff',
      text: '#333333',
      textSecondary: '#666666',
      placeholder: '#999999',
      border: '#e0e0e0',
      success: '#2ECC71',
      error: '#E74C3C',
      warning: '#F39C12',
      info: '#3498DB',
      elevation: {
        level0: 'none',
        level1: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
        level2: '0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
        level3: '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.30)',
        level4: '0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 4px 0px rgba(0, 0, 0, 0.30)',
        level5: '0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 5px 0px rgba(0, 0, 0, 0.30)',
      }
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}; 
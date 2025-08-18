import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import HomeScreen from './src/screens/HomeScreen';
import TransactionsScreen from './src/screens/TransactionsScreen';
import StatsScreen from './src/screens/StatsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

type TabParamList = {
  Home: undefined;
  Transactions: undefined;
  Stats: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const AppContent: React.FC = () => {
  const { colors, dark: isDarkMode } = useTheme();

  const paperTheme = {
    colors: {
      primary: colors.primary,
      accent: colors.accent,
      background: colors.background,
      surface: colors.surface,
      text: colors.text,
      placeholder: colors.placeholder,
      onSurface: colors.text,
      onPrimary: colors.text,
    },
    dark: isDarkMode,
    elevation: {
      level0: 'none',
      level1: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
      level2: '0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
      level3: '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.30)',
      level4: '0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 4px 0px rgba(0, 0, 0, 0.30)',
      level5: '0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 5px 0px rgba(0, 0, 0, 0.30)',
    }
  };

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer
        theme={{
          dark: isDarkMode,
          colors: {
            primary: colors.primary,
            background: colors.background,
            card: colors.surface,
            text: colors.text,
            border: colors.border,
            notification: colors.primary,
          },
        }}
      >
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: string;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Transactions') {
                iconName = focused ? 'format-list-bulleted' : 'format-list-bulleted';
              } else if (route.name === 'Stats') {
                iconName = focused ? 'chart-line' : 'chart-line';
              } else if (route.name === 'Settings') {
                iconName = focused ? 'cog' : 'cog-outline';
              } else {
                iconName = 'help';
              }

              return <MaterialCommunityIcons name={iconName as any} size={size} color={color} />;
            },
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textSecondary,
            tabBarStyle: {
              backgroundColor: colors.surface,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              paddingBottom: 5,
              paddingTop: 5,
              height: 60,
            },
            headerStyle: {
              backgroundColor: colors.primary,
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ 
              title: 'Início',
              headerShown: false
            }} 
          />
          <Tab.Screen 
            name="Transactions" 
            component={TransactionsScreen} 
            options={{ 
              title: 'Transações',
              headerShown: false
            }} 
          />
          <Tab.Screen 
            name="Stats" 
            component={StatsScreen} 
            options={{ 
              title: 'Estatísticas',
              headerShown: false
            }} 
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsScreen} 
            options={{ 
              title: 'Configurações',
              headerShown: false
            }} 
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App; 
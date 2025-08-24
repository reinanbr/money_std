import React from 'react';
import { StatusBar as RNStatusBar } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface CustomStatusBarProps {
  backgroundColor?: string;
}

const CustomStatusBar: React.FC<CustomStatusBarProps> = ({ backgroundColor }) => {
  const { colors } = useTheme();

  const statusBarColor = backgroundColor || colors.primary;

  return (
    <RNStatusBar
      backgroundColor={statusBarColor}
      barStyle="light-content"
      translucent={false}
    />
  );
};

export default CustomStatusBar; 
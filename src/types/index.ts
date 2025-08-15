export interface Transaction {
  id: number;
  amount: number;
  description: string;
  category_id: number;
  type: 'income' | 'expense';
  date: string;
  category_name?: string;
  category_color?: string;
}

export interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
  color: string;
}

export interface Balance {
  total: number;
  income: number;
  expense: number;
}

export interface ThemeColors {
  primary: string;
  accent: string;
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  placeholder: string;
  border: string;
  success: string;
  error: string;
  warning: string;
  info: string;
  elevation: {
    level0: string;
    level1: string;
    level2: string;
    level3: string;
    level4: string;
    level5: string;
  };
}

export interface Theme {
  dark: boolean;
  colors: ThemeColors;
  themeMode: 'system' | 'light' | 'dark';
}

export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }[];
}

export interface PieChartData {
  name: string;
  amount: number;
  color: string;
  legendFontColor?: string;
  legendFontSize?: number;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

export interface CategoryStats {
  category: string;
  amount: number;
  percentage: number;
  color: string;
} 
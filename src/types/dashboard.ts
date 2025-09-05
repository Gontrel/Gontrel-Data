export interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  trend: 'up' | 'down';
  chartData?: number[];
  chartColor?: string;
}

export interface BarChartCardProps {
  title: string;
  data: {
    labels: string[];
    values: number[];
  };
  colors: string[];
  height?: number;
  showLegend?: boolean;
}

export interface DashboardGridProps {
  children: React.ReactNode;
  className?: string;
}

export interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
}
